
export const containerDom: HTMLElement = document.getElementById('threeDemoContainer') as HTMLElement // canvas dom


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

    setInterval(() => {
        device.frame = tempFrame || device.frame
        tempFrame = 0
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
export default common