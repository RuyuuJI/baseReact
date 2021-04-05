import './App.scss';
import { route, routeList } from './route/index'
import {
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import React from 'react';


class App extends React.Component<{ history: any }, {hideHeader: boolean}> {
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
    const headerHide = this.state.hideHeader ? 'hide':''
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
        <span className={`hideHeaderBTN ${headerHide}`} onClick={this.changeHeader}></span>
      </div>
    );
  }
}

export default withRouter(App);
