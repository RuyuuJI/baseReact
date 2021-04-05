import React from 'react';

const TestDemo = React.lazy(() => import('../page/threedemo/testdemo'))
const Particles = React.lazy(() => import('../page/threedemo/particles'))
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
]
