import React from 'react';

const NineChess = React.lazy(() => import('../page/gamecenter/nineChess'))
const Snake = React.lazy(() => import('../page/gamecenter/snake'))
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
        name: 'snake',
        path: base + '/snake',
        meta: {},
        exact: true,
        component: Snake
    },
]
