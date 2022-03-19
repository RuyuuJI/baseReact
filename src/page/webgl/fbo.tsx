/* eslint-disable no-lone-blocks */
import { containerDom, device, initShaderProgram } from './tool/common'
import React from 'react';
import { Cube, ProgramInfo, Buffer, Clock } from './tool/base'
import { mat4 } from 'gl-matrix'
const vertexShaderSource = `
// 顶点着色器代码在这里
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec3 aVertexNormal;
    
    uniform mat4 uNormalMatrix;
    uniform mat4 uMvpMatrix;
    
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    void main(void) {
     // 点精灵
      gl_PointSize = 16.0;
              
    //   gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      gl_Position =  uMvpMatrix * aVertexPosition;

      vColor = aVertexColor;
              
    // apply the light
      highp vec3 ambientLight = vec3(0.2, 0.2, 0.2);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(1, 1, 1));
      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
`
const fragmentShaderSource = `
// 片段着色器代码在这里
varying lowp vec4 vColor;
varying highp vec3 vLighting;
void main(void) {
  gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
}
`
console.clear()

export class Fbo extends React.Component {
    componentDidMount() {

        // 
        clock.tick(() => drawScene(gl, programInfo, buffers))
        clock.run()
    }
    // constructor(props) {
    //     super(props)
    // }
    render() {
        return (
            <div className="Fbo"></div>
        )
    }
}

const gl = containerDom.getContext('webgl') || containerDom.getContext('experimental-webgl') as WebGLRenderingContext;
canvaslInit(containerDom)
const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource)

const programInfo: ProgramInfo = {
    program: shaderProgram,
    attribLocations: {
        aVertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        aVertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        aVertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
    },
    uniformLocations: {
        uNormalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix') as WebGLUniformLocation,
        uMvpMatrix: gl.getUniformLocation(shaderProgram, 'uMvpMatrix') as WebGLUniformLocation,
    }
}
const camera = {
    rotation: {
        x: 0, y: 0
    }
}
const cube = new Cube()
// const fbo = createFBO(gl, device.width, device.height)
const textureFBO = createDynamicTexture(gl, device.width, device.height)
const buffers = initBuffers(gl, cube)
console.log('programInfo', programInfo)
console.log('buffers', buffers)
const clock = new Clock(1) // timeScale
//
// draw
function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffer) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL) // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const canvas = gl.canvas as HTMLCanvasElement
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    const modelViewMatrix = mat4.create()
    const mvpMatrix = mat4.create()
    const normalMatrix = mat4.create()
    const orthoMat = mat4.create()
    mat4.identity(mvpMatrix)
    mat4.identity(projectionMatrix)
    mat4.identity(modelViewMatrix)
    mat4.identity(normalMatrix)
    mat4.identity(orthoMat)
    mat4.ortho(orthoMat, 0, canvas.clientWidth, canvas.clientHeight, 0, -1, 1)
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

    // begin draw the model
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -10.0])
    mat4.rotateX(projectionMatrix, projectionMatrix, camera.rotation.x)
    mat4.rotateY(projectionMatrix, projectionMatrix, camera.rotation.y)
    mat4.rotateX(modelViewMatrix, modelViewMatrix, clock.now * .5)
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, clock.now * .7)
    // eslint-disable-next-line no-lone-blocks
    {
        // draw the color and positions of the model
        // positions
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions)
        gl.vertexAttribPointer(programInfo.attribLocations.aVertexPosition, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(programInfo.attribLocations.aVertexPosition)
        // (inputattrib, numComponents, type, normalize, stride, offset)

        // color
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
        gl.vertexAttribPointer(programInfo.attribLocations.aVertexColor, 4, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(programInfo.attribLocations.aVertexColor);

        // light normal
        mat4.invert(normalMatrix, modelViewMatrix) // 逆
        mat4.transpose(normalMatrix, normalMatrix) // 转置
        // mat4.multiply(projectionMatrix, modelViewMatrix, projectionMatrix)
        mat4.multiply(mvpMatrix, projectionMatrix, modelViewMatrix)

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal)
        gl.vertexAttribPointer(programInfo.attribLocations.aVertexNormal, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(programInfo.attribLocations.aVertexNormal)
    }
    // eslint-disable-next-line no-lone-blocks
    {
        // start the program
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index)
        gl.useProgram(programInfo.program)

        gl.uniformMatrix4fv(programInfo.uniformLocations.uNormalMatrix, false, normalMatrix)
        gl.uniformMatrix4fv(programInfo.uniformLocations.uMvpMatrix, false, mvpMatrix)
        // Tell WebGL which indices to use to index the vertices
        gl.drawElements(gl.TRIANGLES, 6 * 6, gl.UNSIGNED_SHORT, 0)
        // gl.drawArrays(gl.TRIANGLES, 0, 24)
    }
    {
        // draw the fbo
        gl.bindTexture(gl.TEXTURE_2D, textureFBO)
        // gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 100, 100, 100, 100)
        // gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, device.width, device.height)
        gl.uniformMatrix4fv(programInfo.uniformLocations.uMvpMatrix, false, orthoMat)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 6 * 6 * 2)
        // gl.drawArrays(gl.TRIANGLES, 2, 1233)
    }
}
// 
function initBuffers(gl: WebGLRenderingContext, cube: Cube) {
    const postionsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, postionsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.position), gl.STATIC_DRAW)
    const normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.normal), gl.STATIC_DRAW)

    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.color), gl.STATIC_DRAW)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube.index), gl.STATIC_DRAW)

    return {
        positions: postionsBuffer as WebGLBuffer,
        normal: normalBuffer as WebGLBuffer,
        color: colorBuffer as WebGLBuffer,
        index: indexBuffer as WebGLBuffer,
    }
}
// ========================
function createDynamicTexture(gl: WebGLRenderingContext, width: number, height: number): WebGLTexture {
    const texture = gl.createTexture() as WebGLTexture
    gl.bindTexture(gl.TEXTURE_2D, texture) // specifies the texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR) // specifies the filter type
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture
}
// function createFBO(gl: WebGLRenderingContext, width: number, height: number) {
//     const depthBuffer = gl.createRenderbuffer() as WebGLRenderbuffer
//     const frameBuffer = gl.createFramebuffer() as WebGLFramebuffer
//     gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
//     gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer)
//     gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)
//     gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer)

