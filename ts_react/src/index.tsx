import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './index.css';
import App from './page/App';
import * as serviceWorker from './serviceWorker';

import Nav from './page/Nav';
import Home from './page/Home';

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <div>
      <Nav />
    </div>
    <Switch>
      <Route exact path="/"><Home/></Route> // 这里必须加上exact属性，不然会覆盖掉/app的路由，即/app显示的还是/的页面
      <Route path="/app"><App/></Route>
    </Switch>
  </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
