import {
    Switch,
    Route,
    withRouter
} from "react-router-dom";
import { routeList } from '../route/gameCenter'
import React from 'react';
import './gameCenterStyle.scss'

class GameCenter extends React.Component<{ history: any }, {}> {
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
            <div className="GameCenter">
                <header className="GameCenter-header">
                    <p className="GameCenter-header-titile">
                        place for game
                    </p>
                    <p className="GameCenter-header-navi">
                        {
                            routeList.map((route, index) => (
                                <span className="navi" key={index}
                                    onClick={() => this.toPage(route)}>
                                    {route.name + 'index'}
                                </span>
                            ))
                        }
                    </p>
                </header>
                <div className="GameCenter-Game" >
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
                </div>
            </div>
        );
    }

}

export default withRouter(GameCenter);
