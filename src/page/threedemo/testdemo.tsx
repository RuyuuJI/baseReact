import React from 'react';
import * as THREE from 'three'
import { containerDom, loop, device } from './tool/common'
import { randomColor } from '../../tool/fn'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { addXot, AnimationGLTF } from './tool/addModel'
import * as dat from 'dat.gui'
// -----------
import { addGround, PointShinning } from './tool/addObject'

// export the component
class Secen extends React.Component {
    componentWillMount() {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        controler = new OrbitControls(camera, renderer.domElement)

        init()
        
    }
    async componentDidMount() {
        
        addHelper()
        addCube()
        const line = addLine()
        addText('Q W E R')
        const xbot = await addXot(scene, '/model/gltf/Xbot.glb')
        const ground = await addGround()
        scene.add(ground)
        initGUI(xbot)
        animateLoop = new loop(() => {
            const delta = clock.getDelta()
            xbot.mixer.update(delta)
            controler!.update()
            line.animate()
            renderer!.render(scene, camera)
        })
    }
    componentWillUnmount () {
        animateLoop && animateLoop!.destroy()
        animateLoop = null
        gui = null
        renderer = renderer as THREE.WebGLRenderer
        renderer.dispose()
        renderer.clear()
        renderer = null
        controler = null
        scene.clear()
        scene = new THREE.Scene()
    }
    render() {
        return (
            <div className="Secen">
            </div>
        );
    }
}


// 
let scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, device.ratio, 0.1, 1000) // angle, ratio, near, far
let renderer:THREE.WebGLRenderer | null
let controler: OrbitControls | null
const clock = new THREE.Clock();
let gui: dat.GUI | null = null
let animateLoop: loop | null

function init() {
    renderer = renderer as THREE.WebGLRenderer
    renderer.setSize(device.width, device.height)
    renderer.setPixelRatio(device.devicePixelRatio)
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    initLight()
    initCamera()

    containerDom.innerHTML = ''
    containerDom.appendChild(renderer.domElement)
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
    controler = controler as OrbitControls
    controler.listenToKeyEvents(window as any); // optional
    controler.enableDamping = true; controler.dampingFactor = 0.55;
    controler.screenSpacePanning = true
    controler.maxDistance = 500;
}
function initGUI(xbot: AnimationGLTF) {
    // GUI
    gui = new dat.GUI()
    const foldBase = gui.addFolder('base action')
    const basenSetting: { [key: string]: Object } = {}
    Object.keys(xbot.baseActions).forEach(name => {
        basenSetting[name] = xbot.baseActions[name].act as Function
        foldBase.add(basenSetting, name)
    })
    foldBase.open()
    const foldAdditon = gui.addFolder('addition action')
    const additionSetting: { [key: string]: number } = {}
    Object.keys(xbot.additiveActions).forEach(name => {
        additionSetting[name] = xbot.additiveActions[name].weight
        foldAdditon.add(additionSetting, name, 0, 1, .01).listen().onChange(e => {
            if (xbot && xbot.additiveActions && xbot.additiveActions[name] && xbot.additiveActions[name].act) {
                xbot.additiveActions[name].act!(e)
            }
        })
    })
    foldAdditon.open()
}
// ====================

function addHelper() {
    // create the cubetarget
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding
    });
    // Create cube camera
    const cubeCamera = new THREE.CubeCamera(1, 100000, cubeRenderTarget);
    scene.add(cubeCamera);
    // object
    const materialPhongCube = new THREE.MeshPhongMaterial({
        shininess: 50, color: 0xffffff, specular: 0x999999, envMap: null
    });
    const sphereGeometry = new THREE.SphereGeometry(4, 8 * 8, 8 * 8);
    addObject(sphereGeometry, materialPhongCube, 10, 10, 10, 0);
    //
    const lightProbe = new THREE.LightProbe();
    scene.add(lightProbe);
    // axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

}
function addCube() {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: randomColor() })
    addObject(geometry, material, 20, 20, 5, Math.PI)
    // 
    const ringgeometry = new THREE.TorusKnotGeometry(10, 3, 3, 3);
    const ringmaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const torusKnot = new THREE.Mesh(ringgeometry, ringmaterial);
    torusKnot.geometry.scale(0.2, 0.2, 0.2)
    addObject(ringgeometry, ringmaterial, -20, -20, 5, Math.PI)
}
function addLine() {
    const MAX_POINTS = 500; let DRAW_COUNT = 2
    const material = new THREE.LineBasicMaterial({ color: randomColor() })
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_POINTS * 3) // 3 vertices per point
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // const geometry = new THREE.BufferGeometry().setFromPoints(points) // points = [Vector3]
    const mesh = new THREE.Line(geometry, material)
    scene.add(mesh)

    // start the animation
    const animate = () => {
        // init ani
        DRAW_COUNT = (DRAW_COUNT + 1) % MAX_POINTS

        if (DRAW_COUNT === 0) {
            // ani
            const positions = mesh.geometry.attributes.position.array as number[];
            let x, y, z, index;
            x = y = z = index = 0;
            for (let i = 0; i < MAX_POINTS; i++) {
                positions[index++] = x
                positions[index++] = y
                positions[index++] = z
                x += (Math.random() - 0.5) * 1;
                y += (Math.random() - 0.5) * 1;
                z += (Math.random() - 0.5) * 1;
            }
            mesh.material.color.set(randomColor())
            mesh.geometry.attributes.position.needsUpdate = true;
        }
        geometry.setDrawRange(0, DRAW_COUNT) // draw the first 2 point

    }
    return {
        mesh, animate
    }
}
async function addText(text: string) {
    const loader = new THREE.FontLoader()
    let geometry, material = new THREE.MeshBasicMaterial({ color: randomColor() })
    let textmesh: THREE.Object3D
    const res = new Promise<THREE.Object3D>(resolve => {
        loader.load('/font/Microsoft_YaHei_Regular.json', (font: any) => {
            geometry = new THREE.TextGeometry(text, {
                font: font,
                size: 33,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelSegments: 5
            });
            textmesh = new THREE.Mesh(geometry, material);
            textmesh.position.z = 15
            textmesh.castShadow = true
            textmesh.scale.set(0.03, 0.03, 0.03);
            scene.add(textmesh)
            resolve(textmesh)
        })
    })
    return res
}


// tool fn
function addObject(geometry: THREE.BufferGeometry, material: THREE.MeshBasicMaterial, x: number, y: number, z: number, ry: number) {

    const tmpMesh = new THREE.Mesh(geometry, material);
    tmpMesh.material.color.offsetHSL(0.1, - 0.1, 0);

    tmpMesh.position.set(x, y, z);

    tmpMesh.rotation.y = ry;
    tmpMesh.castShadow = true;
    tmpMesh.receiveShadow = true;

    scene.add(tmpMesh);

    return tmpMesh;

}
export default Secen;
