precision mediump float;
uniform sampler2D u_texture;
uniform sampler2D u_textureTemp;
uniform vec2 u_pt;
varying vec2 v_tex_pos;
vec4 HOOKED_tex(vec2 pos) {
    return texture2D(u_texture, 1.0 - pos);
}
vec4 POSTKERNEL_tex(vec2 pos) {
    return texture2D(u_textureTemp, 1.0 - pos);
}
vec4 getRGBL(vec2 pos) {
    return vec4(HOOKED_tex(pos).rgb, POSTKERNEL_tex(pos).x);
}
void main() {
    vec2 HOOKED_pos = v_tex_pos;

    vec2 d = u_pt;

    //[tl  t tr]
    //[ l cc  r]
    //[bl  b br]
    vec4 cc = getRGBL(HOOKED_pos);
    vec4 t = getRGBL(HOOKED_pos + vec2(0.0, -d.y));
    vec4 tl = getRGBL(HOOKED_pos + vec2(-d.x, -d.y));
    vec4 tr = getRGBL(HOOKED_pos + vec2(d.x, -d.y));

    vec4 l = getRGBL(HOOKED_pos + vec2(-d.x, 0.0));
    vec4 r = getRGBL(HOOKED_pos + vec2(d.x, 0.0));

    vec4 b = getRGBL(HOOKED_pos + vec2(0.0, d.y));
    vec4 bl = getRGBL(HOOKED_pos + vec2(-d.x, d.y));
    vec4 br = getRGBL(HOOKED_pos + vec2(d.x, d.y));

    //Horizontal Gradient
    //[-1  0  1]
    //[-2  0  2]
    //[-1  0  1]
    float xgrad = (-tl.a + tr.a - l.a - l.a + r.a + r.a - bl.a + br.a);

    //Vertical Gradient
    //[-1 -2 -1]
    //[ 0  0  0]
    //[ 1  2  1]
    float ygrad = (-tl.a - t.a - t.a - tr.a + bl.a + b.a + b.a + br.a);

    gl_FragColor = vec4(1.0 - clamp(sqrt(xgrad * xgrad + ygrad * ygrad), 0.0, 1.0));
}
