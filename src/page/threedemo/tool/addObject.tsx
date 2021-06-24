import * as THREE from 'three'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare'

// =============
export const add = {
    addGround,
}
export function addGround(): THREE.Object3D {
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshPhongMaterial({
        shininess: 55,
        color: 0xefefef,
        specular: 0xefefef,
    });
    const ground = new THREE.Mesh(planeGeometry, groundMaterial);
    ground.position.set(0, 0, 0);

    ground.scale.set(1000, 1000, 1000);

    ground.receiveShadow = true;
    return ground
}
export class PointShinning {
    pointLight: THREE.PointLight
    constructor() {

        // ------
        const pointLight = new THREE.PointLight(0xffaa00, .2, 1000);
        pointLight.position.z = 5; pointLight.position.y = 5
        pointLight.castShadow = true
        //Set up shadow properties for the light
        pointLight.shadow.mapSize.width = 4096; // default
        pointLight.shadow.mapSize.height = 4096; // default
        pointLight.shadow.camera.near = 0.5; // default
        pointLight.shadow.camera.far = 500 // default
        // set the flare
        const lensflare = new Lensflare();
        const textureLoader = new THREE.TextureLoader();
        const textureFlare0 = textureLoader.load('textures/lensflare/lensflare0.png');
        const textureFlare3 = textureLoader.load('textures/lensflare/lensflare3.png');

        lensflare.addElement(new LensflareElement(textureFlare0, 512, 0));
        lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
        pointLight.add(lensflare);
        this.pointLight = pointLight
    }
}
export default add