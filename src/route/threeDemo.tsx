import React from 'react';

const TestDemo = React.lazy(() => import('../page/threedemo/testdemo'))
const Particles = React.lazy(() => import('../page/threedemo/particles'))
const TexturePipe = React.lazy(() => import('../page/threedemo/texturePipe'))
const base = '/threedemo'
export const routeList = [
    {
        name: 'testdemo',
        path: base + '/testdemo',
        meta: {},
        exact: true,
        component: TestDemo
    },
    {
        name: 'particles',
        path: base + '/particles',
        meta: {},
        exact: true,
        component: Particles
    },
    {
        name: 'texturepipe',
        path: base + '/texturepipe',
        meta: {},
        exact: true,
        component: TexturePipe
    },
]
