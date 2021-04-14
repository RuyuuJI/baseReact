import * as THREE from 'three'

export class Plane {
    mesh: THREE.Object3D
    constructor() {
        const left = createTriangle(10, 5)
        const right = createTriangle(10, 5)
        const bottom = createTriangle(10, 2)
        right.rotation.z = Math.PI / 5
        right.position.x = 65
        const group = new THREE.Group()
        group.add(left)
        group.add(right)
        group.add(bottom)
        group.position.set(1, 1, 1)
        this.mesh = group
    }
}
function createTriangle(l: number = 5, h: number = 5): THREE.Mesh {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(l, 0);
    shape.lineTo(l, h);
    shape.lineTo(0, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        steps: 2,
        depth: 1,
        bevelThickness: 1,
        bevelSize: 5,
        bevelOffset: 0,
        bevelSegments: 5
    });
    const material = new THREE.MeshBasicMaterial({ color: 0x121212 });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh
}
