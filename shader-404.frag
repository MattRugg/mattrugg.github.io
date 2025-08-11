#version 300 es
precision mediump float;
out vec4 fragColor;
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

// https://www.shadertoy.com/view/4djSRW
float hash11(float p) {
    vec3 p3  = fract(vec3(p) * 443.8975);
    p3 += dot(p3, p3.yzx + 19.19);
    return 2.0*fract((p3.x + p3.y) * p3.z)-1.0;
}

float noise(float t) {
    float i = floor(t);
    float f = fract(t);

    return mix(hash11(i) * f, hash11(i+1.0) * (f - 1.0), f);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 coord = vec2(4.0,-4.0)*fragCoord/iResolution.xy + vec2(-2.0,2.0);
    coord.x *= iResolution.x/iResolution.y;

    vec2 delta = vec2(noise(iTime), noise(iTime+60.0)) * abs(noise(20.0*iTime));

    float rho2c = dot(coord-delta,coord-delta);
    float rho2m = dot(coord,coord);
    float rho2y = dot(coord+delta,coord+delta);

    vec3 cmy = vec3(rho2c, rho2m, rho2y) - 0.2;
    cmy = 0.00125/(cmy*cmy);

    fragColor = vec4(vec3(1.00) - cmy,1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
