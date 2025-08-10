#version 300 es
precision mediump float;
out vec4 fragColor;
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

#define PI 3.1415926536
#define TWO_PI 6.2831853072

#define edge 0.001
// defines how fast the bars move
#define totalT 48.0
#define cosT TWO_PI * mod(iTime, totalT) / totalT

float cnoise2 (in vec2);

float linez (in vec2 uv) {
  vec2 q = uv;

  q += 0.1000 * cos( 7.0 * q.yx + 2.0 * cosT);
  q += 0.0500 * cos(13.0 * q.yx + 3.0 * cosT);

  // Make bars 50% longer at the center (uv.y = 0)
  float centerScale = 0.3 - 0.5 * (1.0 - abs(uv.x)); // 1.5 at center, 1.0 at top/bottom
  const float baseHeight = 0.5;
  const float size = 0.06;
  const float halfsize = 0.5 * size;

  float c = floor((q.x + halfsize) / size);
  q.x = mod(q.x + halfsize, size) - halfsize;
  q.y -= 0.3 ;
  q.y *= 0.5 * centerScale;
  q.y -= 0.1 * cnoise2(vec2(c, sin(cosT + c)));
  q.y -= 0.01 * sin(3.0 * cosT + 0.1 * c);

  const float border = 0.2 * size;
  float v = smoothstep(halfsize - border, halfsize - border - edge, abs(q.x));
  v *= smoothstep(baseHeight + edge, baseHeight, abs(q.y));

  // Apply vertical fade to the bar itself (top/bottom 10% of bar height)
  float normY = (q.y + baseHeight) / (2.0 * baseHeight); // 0 at bottom, 1 at top of bar
  float fade = 1.0;
  if (v > 0.0) {
    fade = smoothstep(0.0, 0.5, normY);
  }
  v *= fade * 0.4;
  return v;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalize to [-1, -1] -> [1, 1]
    vec2 uv = (2.*fragCoord - iResolution.xy) / iResolution.y;

    vec3 bgTop = vec3(0.75, 0.75, 0.75); // darker top color
    vec3 bgBottom = vec3(241.0/255.0, 241.0/255.0, 241.0/255.0); // current color
    float t = clamp(uv.y * 0.5 + 0.5, 0.0, 1.0); // 0 at top, 1 at bottom
    vec3 bg = mix(bgBottom, bgTop, t);
    // bar color
    vec3 barColor = vec3(0.98, 0.98, 0.98);
    float v = linez(uv);
    // Fade bars at top and bottom 10%
    float fade = smoothstep(0.0, 0.2, t) ;
    v *= fade;
    // Blend bar color over background
    vec3 color = mix(bg, barColor, v);
    fragColor = vec4(color,1.0);
}

//
// GLSL textureless classic 2D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-08-22
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise2(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
