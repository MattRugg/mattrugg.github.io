#version 300 es
precision mediump float;
out vec4 fragColor;
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

// Here you can disable some character groups to make the compiled code smaller
#define DIGITS     1     // Compile and render decimal digits
#define CHARACTERS 0     // Compile and render chracters
#define SYMBOLS    0     // Compile and render symbols
#define CHAR_LCASE 0     // Compile and render lowercase chracters
#define CHAR_UCASE 0     // Compile and render uppercase chracters
// Thicker digits
#define SHADE      .01

float scale = 1.0 / 10.0;
const float charSpacing = 0.2;
const float qpi = atan(1.0);
const float hpi = qpi*2.0;
const float pi = qpi*4.0;
const float tau = pi*2.0;
vec3 charColor = vec3(0.2,0.2,0.2);

//Distance to a line segment, with start and end point
float dfLine(vec2 start, vec2 end, vec2 uv) {
    end += start;
	start *= scale;
	end *= scale;

	vec2 line = end - start;
	float frac = dot(uv - start,line) / dot(line,line);
	return distance(start + line * clamp(frac, 0.0, 1.0), uv);
}

//Distance to a line segment, with start point and relative end
float dfLine(vec2 start, vec3 dir, vec2 uv) {
    float x = dir.z / sqrt(dir.x*dir.x + dir.y*dir.y);
    vec2 end = (dir.xy * x) + start;
	start *= scale;
	end *= scale;

	vec2 line = end - start;
	float frac = dot(uv - start,line) / dot(line,line);
	return distance(start + line * clamp(frac, 0.0, 1.0), uv);
}

//Distance to the edge of a circle.
float dfCircle(vec2 origin, float radius, vec2 uv) {
	origin *= scale;
	radius *= scale;

	return abs(length(uv - origin) - radius);
}

//Distance to an arc.
float dfArc(vec2 origin, float start, float sweep, float radius, vec2 uv) {
	origin *= scale;
	radius *= scale;

	uv -= origin;
	uv = uv*mat2(cos(start), sin(start),-sin(start), cos(start));
	
	float offs = (sweep / 2.0 - pi);
	float ang = mod(atan(uv.y, uv.x) - offs, tau) + offs;
	ang = clamp(ang, min(0.0, sweep), max(0.0, sweep));
	
	return distance(radius * vec2(cos(ang), sin(ang)), uv);
}