//     const textureFBO = createDynamicTexture(gl, device.width, device.height)
//     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureFBO, 0)
//     gl.bindTexture(gl.TEXTURE_2D, textureFBO)

//     var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
//     if (gl.FRAMEBUFFER_COMPLETE !== e) {
//         console.log('Frame buffer object is incomplete: ' + e.toString());
//     }
//     gl.bindFramebuffer(gl.FRAMEBUFFER, null)
//     gl.bindRenderbuffer(gl.RENDERBUFFER, null)
//     return frameBuffer
// }
// function renderFBO(gl: WebGLRenderingContext) {
//     gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
//     gl.viewport(0, 0, device.width, device.height)
//     gl.clearColor(1, 1, 1, 1)
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
//     gl.enable(gl.DEPTH_TEST)

// }
// ========================
function canvaslInit(canvas: HTMLCanvasElement) {
    canvas.onmousedown = handleMouseDown
    canvas.onmouseup = handleMouseUp
    canvas.onmousemove = handleMouseMove
    const mouse = {
        up: true,
        down: false,
        moving: false
    }
    const position = { x: 0, y: 0 }
    function handleMouseDown(e: MouseEvent) {
        mouse.down = true
        position.x = e.clientX
        position.y = e.clientY
    }
    function handleMouseUp(e: MouseEvent) {
        position.x = e.clientX
        position.y = e.clientY
        mouse.down = false
    }
    function handleMouseMove(e: MouseEvent) {
        if (!mouse.down) return
        const offsetX = position.x - e.clientX
        const offsetY = position.y - e.clientY
        camera.rotation.y += offsetX * .0001
        camera.rotation.x += offsetY * .0001
    }
}

export default Fbo