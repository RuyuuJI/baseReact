import React from 'react';
import * as THREE from 'three'
import { containerDom, loop, device } from './tool/common'
import { randomColor } from '../../tool/fn'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
// -----------
import { PointShinning } from './tool/addObject'

// export the component
class Secen extends React.Component {
    async componentDidMount() {
        init()

        addHelper()
        const particles = new Particles(1000)
        scene.add(particles.points)
        initGUI(particles)
        animateLoop = new loop(() => {
            particles.update()
            controler.update()
            renderer.render(scene, camera)
        })
    }
    componentWillUnmount() {
        animateLoop && animateLoop.destroy()
        scene = new THREE.Scene()
    }
    render() {
        return (
            <div className="particles">
            </div>
        );
    }
}


// 
let scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, device.ratio, 0.1, 1000) // angle, ratio, near, far
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controler = new OrbitControls(camera, renderer.domElement)
// const clock = new THREE.Clock();
let gui: dat.GUI | null = null
let animateLoop: loop | null
function init() {
    renderer.setSize(device.width, device.height)
    renderer.setPixelRatio(device.devicePixelRatio)
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    containerDom.innerHTML = ''

    initCamera()

    containerDom.appendChild(renderer.domElement)
    initLight()
}
function initLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, .6);
    scene.add(ambientLight);
    const pointshin = new PointShinning()
    scene.add(pointshin.pointLight)
}
function initCamera() {
    // fog
    scene.fog = new THREE.Fog(0, 500, 999);
    // camera
    camera.position.z = 5; camera.position.y = -10
    camera.rotation.set(Math.PI / 4, - Math.PI / 4, 0)
    controler.listenToKeyEvents(window as any); // optional
    controler.enableDamping = true; controler.dampingFactor = 0.55;
    controler.screenSpacePanning = true
    controler.maxDistance = 500;
}
function initGUI(particle: Particles) {
    // GUI
    gui = null
    gui = new dat.GUI()
    const fold = gui.addFolder('strategy choose')
    const basenSetting: { [key: string]: Object } = {}
    basenSetting['default'] = () => particle.changeStrategy(defaultStrategy)
    basenSetting['cube'] = () => particle.changeStrategy(cubeStrategy)
    basenSetting['sphere'] = () => particle.changeStrategy(sphereStrategy)
    Object.keys(basenSetting).forEach(name => {
        fold.add(basenSetting, name)
    })
    fold.open()
}
// ====================