float dfChar(inout vec2 start, int char, vec2 uv) {
    uv -= start;
    float dist = 1e6;
    float width = 0.0;
    
    if (char < 100) {
   
        switch (char) {

#if DIGITS
            case 0:
                dist = min(dist, dfLine(vec2(1.000,1.000), vec2(0.000,-0.500), uv));
                dist = min(dist, dfLine(vec2(0.000,1.000), vec2(0.000,-0.500), uv));
                dist = min(dist, dfArc(vec2(0.500,1.000),0.000, 3.142, 0.500, uv));
                dist = min(dist, dfArc(vec2(0.500,0.500),3.142, 3.142, 0.500, uv));
                width = 1.1;
                break;
            case 1:
                dist = min(dist, dfLine(vec2(0.100,0.000), vec2(0.000,1.500), uv));
                width = 0.3;
                break;
            case 2:
                dist = min(dist, dfLine(vec2(0.000,0.000), vec2(1.000,0.000), uv));
                dist = min(dist, dfLine(vec2(0.388,0.561), vec2(0.418,0.158), uv));
                dist = min(dist, dfArc(vec2(0.500,1.000),0.000, 3.142, 0.500, uv));
                dist = min(dist, dfArc(vec2(0.700,1.000),5.074, 1.209, 0.300, uv));
                dist = min(dist, dfArc(vec2(0.600,0.000),1.932, 1.209, 0.600, uv));
                width = 1.0;
                break;
            case 3:
                dist = min(dist, dfLine(vec2(0.000,1.500), vec2(1.000,0.000), uv));
                dist = min(dist, dfLine(vec2(1.000,1.500), vec2(-0.500,-0.500), uv));
                dist = min(dist, dfArc(vec2(0.500,0.500),3.142, 4.712, 0.500, uv));
                width = 1.0;
                break;
            case 4:
                dist = min(dist, dfLine(vec2(0.000,0.500), vec2(0.700,1.000), uv));
                dist = min(dist, dfLine(vec2(0.000,0.500), vec2(1.000,0.000), uv));
                dist = min(dist, dfLine(vec2(0.700,0.000), vec2(0.000,1.500), uv));
                width = 1.1;
                break;
            case 5:
                dist = min(dist, dfLine(vec2(0.300,1.500), vec2(0.700,0.000), uv));
                dist = min(dist, dfLine(vec2(0.200,0.900), vec2(0.100, 0.600), uv));
                dist = min(dist, dfArc(vec2(0.500,0.500),3.142, 5.356, 0.500, uv));
                width = 1.0;
                break;
            case 6:
                dist = min(dist, dfLine(vec2(0.067,0.750), vec2(0.433,0.750), uv));
                dist = min(dist, dfCircle(vec2(0.500,0.500), 0.500, uv));
                width = 1.0;
                break;
            case 7:
                dist = min(dist, dfLine(vec2(0.000,1.500), vec2(1.000,0.000), uv));
                dist = min(dist, dfLine(vec2(1.000,1.500), vec2(-0.500,-1.500), uv));
                width = 1.0;
                break;
            case 8:
                dist = min(dist, dfCircle(vec2(0.500,0.400), 0.400, uv));
                dist = min(dist, dfCircle(vec2(0.500,1.150), 0.350, uv));
                width = 1.0;
                break;
            case 9:
                dist = min(dist, dfLine(vec2(0.500,0.000), vec2(0.433, 0.750), uv));
                dist = min(dist, dfCircle(vec2(0.500,1.000), 0.500, uv));
                width = 1.0;
                break;
        
#endif
#if SYMBOLS
            case  20: // <> space
                width = 0.6;
                break;
            case 21: // colon
                dist = min(dist, dfCircle(vec2(0.05, 1.1),0.05,uv));
                dist = min(dist, dfCircle(vec2(0.05, 0.2),0.05,uv));
                width = 0.1;
                break;
            case 22: // semi colon
                dist = min(dist, dfCircle(vec2(0.05, 1.1),0.05,uv));
                dist = min(dist, dfArc(vec2(0.05, 0.2),-qpi,pi*1.5,0.05,uv));
                dist = min(dist, dfLine(vec2(0.08,0.16), vec2(-0.07, -0.1), uv));
                dist = min(dist, dfLine(vec2(0.02,0.16), vec2(-0.02, -0.1), uv));
                width = 0.1;
                break;
            case 30: // plus
                dist = min(dist, dfLine(vec2(0.0,0.5), vec2(1.0, 0.0), uv));
                dist = min(dist, dfLine(vec2(0.5,1.0), vec2(0.0, -1.0), uv));
                width = 1.0;
                break;
            case 31: // minus
                dist = min(dist, dfLine(vec2(0.0,0.5), vec2(1.0, 0.0), uv));
                width = 1.0;
                break;
            case 32: // multiply
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(1.0, 1.0), uv));
                dist = min(dist, dfLine(vec2(0.0,1.0), vec2(1.0, -1.0), uv));
                width = 1.0;
                break;
            case 33: // divide
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(1.0, 1.0), uv));
                width = 1.0;
                break;
            case 34: // sqrt
                dist = min(dist, dfLine(vec2(0.0,1.0), vec2(0.3, -0.7), uv));
                dist = min(dist, dfLine(vec2(0.3,0.3), vec2(0.3, 0.7), uv));
                dist = min(dist, dfLine(vec2(0.6,1.0), vec2(0.4, 0.0), uv));
                width = 1.0;
                break;
            case 39: // equals
                dist = min(dist, dfLine(vec2(0.0,0.8), vec2(1.0, 0.0), uv));
                dist = min(dist, dfLine(vec2(0.0,0.2), vec2(1.0, 0.0), uv));
                width = 1.0;
                break;
            
#endif
            default:
                
                break;
        }
    }

