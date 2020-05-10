precision mediump float;
uniform sampler2D u_texture;
uniform sampler2D u_textureOrig;
varying vec2 v_tex_pos;
void main() {
    vec4 color = texture2D(u_texture, 1.0 - v_tex_pos);
    vec4 colorOrig = texture2D(u_textureOrig, vec2(1.0 - v_tex_pos.x, v_tex_pos.y));
    gl_FragColor = vec4(color.rgb, colorOrig.a);
}