function addHelper() {

    // axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

}
enum ParticleState { 'pause', 'started' }
// particle
class Particles {
    points: THREE.Points
    num: number
    strategy: Strategy
    private count = 0
    private state = ParticleState.started
    static vertexShader = `attribute float scale;
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = scale * ( 100.0 / - mvPosition.z );
        // gl_PointSize = scale
        gl_Position = projectionMatrix * mvPosition;
    }`
    static fragmentShader = `uniform vec3 color;
    void main() {
        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
        gl_FragColor = vec4( color, 1.0 );
    }`
    constructor(num: number) {
        this.num = num
        this.points = new THREE.Points()
        this.strategy = defaultStrategy
        this.init()
    }
    init() {
        const positions = new Float32Array(this.num * 3);
        const scales = new Float32Array(this.num)
        this.strategy.init(this.num, positions, scales)
        // create point
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(randomColor()) },
            },
            vertexShader: Particles.vertexShader,
            fragmentShader: Particles.fragmentShader
        });
        this.points = new THREE.Points(geometry, material)
    }
    update() {
        const particles = this.points
        const positions = particles.geometry.attributes.position.array;
        const scales = particles.geometry.attributes.scale.array;
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;
        (particles.material as any).uniformsNeedUpdate = true

        if (this.state === ParticleState.pause) return false
        this.strategy.init(this.num, positions as [], scales as [])

    }
    changeStrategy(strategy: Strategy) {
        if (this.state === ParticleState.pause) return false
        this.state = ParticleState.pause
        // 
        this.strategy = strategy
        const particles = this.points
        let positions = particles.geometry.attributes.position.array
        let scales = particles.geometry.attributes.scale.array;
        let tempPositions = new Float32Array(Array.from(positions))
        let tempScale = new Float32Array(scales)
        this.strategy.init(this.num, tempPositions, tempScale)
        // star the change
        staggerArray(positions as ArrayLike<number>, tempPositions, { array: tempPositions, duration: 3 })
        staggerArray(scales as ArrayLike<number>, tempScale, { array: tempPositions, duration: 3 })

        gsap.to((particles.material as any).uniforms.color.value, { r: Math.random(), g: Math.random(), b: Math.random(), duration: 3 })
        setTimeout(() => {
            this.state = ParticleState.started
        }, 3000)
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;
        (particles.material as any).uniformsNeedUpdate = true
    }
}
let count = 0
const defaultStrategy = {
    name: 'default',
    config: { x: 33, y: 60, z: 40 },
    init: (num: number, positions: Float32Array | [], scales: Float32Array | []) => {
        let size = defaultStrategy.config
        let numZ = 0 // the count of per laeryZ
        let numY = size.y // the count of per laeryY
        let numX = 0 // the count of per laeryX

        const ring = 4 * Math.PI
        let seperation = ring / size.x
        let i = 0, j = 0
        for (let iz = 0; iz <= numZ; iz++) {
            for (let iy = 0; iy < numY; iy++) {
                numX = Math.abs(Math.sin(seperation * iy / 2) * size.x)
                for (let ix = 0; ix <= numX; ix++) {
                    positions[i] = ix - (numX / 2)
                    positions[i + 1] = iy
                    positions[i + 2] = (Math.sin((iy + count) * .1)) * 10

                    i += 3

                    scales[j] = (Math.sin((iy + count) * 0.3) + 1) * 2
                    j++
                }
            }
        }
        count += 0.1
    }
}
const cubeStrategy: Strategy = {
    name: 'cube',
    config: { y: 40, x: 40, z: 50 },
    init: (num: number, positions: Float32Array | [], scales: Float32Array | []) => {

        let numX = cubeStrategy.config.x
        let numY = cubeStrategy.config.y
        let numZ = cubeStrategy.config.z
        let V = (numX * numY * numZ)
        let ratio = new THREE.Vector3(1, numY / numX, numZ / numX)
        let seperationX = Math.pow(Math.abs(V / (num * ratio.x * ratio.y * ratio.z)), 1 / 3)
        let i = 0, j = 0
        for (let iz = 0; iz < numZ; iz += (seperationX * ratio.z)) {
            for (let iy = 0; iy < numY; iy += (seperationX * ratio.y)) {
                for (let ix = 0; ix < numX; ix += (seperationX)) {
                    positions[i] = ix + Math.sin((ix + count) * .3) * 10
                    positions[i + 1] = iy + Math.sin((ix + count) * .3) * 3
                    positions[i + 2] = iz + Math.sin((iz + count) * .3) * 5
                    i += 3

                    scales[j] = 3
                    j++
                }
            }
        }
        count += 0.01
    }
}
const sphereStrategy: Strategy = {
    name: 'sphere',
    config: {},
    init: (num: number, positions: Float32Array | [], scales: Float32Array | []) => {
        let r = 0, deltaX = 0 * Math.PI, deltaZ = Math.PI / 2
        for (let i = 0; i < num; i++) {
            positions[i] = r * Math.cos(deltaZ) * Math.cos(deltaX) // x
            positions[i + 1] = r * Math.cos(deltaZ) * Math.sin(deltaX) // y
            positions[i + 2] = r * Math.sin(deltaZ) // z
            deltaX += Math.PI * (Math.pow(1 / 2, r))
            deltaZ -= Math.PI * (Math.pow(1 / 2, r))
            if (deltaX >= Math.PI * 2) {
                deltaX = 0
                if (deltaZ < -Math.PI / 2) {
                    deltaZ = Math.PI / 2
                    r += 2
                }
            }
        }
    }
}
class Strategy {
    name: string
    config: { [key: string]: any }
    init: Function
    constructor(name: string, config: { [key: string]: any }, init: Function) {
        this.name = name
        this.config = config
        this.init = init
    }
}

// 
function staggerArray(start: ArrayLike<number | string>, end: ArrayLike<number | string>,
    vars: gsap.TimelineVars) {
    var tl = gsap.timeline(vars),
        proxy = {},
        duration = vars.duration || 0,
        stagger = vars.stagger || 0,
        proxyUpdate = function (original: any, proxy: ArrayLike<number | string>, i: number) {
            return function () {
                original[i] = proxy[i];
            };
        }

    for (let i = 0; i < start.length; i++) {
        (proxy as any[])[i] = start[i];
        let v: { [key: number]: any, [name: string]: any } = {
            onUpdate: () => { }, roundProps: ''
        }

        v[i] = end[i];
        v.onUpdate = proxyUpdate(start, proxy as [], i);
        if (vars.round) {
            v.roundProps = i + "";
        }
        tl.to(proxy, duration, v, stagger * i);
    }
    return tl;
}
export default Secen;
