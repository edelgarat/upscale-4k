import quadVert from "!!raw-loader!./shaders/quard.vert";
import scaleFrag from "!!raw-loader!./shaders/scale.frag";
import lumFrag from "!!raw-loader!./shaders/lum.frag";
import pushFrag from "!!raw-loader!./shaders/push.frag";
import gradFrag from "!!raw-loader!./shaders/grad.frag";
import finalFrag from "!!raw-loader!./shaders/final.frag";
import drawFrag from "!!raw-loader!./shaders/draw.frag";

type ProgramInterface = { program: WebGLProgram; [name: string]: any };

import {
  bindAttribute,
  bindFramebuffer,
  bindTexture,
  createBuffer,
  createProgram,
  createTexture,
  updateTexture,
} from "./libs";

export class Scaler {
  private inputTex: WebGLTexture = null;
  private inputMov: HTMLVideoElement = null;

  private inputWidth = 0;
  private inputHeight = 0;

  private quadBuffer: WebGLBuffer;
  private framebuffer: WebGLFramebuffer;

  private scaleProgram: ProgramInterface;
  private lumProgram: ProgramInterface;
  private pushProgram: ProgramInterface;
  private gradProgram: ProgramInterface;
  private finalProgram: ProgramInterface;
  private drawProgram: ProgramInterface;

  private scaleTexture: WebGLTexture = null;
  private tempTexture: WebGLTexture = null;
  private tempTexture2: WebGLTexture = null;
  private tempTexture3: WebGLTexture = null;

  bold = 6.0;
  blur = 2.0;

  constructor(private gl: WebGLRenderingContext) {
    this.quadBuffer = createBuffer(gl, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]));
    this.framebuffer = gl.createFramebuffer();
    this.scaleProgram = createProgram(gl, quadVert, scaleFrag);
    this.lumProgram = createProgram(gl, quadVert, lumFrag);
    this.pushProgram = createProgram(gl, quadVert, pushFrag);
    this.gradProgram = createProgram(gl, quadVert, gradFrag);
    this.finalProgram = createProgram(gl, quadVert, finalFrag);
    this.drawProgram = createProgram(gl, quadVert, drawFrag);
  }

  inputVideo(mov) {
    const gl = this.gl;

    const width = mov.videoWidth;
    const height = mov.videoHeight;

    this.inputWidth = width;
    this.inputHeight = height;

    let emptyPixels = new Uint8Array(width * height * 4);
    this.inputTex = createTexture(gl, gl.LINEAR, emptyPixels, width, height);
    this.inputMov = mov;
  }

  resize(scale) {
    const gl = this.gl;

    const width = Math.round(this.inputWidth * scale);
    const height = Math.round(this.inputHeight * scale);

    gl.canvas.width = width;
    gl.canvas.height = height;

    let emptyPixels = new Uint8Array(width * height * 4);
    this.scaleTexture = createTexture(gl, gl.LINEAR, emptyPixels, width, height);
    this.tempTexture = createTexture(gl, gl.LINEAR, emptyPixels, width, height);
    this.tempTexture2 = createTexture(gl, gl.LINEAR, emptyPixels, width, height);
    this.tempTexture3 = createTexture(gl, gl.LINEAR, emptyPixels, width, height);
  }

  render() {
    if (!this.inputTex) {
      return;
    }

    const gl = this.gl;
    const scalePgm = this.scaleProgram;
    const lumPgm = this.lumProgram;
    const pushPgm = this.pushProgram;
    const gradPgm = this.gradProgram;
    const finalPgm = this.finalProgram;
    const drawPgm = this.drawProgram;

    if (this.inputMov) {
      updateTexture(gl, this.inputTex, this.inputMov);
    }

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // First upscaling with Bicubic interpolation.

    bindFramebuffer(gl, this.framebuffer, this.scaleTexture);

    gl.useProgram(scalePgm.program);

    bindAttribute(gl, this.quadBuffer, scalePgm.a_pos, 2);
    bindTexture(gl, this.inputTex, 0);
    gl.uniform1i(scalePgm.u_texture, 0);
    gl.uniform2f(scalePgm.u_size, this.inputWidth, this.inputHeight);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Scaled: scaleTexture

    bindFramebuffer(gl, this.framebuffer, this.tempTexture);

    gl.useProgram(lumPgm.program);

    bindAttribute(gl, this.quadBuffer, lumPgm.a_pos, 2);
    bindTexture(gl, this.scaleTexture, 0);
    gl.uniform1i(lumPgm.u_texture, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Scaled: scaleTexture
    // PostKernel: tempTexture

    bindFramebuffer(gl, this.framebuffer, this.tempTexture2);

    gl.useProgram(pushPgm.program);

    bindAttribute(gl, this.quadBuffer, pushPgm.a_pos, 2);
    bindTexture(gl, this.scaleTexture, 0);
    bindTexture(gl, this.tempTexture, 1);
    gl.uniform1i(pushPgm.u_texture, 0);
    gl.uniform1i(pushPgm.u_textureTemp, 1);
    gl.uniform1f(pushPgm.u_scale, gl.canvas.width / this.inputWidth);
    gl.uniform2f(pushPgm.u_pt, 1.0 / gl.canvas.width, 1.0 / gl.canvas.height);
    gl.uniform1f(pushPgm.u_bold, this.bold);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Scaled: tempTexture2
    // PostKernel: tempTexture

    bindFramebuffer(gl, this.framebuffer, this.tempTexture);

    gl.useProgram(lumPgm.program);

    bindAttribute(gl, this.quadBuffer, lumPgm.a_pos, 2);
    bindTexture(gl, this.tempTexture2, 0);
    gl.uniform1i(lumPgm.u_texture, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Scaled: tempTexture2
    // PostKernel: tempTexture

    bindFramebuffer(gl, this.framebuffer, this.tempTexture3);

    gl.useProgram(gradPgm.program);

    bindAttribute(gl, this.quadBuffer, gradPgm.a_pos, 2);
    bindTexture(gl, this.tempTexture2, 0);
    bindTexture(gl, this.tempTexture, 1);
    gl.uniform1i(gradPgm.u_texture, 0);
    gl.uniform1i(gradPgm.u_textureTemp, 1);
    gl.uniform2f(gradPgm.u_pt, 1.0 / gl.canvas.width, 1.0 / gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Scaled: tempTexture2
    // PostKernel: tempTexture3

    bindFramebuffer(gl, this.framebuffer, this.tempTexture);

    gl.useProgram(finalPgm.program);

    bindAttribute(gl, this.quadBuffer, finalPgm.a_pos, 2);
    bindTexture(gl, this.tempTexture2, 0);
    bindTexture(gl, this.tempTexture3, 1);
    gl.uniform1i(finalPgm.u_texture, 0);
    gl.uniform1i(finalPgm.u_textureTemp, 1);
    gl.uniform1f(finalPgm.u_scale, gl.canvas.width / this.inputWidth);
    gl.uniform2f(finalPgm.u_pt, 1.0 / gl.canvas.width, 1.0 / gl.canvas.height);
    gl.uniform1f(finalPgm.u_blur, this.blur);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Scaled: tempTexture
    // PostKernel: tempTexture3

    bindFramebuffer(gl, null);

    gl.useProgram(drawPgm.program);

    bindAttribute(gl, this.quadBuffer, drawPgm.a_pos, 2);
    bindTexture(gl, this.tempTexture, 0);
    bindTexture(gl, this.inputTex, 1);
    gl.uniform1i(drawPgm.u_texture, 0);
    gl.uniform1i(drawPgm.u_textureOrig, 1);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
