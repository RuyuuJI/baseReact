import React from 'react';
import * as THREE from 'three'
import { containerDom, loop, device } from './tool/common'
// import { randomColor } from '../../tool/fn'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
// -----------
import { PointShinning } from './tool/addObject'
import { TextureLoader } from 'three';
import { randomColor } from '../../tool/fn';

// export the component
class Secen extends React.Component {
    async componentDidMount() {
        init()
        const {cube, sphere} = await initCube()
        renderer.setAnimationLoop((t) => {
            sphere.visible = false
            cube.camera.position.copy(cube.mesh.position)
            cube.camera.update(renderer, scene)
            sphere.visible = true
            renderer.render(scene, camera)

            controler.update()
            cube.mat.uniforms.t.value = t

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
    initGUI()
      // axes
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
}

async function initCube() {
    const cubeRT = new THREE.WebGLCubeRenderTarget(128)
  
    const imageAstroanut = await (new TextureLoader().load('/textures/astronaut.png'))
    
    const imageWind = await (new TextureLoader().load('/textures/wind.png'))
    imageWind.wrapS = imageWind.wrapT = THREE.MirroredRepeatWrapping
    THREE.ShaderChunk.my_map_fragment = `
    #ifdef USE_MAP
            float t = t * 0.0001;
            vec2 uv = vUv * vec2(2.0, 10.0) + vec2(0.5, 0.5);
            vec4 o = texture2D(map, uv);
            vec4 nu = 
                0.3 * (texture2D(map, uv * vec2(2.0, 2.0) + vec2(0, t + o.b))) // water
                + 0.1 * (texture2D(map, uv * vec2(1.0, 1.0) + vec2(t))) // cyclone
                + 0.6 * (texture2D(map, uv * vec2(1.0, 1.0) + vec2(0.0, t)) + 0.5); // closest 
            vec4 C = pow(nu + 0.1, vec4(4.0));
            C = mapTexelToLinear(C);
            diffuseColor *= C;
    #endif
    `
    const camera = new THREE.CubeCamera(.1, 1000, cubeRT)
    const geom = new THREE.SphereBufferGeometry(4, 32, 32)
    const mat = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([THREE.ShaderLib.basic.uniforms, { t: {value: 0}}]),
            vertexShader: THREE.ShaderLib.basic.vertexShader,
            fragmentShader: `uniform float t;\n ` + THREE.ShaderLib.basic.fragmentShader.replace('<map_fragment>', '<my_map_fragment>'),
            side: THREE.BackSide
        });
    (mat as any).map = mat.uniforms.map.value = imageWind
    const cubeMesh = new THREE.Mesh(geom, mat)
    cubeMesh.scale.set(1, 20, 1)
    const cube = {
        camera,mat,
        mesh: cubeMesh
    }
    scene.add(cubeMesh)

    const sphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(1, 32, 64),
        new THREE.MeshStandardMaterial({
            emissive: randomColor(),
            emissiveIntensity: .12,
            envMap: cubeRT.texture, envMapIntensity: 1,
            metalness: 1, roughness: 0,
            map: imageAstroanut
        })
        )
        scene.add(sphere)
        console.log("cube", cube)
    return {cube, sphere}
}
// ===============
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
function initGUI() {
    // GUI
    gui = null
    gui = new dat.GUI()
    const fold = gui.addFolder('strategy choose')
    const basenSetting: { [key: string]: Object } = {}
    // basenSetting['default'] = () => particle.changeStrategy(defaultStrategy)
    // basenSetting['cube'] = () => particle.changeStrategy(cubeStrategy)
    // basenSetting['sphere'] = () => particle.changeStrategy(sphereStrategy)
    // Object.keys(basenSetting).forEach(name => {
    //     fold.add(basenSetting, name)
    // })
    fold.open()
}
export default Secen;
