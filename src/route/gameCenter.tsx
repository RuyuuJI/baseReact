import React from 'react';

const NineChess = React.lazy(() => import('../page/gamecenter/nineChess'))
const FiveChess = React.lazy(() => import('../page/gamecenter/fiveChess'))
const Snake = React.lazy(() => import('../page/gamecenter/snake'))
const Chess2048 = React.lazy(() => import('../page/gamecenter/chess2048'))
const ChineseChess = React.lazy(() => import('../page/gamecenter/chineseChess'))
const base = '/gamecenter'
export const routeList = [
    {
        name: 'ninechess',
        path: base + '/ninechess',
        meta: {},
        exact: true,
        component: NineChess
    },
    {
        name: 'chineseChess',
        path: base + '/chineseChess',
        meta: {},
        exact: true,
        component: ChineseChess
    },
    {
        name: 'fiveChess',
        path: base + '/fiveChess',
        meta: {},
        exact: true,
        component: FiveChess
    },
    {
        name: 'snake',
        path: base + '/snake',
        meta: {},
        exact: true,
        component: Snake
    },
    {
        name: 'chess2048',
        path: base + '/chess2048',
        meta: {},
        exact: true,
        component: Chess2048
    },
]