#if CHARACTERS
#if CHAR_LCASE
    if (char >= 100 && char < 200) {
        char -= 100;
        switch(char) {
            
                
            case  1: // 'a'
                dist = min(dist, dfLine(vec2(0.2,0.9), vec2(0.5,0.0), uv));
                dist = min(dist, dfArc( vec2(0.7,0.7), tau, hpi, 0.2, uv));
                dist = min(dist, dfLine(vec2(0.9,0.7), vec2(0.0,-0.7), uv));
                dist = min(dist, dfArc( vec2(0.7,0.3), hpi, -pi/6., 0.3, uv));
                dist = min(dist, dfLine(vec2(0.3,0.6), vec2(0.4,0.0), uv));
                dist = min(dist, dfArc( vec2(0.3,0.3), hpi, pi, 0.3, uv));
                dist = min(dist, dfLine(vec2(0.3,0.0), vec2(0.4,0.0), uv));
                dist = min(dist, dfArc( vec2(0.7,0.3), pi*1.5, pi/6., 0.3, uv));
                width = 1.0;
                break;

            case  2: // 'b'
                dist = min(dist, dfLine(vec2(0.00,1.5), vec2(0.0,-1.5), uv));
                dist = min(dist, dfArc (vec2(0.38,0.5),-(hpi+qpi), tau-hpi, 0.5, uv));
                width = 0.88;
                break;

            case  3: // 'c'
                dist = min(dist, dfArc(vec2(0.5,0.5),pi*.3, pi+pi*.4, 0.5, uv));
                width = 0.9;
                break;

            case  4: // 'd'
                dist = min(dist, dfLine(vec2(0.8,1.5), vec2(0.0,-1.5), uv));
                dist = min(dist, dfArc (vec2(0.42,0.5),(hpi-qpi), tau-hpi, 0.5, uv));
                width = 0.9;
                break;

            case  5: // 'e'
                dist = min(dist, dfLine(vec2(0.0,0.5), vec2(1.0,0.0), uv));
                dist = min(dist, dfArc(vec2(0.5,0.5),0.0, pi+hpi, 0.5, uv));
                dist = min(dist, dfLine(vec2(0.5,0.0), vec2(0.30,0.0), uv));
                width = 1.0;
                break;

            case  6: // 'f'
                dist = min(dist, dfLine(vec2(0.15,0.0), vec2(0.0,1.25), uv));
                dist = min(dist, dfArc(vec2(0.4,1.25),hpi, hpi, 0.25, uv));
                dist = min(dist, dfLine(vec2(0.4,1.5), vec2(0.15,0.0), uv));
                dist = min(dist, dfLine(vec2(0.0,0.75), vec2(0.5,0.0), uv));
                width = 0.5;
                break;

            case  7: // 'g'
                dist = min(dist, dfArc(vec2(0.5,0.5),qpi, pi+hpi, 0.5, uv));
                dist = min(dist, dfLine(vec2(0.9,1.0), vec2(0.0,-1.25), uv));
                dist = min(dist, dfArc(vec2(0.65,-0.25),-hpi, hpi, 0.25, uv));
                dist = min(dist, dfLine(vec2(0.35,-.5), vec2(0.3,0.0), uv));
                dist = min(dist, dfArc(vec2(0.35,-0.25),pi, hpi, 0.25, uv));
                width = 0.9;
                break;

            case  8: // 'h'
                dist = min(dist, dfLine(vec2(0.00,1.5), vec2(0.0,-1.5), uv));
                dist = min(dist, dfArc (vec2(0.4,0.5),0.0, pi, 0.4, uv));
                dist = min(dist, dfLine(vec2(0.8,0.5), vec2(0.0,-0.5), uv));
                width = 0.8;
                break;

            case  9: // 'i'
                dist = min(dist, dfLine(vec2(0.05,0.0), vec2(0.0,0.8), uv));
                dist = min(dist, dfCircle(vec2(0.05, 1.0),0.05,uv));
                width = 0.1;
                break;

            case 10: // 'j'
                dist = min(dist, dfLine(vec2(0.2,0.8), vec2(0.5,0.0), uv));
                dist = min(dist, dfLine(vec2(0.7,0.8), vec2(0.0,-0.9), uv));
                dist = min(dist, dfArc (vec2(0.4,-0.1), pi, pi, 0.3, uv));
                dist = min(dist, dfCircle(vec2(0.7, 1.0),0.05,uv));
                width = 0.75;
                break;

            case 11: // 'k'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,0.5), vec2(0.6,0.5), uv));
                dist = min(dist, dfLine(vec2(0.0,0.5), vec2(0.6,-0.5), uv));
                width = 0.6;
                break;

            case 12: // 'l'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.5), uv));
                width = 0.001;
                break;

            case 13: // 'm'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.0), uv));
                dist = min(dist, dfArc (vec2(0.3,0.7), 0.0, pi, 0.3, uv));
                dist = min(dist, dfLine(vec2(0.6,0.0), vec2(0.0,0.7), uv));
                dist = min(dist, dfArc (vec2(0.9,0.7), 0.0, pi, 0.3, uv));
                dist = min(dist, dfLine(vec2(1.2,0.0), vec2(0.0,0.7), uv));
                width = 1.2;
                break;

            case 14: // 'n'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.0), uv));
                dist = min(dist, dfArc (vec2(0.4,0.6), 0.0, pi, 0.4, uv));
                dist = min(dist, dfLine(vec2(0.8,0.0), vec2(0.0,0.6), uv));
                width = 0.8;
                break;

            case 15: // 'o'
                dist = min(dist, dfCircle(vec2(0.5, 0.5),0.5,uv));
                width = 1.0;
                break;

            case 16: // 'p'
                dist = min(dist, dfLine(vec2(0.00,1.0), vec2(0.0,-1.5), uv));
                dist = min(dist, dfArc (vec2(0.38,0.5),-(hpi+qpi), tau-hpi, 0.5, uv));
                width = 0.9;
                break;

            case 17: // 'q'
                dist = min(dist, dfLine(vec2(0.8,1.0), vec2(0.0,-1.5), uv));
                dist = min(dist, dfArc (vec2(0.42,0.5),(hpi-qpi), tau-hpi, 0.5, uv));
                width = 0.9;
                break;

            case 18: // 'r'
                dist = min(dist, dfLine(vec2(0.0,1.0), vec2(0.0,-1.0), uv));
                dist = min(dist, dfArc(vec2(0.25,0.75),hpi, hpi, 0.25, uv));
                dist = min(dist, dfLine(vec2(0.25,1.0), vec2(0.25,0.0), uv));
                dist = min(dist, dfArc(vec2(0.5,0.75),0.0, hpi, 0.25, uv));
                width = 0.75;
                break;

            case 19: // 's'
                dist = min(dist, dfArc(vec2(0.5,0.75),0.0, hpi, 0.25, uv));
                dist = min(dist, dfLine(vec2(0.25,1.0), vec2(0.25,0.0), uv));
                dist = min(dist, dfArc(vec2(0.25,0.75),hpi, hpi, 0.25, uv));
                dist = min(dist, dfArc(vec2(0.25,0.75),pi, hpi, 0.25, uv));
                dist = min(dist, dfLine(vec2(0.25,0.5), vec2(0.25,0.0), uv));
                dist = min(dist, dfArc(vec2(0.5,0.25),0.0, hpi, 0.25, uv));
                dist = min(dist, dfArc(vec2(0.5,0.25),-hpi, hpi, 0.25, uv));
                dist = min(dist, dfLine(vec2(0.25,0.0), vec2(0.25,0.0), uv));
                dist = min(dist, dfArc(vec2(0.25,0.25),pi, hpi, 0.25, uv));
                width = 0.75;
                break;
            case 20: // 't'
                dist = min(dist, dfLine(vec2(0.15,0.25), vec2(0.0,1.25), uv));
                dist = min(dist, dfArc(vec2(0.4,0.25),-pi, hpi, 0.25, uv));
                dist = min(dist, dfLine(vec2(0.4,0.0), vec2(0.15,0.0), uv));
                dist = min(dist, dfLine(vec2(0.0,1.0), vec2(0.5,0.0), uv));
                width = 0.5;
                break;

            case 21: // 'u'
                dist = min(dist, dfLine(vec2(0.0,0.4), vec2(0.0,0.6), uv));
                dist = min(dist, dfArc (vec2(0.4,0.4), pi, pi, 0.4, uv));
                dist = min(dist, dfLine(vec2(0.8,0.0), vec2(0.0,1.0), uv));
                width = 0.8;
                break;

            case 22: // 'v'
                dist = min(dist, dfLine(vec2(0.0,1.0), vec2(0.4,-1.0), uv));
                dist = min(dist, dfLine(vec2(0.4,0.0), vec2(0.4,1.0), uv));
                width = 0.8;
                break;

            case 23: // 'w'
                dist = min(dist, dfLine(vec2(0.0,1.0), vec2(0.3,-1.0), uv));
                dist = min(dist, dfLine(vec2(0.3,0.0), vec2(0.2,0.6), uv));
                dist = min(dist, dfLine(vec2(0.5,0.6), vec2(0.2,-0.6), uv));
                dist = min(dist, dfLine(vec2(0.7,0.0), vec2(0.3,1.0), uv));
                width = 1.0;
                break;

            case 24: // 'x'
                dist = min(dist, dfLine(vec2(0.0,1.0), vec2(0.7,-1.0), uv));
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.7,1.0), uv));
                width = 0.7;
                break;

            case 25: // 'y'

                dist = min(dist, dfLine(vec2(0.0,1.0), vec2(0.4,-0.9), uv));
                dist = min(dist, dfLine(vec2(0.7,1.0), vec2(-0.4,-1.25), uv));
                dist = min(dist, dfArc (vec2(0.05,-0.1), 4.9, qpi, 0.3, uv));
                width = 0.7;
                break;

            case 26: // 'z'
                dist = min(dist, dfLine(vec2(0.0,1.0), vec2(0.7,0.0), uv));
                dist = min(dist, dfLine(vec2(0.7,1.0), vec2(-0.7,-1.0), uv));
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.7,0.0), uv));
                width = 0.7;
                break;
        }
    }
