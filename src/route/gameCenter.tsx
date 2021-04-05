import React from 'react';

const NineChess = React.lazy(() => import('../page/gamecenter/nineChess'))

const base = '/gamecenter'
export const routeList = [
    {
        name: 'ninechess',
        path: base + '/ninechess',
        meta: {},
        exact: true,
        component: NineChess
    },
]
