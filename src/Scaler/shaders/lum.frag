precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_tex_pos;
float getLum(vec4 rgb) {
    return (rgb.r + rgb.r + rgb.g + rgb.g + rgb.g + rgb.b) / 6.0;
}
void main() {
    vec4 rgb = texture2D(u_texture, 1.0 - v_tex_pos);
    float lum = getLum(rgb);
    gl_FragColor = vec4(lum);
}