#endif

#if CHAR_UCASE
    if (char > 200) {
        char -= 200;
        
        switch(char) {
            case  1: // 'A'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.45,1.5), uv));
                dist = min(dist, dfLine(vec2(0.45,1.5), vec2(0.45,-1.5), uv));
                dist = min(dist, dfLine(vec2(0.18,0.6), vec2(0.54,0.0), uv));
                width = 0.9;
                break;

            case  2: // 'B'
                dist = min(dist, dfLine(vec2(0.00,1.5), vec2(0.0,-1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.525,0.0), uv));
                dist = min(dist, dfArc (vec2(0.525,1.125),-(hpi), pi, 0.375, uv));
                dist = min(dist, dfLine(vec2(0.0,0.75), vec2(0.525,0.0), uv));
                dist = min(dist, dfArc (vec2(0.525,0.375),-(hpi), pi, 0.375, uv));
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.525,0.0), uv));
                width = 0.9;
                break;

            case  3: // 'C'
                dist = min(dist, dfArc(vec2(0.5,1.0),pi, -tau / 2.5, 0.5, uv));
                dist = min(dist, dfLine(vec2(0.0,1.0), vec2(0.0,-0.5), uv));
                dist = min(dist, dfArc(vec2(0.5,0.5),pi, tau / 2.5, 0.5, uv));
                width = 0.95;
                break;

            case  4: // 'D'
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.0,-1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.525,0.0), uv));
                dist = min(dist, dfArc (vec2(0.525,1.125), 0.0, hpi, 0.375, uv));
                dist = min(dist, dfLine(vec2(0.9,0.375), vec2(0.0,0.75), uv));
                dist = min(dist, dfArc (vec2(0.525,0.375), -hpi, hpi, 0.375, uv));
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.525,0.0), uv));
                width = 0.9;
                break;

            case  5: // 'E'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.8,0.0), uv));
                dist = min(dist, dfLine(vec2(0.0,0.8), vec2(0.7,0.0), uv));
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.8,0.0), uv));
                width = 0.8;
                break;

            case  6: // 'F'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.8,0.0), uv));
                dist = min(dist, dfLine(vec2(0.0,0.8), vec2(0.7,0.0), uv));
                width = 0.8;
                break;

            case  7: // 'G'
                dist = min(dist, dfArc (vec2(0.45,1.05), 0.0, pi, 0.45, uv));
                dist = min(dist, dfLine(vec2(0.0,0.45), vec2(0.0,0.6), uv));
                dist = min(dist, dfArc (vec2(0.45,0.45), pi, pi, 0.45, uv));
                dist = min(dist, dfLine(vec2(0.9,0.45), vec2(0.0,0.15), uv));
                dist = min(dist, dfLine(vec2(0.9,0.6), vec2(-0.5,0.0), uv));
                width = 0.9;
                break;

            case  8: // 'H'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,0.8), vec2(0.8,0.0), uv));
                dist = min(dist, dfLine(vec2(0.8,0.0), vec2(0.0,1.5), uv));
                width = 0.8;
                break;

            case  9: // 'I'
                dist = min(dist, dfLine(vec2(0.05,0.0), vec2(0.0,1.5), uv));
                width = 0.1;
                break;

            case 10: // 'J'
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.8,0.0), uv));
                dist = min(dist, dfLine(vec2(0.8,1.5), vec2(0.0,-1.1), uv));
                dist = min(dist, dfArc (vec2(0.4,0.4), pi, pi, 0.4, uv));
                width = 0.8;
                break;

            case 11: // 'K'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,0.65), vec2(0.8,0.85), uv));
                dist = min(dist, dfLine(vec2(0.2,0.83), vec2(0.6,-0.83), uv));
                width = 0.8;
                break;

            case 12: // 'L'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.8,0.0), uv));
                width = 0.8;
                break;

            case 13: // 'M'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.6,-0.5), uv));
                dist = min(dist, dfLine(vec2(0.6,1.0), vec2(0.6,0.5), uv));
                dist = min(dist, dfLine(vec2(1.2,0.0), vec2(0.0,1.5), uv));
                width = 1.2;
                break;

            case 14: // 'N'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.0,1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.8,-1.5), uv));
                dist = min(dist, dfLine(vec2(0.8,0.0), vec2(0.0,1.5), uv));
                width = 0.8;
                break;

            case 15: // 'O'
                dist = min(dist, dfArc (vec2(0.45,1.05), 0.0, pi, 0.45, uv));
                dist = min(dist, dfLine(vec2(0.0,0.45), vec2(0.0,0.6), uv));
                dist = min(dist, dfArc (vec2(0.45,0.45), pi, pi, 0.45, uv));
                dist = min(dist, dfLine(vec2(0.9,0.45), vec2(0.0,0.6), uv));
                width = 0.9;
                break;

            case 16: // 'P'
                dist = min(dist, dfLine(vec2(0.00,1.5), vec2(0.0,-1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.525,0.0), uv));
                dist = min(dist, dfArc (vec2(0.525,1.125),-(hpi), pi, 0.375, uv));
                dist = min(dist, dfLine(vec2(0.0,0.75), vec2(0.525,0.0), uv));
                width = 0.9;
                break;

            case 17: // 'Q'
                dist = min(dist, dfArc (vec2(0.45,1.05), 0.0, pi, 0.45, uv));
                dist = min(dist, dfLine(vec2(0.0,0.45), vec2(0.0,0.6), uv));
                dist = min(dist, dfArc (vec2(0.45,0.45), pi, pi, 0.45, uv));
                dist = min(dist, dfLine(vec2(0.9,0.45), vec2(0.0,0.6), uv));
                dist = min(dist, dfLine(vec2(0.6,0.3), vec2(0.3,-0.3), uv));
                width = 0.9;
                break;

            case 18: // 'R'
                dist = min(dist, dfLine(vec2(0.00,1.5), vec2(0.0,-1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.525,0.0), uv));
                dist = min(dist, dfArc (vec2(0.525,1.125),-(hpi), pi, 0.375, uv));
                dist = min(dist, dfLine(vec2(0.0,0.75), vec2(0.525,0.0), uv));
                dist = min(dist, dfLine(vec2(0.525,0.75), vec2(0.375,-0.75), uv));
                width = 0.9;
                break;

            case 19: // 'S'
                dist = min(dist, dfArc(vec2(0.6,1.2),0.0, hpi, 0.3, uv));
                dist = min(dist, dfLine(vec2(0.3,1.5), vec2(0.3,0.0), uv));
                dist = min(dist, dfArc(vec2(0.3,1.2),hpi, hpi, 0.3, uv));
                dist = min(dist, dfLine(vec2(0.0,1.05), vec2(0.0,0.15), uv));
                dist = min(dist, dfArc(vec2(0.3,1.05),pi, hpi, 0.3, uv));
                dist = min(dist, dfLine(vec2(0.3,0.75), vec2(0.3,0.0), uv));
                dist = min(dist, dfArc(vec2(0.6,0.45),0.0, hpi, 0.3, uv));
                dist = min(dist, dfLine(vec2(0.9,0.3), vec2(0.0,0.15), uv));
                dist = min(dist, dfArc(vec2(0.6,0.3),-hpi, hpi, 0.3, uv));
                dist = min(dist, dfLine(vec2(0.3,0.0), vec2(0.3,0.0), uv));
                dist = min(dist, dfArc(vec2(0.3,0.3),pi, hpi, 0.3, uv));
                width = 0.9;
                break;
                
            case 20: // 'T'
                dist = min(dist, dfLine(vec2(0.4,0.0), vec2(0.0,1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.8,0.0), uv));
                width = 0.8;
                break;

            case 21: // 'U'
                dist = min(dist, dfLine(vec2(0.0,0.45), vec2(0.0,1.05), uv));
                dist = min(dist, dfArc (vec2(0.45,0.45), pi, pi, 0.45, uv));
                dist = min(dist, dfLine(vec2(0.9,0.0), vec2(0.0,1.5), uv));
                width = 0.9;
                break;

            case 22: // 'V'
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.45,-1.5), uv));
                dist = min(dist, dfLine(vec2(0.45,0.0), vec2(0.5,1.5), uv));
                width = 0.9;
                break;

            case 23: // 'W'
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.35,-1.5), uv));
                dist = min(dist, dfLine(vec2(0.35,0.0), vec2(0.25,0.8), uv));
                dist = min(dist, dfLine(vec2(0.6,0.8), vec2(0.25,-0.8), uv));
                dist = min(dist, dfLine(vec2(0.85,0.0), vec2(0.35,1.5), uv));
                width = 1.2;
                break;

            case 24: // 'X'
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.8,-1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.8,1.5), uv));
                width = 0.8;
                break;

            case 25: // 'Y'

                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.4,-0.9), uv));
                dist = min(dist, dfLine(vec2(0.4,0.6), vec2(0.4,0.9), uv));
                dist = min(dist, dfLine(vec2(0.4,0.6), vec2(0.0,-0.6), uv));
                width = 0.8;
                break;

            case 26: // 'Z'
                dist = min(dist, dfLine(vec2(0.0,1.5), vec2(0.8,0.0), uv));
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.8,1.5), uv));
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.8,0.0), uv));
                width = 0.8;
                break;
        }
    }
