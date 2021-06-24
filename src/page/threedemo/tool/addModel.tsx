import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'

enum ActionType { base, addtional }
interface ActionWrap {
    weight: number,
    name: string,
    type: ActionType,
    action?: THREE.AnimationAction,
    act?: Function
}
export class AnimationGLTF {
    gltf: GLTF // the result after loaded
    mixer: THREE.AnimationMixer
    currentActionName: string = ''
    additiveActions: { [key: string]: ActionWrap }
    baseActions: { [key: string]: ActionWrap}
    
    //
    constructor(g: any, mixer: THREE.AnimationMixer, baseActions: { [key: string]: ActionWrap },
        additiveActions: { [key: string]: ActionWrap }) {
        this.gltf = g; this.mixer = mixer
        this.baseActions = baseActions
        this.additiveActions = additiveActions
        this.initActions()

    }
    // init all the actions
    initActions() {
        Object.keys(this.baseActions).forEach(name => {
            this.activateAction(this.baseActions[name].action as THREE.AnimationAction)
            this.baseActions[name].act = () => {
                if (this.currentActionName === name) return
                let startAction = (this.currentActionName && this.baseActions[this.currentActionName].action !== undefined) ? this.baseActions[this.currentActionName].action : undefined
                if (startAction) startAction.weight = 1
                let endAction = this.baseActions[name].action as THREE.AnimationAction
                this.prepareCrossFade(startAction, endAction, .35)
                this.currentActionName = name as string

            }
        })
        Object.keys(this.additiveActions).forEach(name => {
            this.activateAction(this.additiveActions[name].action as THREE.AnimationAction)
            this.additiveActions[name].act = (weight: number) => {
                this.additiveActions[name].weight = weight
               weightChange(this.additiveActions[name].action  as THREE.AnimationAction, weight)

            }
        })
    }
    // active one action
    activateAction(action: THREE.AnimationAction) {
        const clip = action.getClip();
        const settings = this.baseActions[clip.name] || this.additiveActions[clip.name];
        weightChange(action, settings.weight);
        action.play();
    }
    // change the action
    prepareCrossFade(startAction: THREE.AnimationAction | undefined,
        endAction: THREE.AnimationAction, duration: number) {
        if (!startAction || !endAction) {
            executeCrossFade(startAction, endAction, duration)
        } else {
            synchronizeCrossFade(this.mixer, startAction, endAction, duration)
        }
    }
}

export async function addXot(scene: THREE.Scene, url: string) {
    const baseActions: { [key: string]: ActionWrap } = {
        idle: { weight: 0, name: '', type: ActionType.base },
        walk: { weight: 0, name: '', type: ActionType.base },
        run: { weight: 0, name: '', type: ActionType.base },
    }
    const additiveActions: { [key: string]: ActionWrap } = {
        sneak_pose: { weight: 0, name: '', type: ActionType.addtional },
        sad_pose: { weight: 0, name: '', type: ActionType.addtional },
        agree: { weight: 0, name: '', type: ActionType.addtional },
        headShake: { weight: 0, name: '', type: ActionType.addtional },
    }
    const xbotGLTF: GLTF = await addGLTF(url) as GLTF
    const model = xbotGLTF.scene
    model.position.z = 0; model.position.x = -5
    model.rotateX(Math.PI / 2)
    model.castShadow = true
    model.receiveShadow = true
    const addShadow = (model: THREE.Object3D) => {
        for (let k in model.children) {
            model.children[k].castShadow = true
            model.children[k].receiveShadow = true
            if (model.children.length) addShadow(model.children[k])
        }
    }
    addShadow(model)

    
    scene.add(model);
 

    // skeleton
    const skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible = false;
    scene.add(skeleton);
    // animation
    const animations = xbotGLTF.animations;
    const mixer = new THREE.AnimationMixer(model);
    for (let i = 0; i !== animations.length; i++) {
        let clip = animations[i]
        const name = clip.name
        let action: THREE.AnimationAction

        if (baseActions[name]) {
            action = mixer.clipAction(clip);

            baseActions[name] as ActionWrap
            action.setEffectiveWeight(baseActions[name].weight);
            // activate
            baseActions[name].action = action;
            baseActions[name].name = name;
        } else if (additiveActions[name]) {

            // Make the clip additive and remove the reference frame
            THREE.AnimationUtils.makeClipAdditive(clip);

            if (clip.name.endsWith('_pose')) {
                clip = THREE.AnimationUtils.subclip(clip, name, 2, 3, 30);
            }
            action = mixer.clipAction( clip );
            additiveActions[name].action = action;
            additiveActions[name].name = name;
        }
    }
    // return
    const xbot = new AnimationGLTF(xbotGLTF, mixer, baseActions, additiveActions)
    return xbot
}

async function addGLTF(url: string) {
    const loader = new GLTFLoader();
    const result = await new Promise(resolve => {
        loader.load(url, function (gltf) {
            resolve(gltf)
        }, undefined, (error: ErrorEvent) => {
            console.error(error);
        });
    })
    return result
}
// execute or end the action
function executeCrossFade(startAction: THREE.AnimationAction | undefined,
    endAction: THREE.AnimationAction, duration: number) {
    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)
    weightChange(endAction, 1)
    endAction.time = 0 // time of start
    if (startAction) {
        startAction.crossFadeTo(endAction, duration, true)
    } else {
        endAction.fadeIn(duration)
    }
}
// synchronize
function synchronizeCrossFade(mixer: THREE.AnimationMixer,
    startAction: THREE.AnimationAction, endAction: THREE.AnimationAction, duration: number ) {
    mixer.addEventListener( 'loop', onLoopFinished );
    function onLoopFinished( event: any ) {
        if ( event.action === startAction ) {
            mixer.removeEventListener( 'loop', onLoopFinished );
            executeCrossFade( startAction, endAction, duration );
        }

    }

}
function weightChange(action: THREE.AnimationAction, weight: number) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
}

const add = {
    addGLTF,
    addXot,
    AnimationGLTF
}
export default add