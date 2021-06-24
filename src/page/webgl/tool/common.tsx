
export const containerDom = document.getElementById('DemoContainer') as HTMLCanvasElement // canvas dom


export const device = {
    frame: 60,
    devicePixelRatio,
    width: containerDom.offsetWidth, height: containerDom.offsetHeight,
    ratio: containerDom.offsetWidth / containerDom.offsetHeight
}
let fns: (Function | null)[] = []
function renderloop() {
    let tempFrame: number = 0
    const loop = () => {
        tempFrame++
        fns.length && fns.forEach(fn => {
            fn && fn()
        })
        requestAnimationFrame(loop);
    }

    const timer = setInterval(() => {
        
        device.frame = tempFrame || device.frame
        tempFrame = 0
        clearTimeout(timer)
    }, 1000)
    loop()
}
renderloop()
// animation
export class loop{
    fn: Function | null
    destroy: Function
    constructor (fn: Function) {
        this.fn = fn
        fns[fns.length] = this.fn
        this.destroy = () => {
            fns = fns.filter(item => item !== this.fn)
            this.fn = null

            console.log('destroy', fns)
        }
    }
}

let common = {
    device,
    containerDom,
    loop
}


// init the shader and the program
export function initShaderProgram(gl: WebGLRenderingContext, vsShaderContent: string, fsShaderContent: string): WebGLProgram {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsShaderContent)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsShaderContent)

    // create the program
    const shaderProgram = gl.createProgram() as WebGLProgram
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    // fail to create the program , and log out
    gl.getProgramInfoLog(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log('Unable to initialize the shader program: ' +
            (gl as any).shaderInfoLog())
        return new WebGLProgram()
    }
    return shaderProgram
}
export function loadShader(gl: WebGLRenderingContext, type: number, shadercontent: string): WebGLShader {
    const shader = gl.createShader(type) as WebGLShader

    gl.shaderSource(shader, shadercontent)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader); // delete away
        return new WebGLShader();
    }

    return shader;
}
export default common