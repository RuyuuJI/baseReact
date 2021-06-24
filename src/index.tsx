import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
<<<<<<< HEAD
import store from './redux/store'
import { Provider } from 'react-redux'


ReactDOM.render(
  <Provider store={store}>
=======

ReactDOM.render(
>>>>>>> bc7c0047538bd6e1ab4485f99c4613f2afe5dcac
  <React.StrictMode>
    <Router >
      <Suspense fallback={<div >Loading</div>}>
        <Switch >
          <Route path="/" component={App} />
        </Switch>
    </Suspense>
    </Router>
<<<<<<< HEAD
  </React.StrictMode></Provider>,
=======
  </React.StrictMode>,
>>>>>>> bc7c0047538bd6e1ab4485f99c4613f2afe5dcac
  document.getElementById('root')
);

reportWebVitals();
