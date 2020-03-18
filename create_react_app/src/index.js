import React from 'react';
import ReactDOM from 'react-dom';
import App from './page/App/App';
import Nav from './page/Nav/index';
import Home from './page/Home/index';
import PureComponent from './page/PureComponent/index';
import './index.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

ReactDOM.render((
  <Router>
    <div>
      <Nav />
    </div>
    <Switch>
      <Route exact path="/"><Home/></Route> // 这里必须加上exact属性，不然会覆盖掉/app的路由，即/app显示的还是/的页面
      <Route path="/app"><App/></Route>
      <Route path="/pureComponent"><PureComponent/></Route>
    </Switch>
  </Router>
),document.getElementById('root'));

// ReactDOM.render(<App/>,document.getElementById('root'));
