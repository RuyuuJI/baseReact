import React from 'react';

const fbo = React.lazy(() => import('../page/webgl/fbo'))

const base = '/webgldemo'
export const routeList = [
    {
        name: 'fbo',
        path: base + '/fbo',
        meta: {},
        exact: true,
        component: fbo
    },
]
