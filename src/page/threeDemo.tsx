import {
    Switch,
    Route,
    withRouter
} from "react-router-dom";
import { routeList } from '../route/threeDemo'
import React, {Suspense} from 'react';
import './threeDemoStyle.scss'

class ThreeDemo extends React.Component<{ history: any }, {}> {
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
            <div className="ThreeDemo">
                <header className="ThreeDemo-header">
                    <p className="ThreeDemo-header-titile">
                        demo of three
                    </p>
                    <p className="ThreeDemo-header-navi">
                        {
                            routeList.map((route, index) => (
                                <span className="navi" key={index}
                                    onClick={() => this.toPage(route)}>
                                    {route.name + index}
                                </span>
                            ))
                        }
                    </p>
                    <p className="ThreeDemo-header-operation" ></p>
                </header>
                <div className="ThreeDemo-Game" >
                    <div id="DemoContainer" ></div>
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

export default withRouter(ThreeDemo);
