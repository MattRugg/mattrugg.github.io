// Load fragment shader from external file
fetch('shader.frag')
    .then(response => response.text())
    .then(shaderSource => {
        const canvas = document.getElementById('shader-canvas');
        const gl = canvas.getContext('webgl2');
        // Resize canvas to div
        function resize() {
            const div = document.getElementById('shader-div');
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.round(div.clientWidth * dpr);
            canvas.height = Math.round(div.clientHeight * dpr);
            canvas.style.width = div.clientWidth + 'px';
            canvas.style.height = div.clientHeight + 'px';
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        window.addEventListener('resize', resize);
        resize();

        // Vertex shader
        const vertShaderSrc = `#version 300 es\n
            in vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
            }
        `;
        function createShader(type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                const log = gl.getShaderInfoLog(shader);
                console.error('Shader compile error:', log, '\nSource:', source);
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }
        const vertShader = createShader(gl.VERTEX_SHADER, vertShaderSrc);
        const fragShader = createShader(gl.FRAGMENT_SHADER, shaderSource);

        // Program
        const program = gl.createProgram();
        if (vertShader) gl.attachShader(program, vertShader);
        if (fragShader) gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(program);
            console.error('Program link error:', log);
        }
        gl.useProgram(program);

        // Quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1, 1, -1, -1, 1,
                -1, 1, 1, -1, 1, 1
            ]),
            gl.STATIC_DRAW
        );
        const posLoc = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        const iTimeLoc = gl.getUniformLocation(program, 'iTime');
        const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');
        const iMouseLoc = gl.getUniformLocation(program, 'iMouse');

        // Mouse state for iMouse
        let mouse = [0, 0, 0, 0];
        canvas.addEventListener('mousemove', e => {
            const rect = canvas.getBoundingClientRect();
            mouse[0] = e.clientX - rect.left;
            mouse[1] = canvas.height - (e.clientY - rect.top);
        });
        canvas.addEventListener('mousedown', e => {
            mouse[2] = mouse[0];
            mouse[3] = mouse[1];
        });
        canvas.addEventListener('mouseup', e => {
            mouse[2] = 0;
            mouse[3] = 0;
        });

        // Render loop
        function render(time) {
            resize();
            gl.uniform1f(iTimeLoc, time * 0.001);
            gl.uniform3f(iResolutionLoc, canvas.width, canvas.height, 1.0);
            gl.uniform4f(iMouseLoc, ...mouse);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    });