#endif
#endif    
    start.x += (width == 0.0) ? 0.0 : (width + charSpacing) * scale;
    
    return dist;
}


vec3 coloredChar(inout vec2 start, vec3 colnow, vec3 color , int digit, vec2 uv) {
    float dist = dfChar(start, digit, uv);
    vec3 col = vec3(0.0);
    float shade = SHADE / (dist);
    col += color * shade;
    return col;
}


#define char(d,c) d = min(d,dfChar(pos, c, uv));

// Following is just a test how to get rid of the switch/case
// So for now... just ignore
#if 0
    float df_0(float dist, inout vec2 start, vec2 uv) {
        uv -= start;
        dist = min(dist, dfLine(vec2(1.000,1.000), vec2(0.000,-0.500), uv));
        dist = min(dist, dfLine(vec2(0.000,1.000), vec2(0.000,-0.500), uv));
        dist = min(dist, dfArc(vec2(0.500,1.000),0.000, 3.142, 0.500, uv));
        dist = min(dist, dfArc(vec2(0.500,0.500),3.142, 3.142, 0.500, uv));
        start.x += (1.0 + charSpacing) * scale;
        return dist;
    }

    #define _0 dist=df_0(dist,pos,uv);
#else
    #define _0 char(dist,0);
#endif
// End test

