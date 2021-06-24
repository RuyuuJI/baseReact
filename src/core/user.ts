import { person } from "../constants/user";


export class User {
    public person?: person;
    private callBacks: {[key: string]: Function}
    constructor() {
        let name, id, write;
        const that = this;
        this.callBacks = {}
        Promise.all([this.getName(), this.initWrite()])
            .then(res => {
                let [resname, reswrite] = res
                // 
                name = resname as string
                id = this.getRandomId(name)
                // 
                write = reswrite as string
                write = write.split('')[0]
                that.person = { name, id, write }
                localStorage.setItem('xlweb-person', JSON.stringify(that.person))
                //  
                this.runCallback()
            }).catch(err => {
                this.runCallback()
            })
    }
    runCallback () {
        console.log('user run callbacks')
        Object.keys(this.callBacks).forEach(key=> {
            this.callBacks[key] && this.callBacks[key]()
        }) 
    }
    onReady (name: string, callback?: Function) {
        
        if (callback) this.callBacks[name] = callback
        return {
            unmount: () => delete this.callBacks[name]
        }
    }
    getRandomId(name: string) {
        return (new Date().getTime()) + name
    }
    initWrite() {
        let write = localStorage.getItem('xlweb-person')

        const promise = new Promise((resolve, reject) => {
            if (!write) {
                write = window.prompt('你的标志(仅限一个字符)', 'x')
            } else {
                write = JSON.parse(write)?.write
            }
            resolve(write)
            })
        return promise
        }

    getName() {
        let name = localStorage.getItem('xlweb-person')

        const promise = new Promise((resolve, reject) => {
            if (!name) {
                name = window.prompt('你叫么子', '')
            } else {
                name = JSON.parse(name)?.name
            }
            resolve(name)
        })
        return promise
    }
}
export const user = new User()
