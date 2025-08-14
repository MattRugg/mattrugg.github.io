#version 300 es
precision mediump float;
out vec4 fragColor;
uniform float iTime;
uniform vec3 iResolution;

// Thicker digits
#define SHADE      .002

float scale = 1.0 / 20.0;
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

            case 0:
                dist = min(dist, dfLine(vec2(1.000,1.000), vec2(0.000,-0.500), uv));
                dist = min(dist, dfLine(vec2(0.000,1.000), vec2(0.000,-0.500), uv));
                dist = min(dist, dfArc(vec2(0.500,1.000),0.000, 3.142, 0.500, uv));
                dist = min(dist, dfArc(vec2(0.500,0.500),3.142, 3.142, 0.500, uv));
                width = 1.1;
                break;
            case 4:
                dist = min(dist, dfLine(vec2(0.000,0.500), vec2(0.700,1.000), uv));
                dist = min(dist, dfLine(vec2(0.000,0.500), vec2(1.000,0.000), uv));
                dist = min(dist, dfLine(vec2(0.700,0.000), vec2(0.000,1.500), uv));
                width = 1.1;
                break;
        
            case  20: // <> space
                width = 0.6;
                break;            
            default:
                
                break;
        }
    }

    if (char > 200) {
        char -= 200;
        
        switch(char) {
            case  1: // 'A'
                dist = min(dist, dfLine(vec2(0.0,0.0), vec2(0.45,1.5), uv));
                dist = min(dist, dfLine(vec2(0.45,1.5), vec2(0.45,-1.5), uv));
                dist = min(dist, dfLine(vec2(0.18,0.6), vec2(0.54,0.0), uv));
                width = 0.9;
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
        }
    }
      
    start.x += (width == 0.0) ? 0.0 : (width + charSpacing) * scale;
    
    return dist;
}

#define char(d,c) d = min(d,dfChar(pos, c, uv));

#define _0 char(dist,0);
#define _4 char(dist,4);

#define _A char(dist,201);
#define _D char(dist,204);
#define _E char(dist,205);
#define _F char(dist,206);
#define _G char(dist,207);
#define _N char(dist,214);
#define _O char(dist,215);
#define _P char(dist,216);
#define _T char(dist,220);
#define _U char(dist,221);

#define _space char(dist,20);

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
    float textWidth = 3.0 * scale + 3.0 * charSpacing * scale; // 3 digits, 2 spacings
    float textHeight = 1.5 * scale; // approx height
    float xOffset = -textWidth / 2.0;
    float yOffset = 0.0; //-textHeight / 1.0;
    vec2 pos = vec2(xOffset, yOffset); // (*)
    float _dist = 1e7;
    float dist = _dist; // (*)
    // (*) = Do not rename! Is used in the macro's

    vec2 delta = 0.1*vec2(noise(iTime), noise(iTime+60.0)) * abs(noise(20.0*iTime));

    // Sample the SDF for each channel at offset positions
    float shadeC, shadeM, shadeY;
    vec2 _pos = pos;
    float _scale = scale;

    pos = _pos - delta;
    _4 _0 _4
    scale = _scale * 0.255; pos = _pos - delta; pos.y -= 0.04;
    _P _A _G _E _space _N _O _T _space _F _O _U _N _D
    shadeC = SHADE / dist;

    dist = _dist; pos = _pos; scale = _scale;
    _4 _0 _4
    scale = _scale * 0.255; pos = _pos; pos.y -= 0.04;
    _P _A _G _E _space _N _O _T _space _F _O _U _N _D
    shadeM = SHADE / dist;

    dist = _dist
    ; pos = _pos + delta;  scale = _scale;
    _4 _0 _4
    scale = _scale * 0.255; pos = _pos + delta; pos.y -= 0.04;
    _P _A _G _E _space _N _O _T _space _F _O _U _N _D
    shadeY = SHADE / dist;

    vec3 cmy = vec3(shadeC, shadeM, shadeY);
    vec3 color = vec3(1.0) - cmy * charColor;
    fragColor = vec4(color, 1.0);
    
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