#define _1 char(dist,1);
#define _2 char(dist,2);
#define _3 char(dist,3);
#define _4 char(dist,4);
#define _5 char(dist,5);
#define _6 char(dist,6);
#define _7 char(dist,7);
#define _8 char(dist,8);
#define _9 char(dist,9);

#define _a char(dist,101);
#define _b char(dist,102);
#define _c char(dist,103);
#define _d char(dist,104);
#define _e char(dist,105);
#define _f char(dist,106);
#define _g char(dist,107);
#define _h char(dist,108);
#define _i char(dist,109);
#define _j char(dist,110);
#define _k char(dist,111);
#define _l char(dist,112);
#define _m char(dist,113);
#define _n char(dist,114);
#define _o char(dist,115);
#define _p char(dist,116);
#define _q char(dist,117);
#define _r char(dist,118);
#define _s char(dist,119);
#define _t char(dist,120);
#define _u char(dist,121);
#define _v char(dist,122);
#define _w char(dist,123);
#define _x char(dist,124);
#define _y char(dist,125);
#define _z char(dist,126);

#define _A char(dist,201);
#define _B char(dist,202);
#define _C char(dist,203);
#define _D char(dist,204);
#define _E char(dist,205);
#define _F char(dist,206);
#define _G char(dist,207);
#define _H char(dist,208);
#define _I char(dist,209);
#define _J char(dist,210);
#define _K char(dist,211);
#define _L char(dist,212);
#define _M char(dist,213);
#define _N char(dist,214);
#define _O char(dist,215);
#define _P char(dist,216);
#define _Q char(dist,217);
#define _R char(dist,218);
#define _S char(dist,219);
#define _T char(dist,220);
#define _U char(dist,221);
#define _V char(dist,222);
#define _W char(dist,223);
#define _X char(dist,224);
#define _Y char(dist,225);
#define _Z char(dist,226);

