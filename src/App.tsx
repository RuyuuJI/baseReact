import './App.scss';
import { route, routeList } from './route/index'
import {
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import React from 'react';
<<<<<<< HEAD
import { user } from './core/user'
import { Communicate } from './modules/communicate';
import { person } from './constants/user';
import { ThemeSet } from './modules/themeSet';

class App extends React.Component<{ history: any }, { hideHeader: boolean }> {
=======


class App extends React.Component<{ history: any }, {hideHeader: boolean}> {
>>>>>>> bc7c0047538bd6e1ab4485f99c4613f2afe5dcac
  constructor(props: any) {
    super(props)
    this.toPage.bind(this)
    this.state = {
      hideHeader: true
    }
  }
  toPage(route: route) {
    const { history } = this.props
    history.push(route.path)
  }
  // hide the header
  changeHeader = () => {
    this.setState({
      hideHeader: !this.state.hideHeader
    })
  }

  render() {
<<<<<<< HEAD
    const headerHide = this.state.hideHeader ? 'hide' : ''
=======
    const headerHide = this.state.hideHeader ? 'hide':''
>>>>>>> bc7c0047538bd6e1ab4485f99c4613f2afe5dcac
    return (
      <div className="App">
        <header className={`App-header ${headerHide}`}>
          <p className="App-header-title">
            welcome to a project of nothing
          </p>
          <p className="App-header-navi">
            {routeList.map((page, index) => (
              <span key={index} className="navi"
                onClick={() => this.toPage(page)}>
                {index + page.name}
              </span>
            ))}
          </p>
        </header>
        <div className="App-content">
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
<<<<<<< HEAD

        {/* menu */}
        <div className="operation">
          <span className={`hideHeaderBTN ${headerHide}`} onClick={this.changeHeader}></span>
          <ThemeSet ></ThemeSet>
        </div>
        {/* extra */}
        <Communicate user={user} />
=======
        <span className={`hideHeaderBTN ${headerHide}`} onClick={this.changeHeader}></span>
>>>>>>> bc7c0047538bd6e1ab4485f99c4613f2afe5dcac
      </div>
    );
  }
}

export default withRouter(App);
