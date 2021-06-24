import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import store from './redux/store'
import { Provider } from 'react-redux'


ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Router >
        <Suspense fallback={<div >Loading</div>}>
          <Switch >
            <Route path="/" component={App} />
          </Switch>
        </Suspense>
      </Router>
    </React.StrictMode></Provider>,
  document.getElementById('root')
);

reportWebVitals();
