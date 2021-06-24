
import { person } from "../constants/user";

export const defaultClientConfig = {
    address: 'localhost',
    port: '801'
}

export class Client {
    protected ws: WebSocket;
    protected person: person;
    constructor(person: person, clientConfig = defaultClientConfig) {
        const { address, port } = clientConfig
        this.ws = new WebSocket(`ws://${address}:${port}`);
        this.person = person
        console.log('ws init')
        this.initWS()
    }
    // init ws
    initWS() {
        // websocket 创建成功事件
        this.ws.onopen = function () {
            console.log('ws success')
        };
        this.ws.onmessage = res => {
            console.log('ws res', res)
        }
        // websocket 错误事件
        this.ws.onerror = function (err) {
            console.log('ws error', err)
        };
    }
}


