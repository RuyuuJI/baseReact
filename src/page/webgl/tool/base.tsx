import { loop } from '../../threedemo/tool/common'

export class Cube {
  position = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
    
    // other
    0.0, 0.0, 0.0,
    255.0, 0.0, 0.0,
    255.0, 255.0, 0.0,
    0.0, 255.0, 0.0,
  ];
  normal = [
    // Front
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
  ];

  index = [
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // back
    8, 9, 10, 8, 10, 11,   // top
    12, 13, 14, 12, 14, 15,   // bottom
    16, 17, 18, 16, 18, 19,   // right
    20, 21, 22, 20, 22, 23,   // left

    // other
    24, 25, 26, 24, 26, 27
  ];
  color = [
    1.0, 1.0, 1.0, 1.0,    // Front face: white
    1.0, 0.0, 0.0, 1.0,    // Back face: red
    0.0, 1.0, 0.0, 1.0,    // Top face: green
    0.0, 0.0, 1.0, 1.0,    // Bottom face: blue
    1.0, 1.0, 0.0, 1.0,    // Right face: yellow
    1.0, 0.0, 1.0, 1.0,    // Left face: purple

    .9, .9, .5, 1
  ];
  rotation = {
    x: 0, y: 0, z: 0
  }
  name = 'cube'
  constructor() {
    this.colorInit()
  }
  colorInit() {
    let colors: number[] = []
    for (var j = 0; j < this.color.length; j += 4) {
      const c = [this.color[j], this.color[j + 1], this.color[j + 2], this.color[j + 3]];

      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c, c);
    }
    this.color = colors
  }
}


// 
export interface ProgramInfo {
  program: WebGLProgram,
  attribLocations: { [key: string]: number },
  uniformLocations: { [key: string]: WebGLUniformLocation }
}
export class Clock {
  now = 0
  deltaTime = 0
  timeScale = 1
  ticks: Function[]
  then = 0
  constructor(timeScale?: number) {
    this.now = 0
    this.timeScale = timeScale || 1
    this.deltaTime = this.now
    this.then = 0
    this.ticks = []
  }
  run() {
    new loop(() => {
      this.now += 0.01 * this.timeScale
      this.deltaTime = this.now - this.then
      this.then = this.now
      // 
      this.ticks.forEach(fn => {
        fn()
      })
    })
  }
  tick(newFn: Function) {
    this.ticks = this.ticks.filter(fn => fn !== newFn)
    this.ticks.push(newFn)
  }
}
export interface Buffer { [key: string]: WebGLBuffer}