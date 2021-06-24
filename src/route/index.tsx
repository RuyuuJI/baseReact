import Index from '../page/index'
import UserInfo from '../page/userInfo'
import GameCenter from '../page/gameCenter'
import ThreeDemo from '../page/threeDemo'
import WebglDemo from '../page/webglDemo'
export const routeList = [
    {
        name: 'index',
        path: '/',
        meta: {},
        exact: true,
        component: Index
    },
    {
        name: 'gamecenter',
        path: '/gamecenter',
        meta: {},
        component: GameCenter
    },
    {
        name: 'userinfo',
        path: '/userinfo',
        meta: {},
        component: UserInfo
    },
    {
        name: 'threedemo',
        path: '/threedemo',
        meta: {},
        component: ThreeDemo
    },
    {
        name: 'webgldemo',
        path: '/webgldemo',
        meta: {},
        component: WebglDemo
    }
]

export interface route {
    name: string;
    path: string;
    meta: {};
    exact?: boolean;
    component: () => JSX.Element
}