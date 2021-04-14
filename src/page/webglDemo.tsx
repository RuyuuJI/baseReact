import {
    Switch,
    Route,
    withRouter
} from "react-router-dom";
import { routeList } from '../route/webglDemo'
import React, {Suspense} from 'react';
import './webglDemoStyle.scss'

class WebglDemo extends React.Component<{ history: any }, {}> {
    constructor(props: any) {
        super(props)
        this.toPage.bind(this)
    }
    toPage = (route: any) => {
        const { history } = this.props
        history.push(route.path)
    }
    render() {
        return (
            <div className="WebglDemo">
                <header className="WebglDemo-header">
                    <p className="WebglDemo-header-titile">
                        webgl's demo
                    </p>
                    <p className="WebglDemo-header-navi">
                        {
                            routeList.map((route, index) => (
                                <span className="navi" key={index}
                                    onClick={() => this.toPage(route)}>
                                    {route.name + index}
                                </span>
                            ))
                        }
                    </p>
                    <p className="WebglDemo-header-operation" ></p>
                </header>
                <div className="WebglDemo-Game" >
                    <canvas id="DemoContainer" ></canvas>
                    <Suspense fallback={<div >Loading</div>}>
                        <Switch >
                            {routeList.map((route, index) => (
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact={route.exact}
                                    children={<route.component />}
                                />
                            ))}
                        </Switch>
                    </Suspense>
                </div>
            </div>
        );
    }

}

export default withRouter(WebglDemo);