#define _space char(dist,20);
#define _colon char(dist,21);
#define _semicolon char(dist,22);

#define _plus char(dist,30);
#define _minus char(dist,31);

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
    vec2 aspect = iResolution.xy / iResolution.y;
    vec2 uv = (fragCoord.xy / iResolution.y - aspect/2.0); // (*)
    // Center the text: estimate width of "404" and offset accordingly
    float textWidth = 3.0 * scale + 2.0 * charSpacing * scale; // 3 digits, 2 spacings
    float textHeight = 1.5 * scale; // approx height
    float xOffset = -textWidth / 2.0;
    float yOffset = -textHeight / 2.0;
    vec2 pos = vec2(xOffset, yOffset); // (*)
    float dist = 1e6; // (*)
    // (*) = Do not rename! Is used in the macro's

    vec2 delta = 0.5*vec2(noise(iTime), noise(iTime+60.0)) * abs(noise(20.0*iTime));

    // Sample the SDF for each channel at offset positions
    float distC, distM, distY;
    vec2 posC = pos - delta;
    vec2 posM = pos;
    vec2 posY = pos + delta;

    distC = 1e6; pos = posC; char(distC,4); char(distC,0); char(distC,4);
    distM = 1e6; pos = posM; char(distM,4); char(distM,0); char(distM,4);
    distY = 1e6; pos = posY; char(distY,4); char(distY,0); char(distY,4);

    float shadeC = SHADE / (distC);
    float shadeM = SHADE / (distM);
    float shadeY = SHADE / (distY);

    vec3 cmy = vec3(shadeC, shadeM, shadeY);
    vec3 color = vec3(1.0) - cmy * charColor;
    fragColor = vec4(color, 1.0);
    
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
