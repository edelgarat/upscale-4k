precision mediump float;
uniform sampler2D u_texture;
uniform sampler2D u_textureTemp;
uniform vec2 u_pt;
uniform float u_scale;
uniform float u_blur;
varying vec2 v_tex_pos;
#define strength (min(u_scale / u_blur, 1.0))
vec4 HOOKED_tex(vec2 pos) {
    return texture2D(u_texture, vec2(pos.x, 1.0 - pos.y));
}
vec4 POSTKERNEL_tex(vec2 pos) {
    return texture2D(u_textureTemp, vec2(pos.x, 1.0 - pos.y));
}
vec4 getAverage(vec4 cc, vec4 a, vec4 b, vec4 c) {
    return cc * (1.0 - strength) + ((a + b + c) / 3.0) * strength;
}
vec4 getRGBL(vec2 pos) {
    return vec4(HOOKED_tex(pos).rgb, POSTKERNEL_tex(pos).x);
}
float min3v(vec4 a, vec4 b, vec4 c) {
    return min(min(a.a, b.a), c.a);
}
float max3v(vec4 a, vec4 b, vec4 c) {
    return max(max(a.a, b.a), c.a);
}
void main() {
    vec2 HOOKED_pos = v_tex_pos;

    vec2 d = u_pt;

    vec4 cc = getRGBL(HOOKED_pos);
    vec4 t = getRGBL(HOOKED_pos + vec2(0.0, -d.y));
    vec4 tl = getRGBL(HOOKED_pos + vec2(-d.x, -d.y));
    vec4 tr = getRGBL(HOOKED_pos + vec2(d.x, -d.y));

    vec4 l = getRGBL(HOOKED_pos + vec2(-d.x, 0.0));
    vec4 r = getRGBL(HOOKED_pos + vec2(d.x, 0.0));

    vec4 b = getRGBL(HOOKED_pos + vec2(0.0, d.y));
    vec4 bl = getRGBL(HOOKED_pos + vec2(-d.x, d.y));
    vec4 br = getRGBL(HOOKED_pos + vec2(d.x, d.y));

    //Kernel 0 and 4
    float maxDark = max3v(br, b, bl);
    float minLight = min3v(tl, t, tr);

    if (minLight > cc.a && minLight > maxDark) {
        gl_FragColor = getAverage(cc, tl, t, tr);
        return;
    } else {
        maxDark = max3v(tl, t, tr);
        minLight = min3v(br, b, bl);
        if (minLight > cc.a && minLight > maxDark) {
            gl_FragColor = getAverage(cc, br, b, bl);
            return;
        }
    }

    //Kernel 1 and 5
    maxDark = max3v(cc, l, b);
    minLight = min3v(r, t, tr);

    if (minLight > maxDark) {
        gl_FragColor = getAverage(cc, r, t, tr);
        return;
    } else {
        maxDark = max3v(cc, r, t);
        minLight = min3v(bl, l, b);
        if (minLight > maxDark) {
            gl_FragColor = getAverage(cc, bl, l, b);
            return;
        }
    }

    //Kernel 2 and 6
    maxDark = max3v(l, tl, bl);
    minLight = min3v(r, br, tr);

    if (minLight > cc.a && minLight > maxDark) {
        gl_FragColor = getAverage(cc, r, br, tr);
        return;
    } else {
        maxDark = max3v(r, br, tr);
        minLight = min3v(l, tl, bl);
        if (minLight > cc.a && minLight > maxDark) {
            gl_FragColor = getAverage(cc, l, tl, bl);
            return;
        }
    }

    //Kernel 3 and 7
    maxDark = max3v(cc, l, t);
    minLight = min3v(r, br, b);

    if (minLight > maxDark) {
        gl_FragColor = getAverage(cc, r, br, b);
        return;
    } else {
        maxDark = max3v(cc, r, b);
        minLight = min3v(t, l, tl);
        if (minLight > maxDark) {
            gl_FragColor = getAverage(cc, t, l, tl);
            return;
        }
    }

    gl_FragColor = cc;
}
