import React, { Component } from 'react';
import './index.css';
// import NavLink from './navLink'
import {useRouteMatch, Link} from 'react-router-dom' // 要使用useRouteMatch，那么下面必须是函数的形式，不能用class组件

export default function Home() {
  let match = useRouteMatch();
  return (
    <div className="nav">
      <div role="nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/app">App</Link></li>
        {/* <li><Link to={`${match.url}/app`}>App</Link></li> */}
        <li><Link to="/pureComponent">pureComponent</Link></li>
        <li><Link to="/youzan">youzan utils</Link></li>
        <li><Link to="/hook">hook</Link></li>
        <li><Link to="/decorator">decorator</Link></li>
        <li><Link to="/mobx">mobx todolist</Link></li>
        <li><Link to="/mobx_basic">mobx 基础 可以用于练习</Link></li>
      </div>
    </div>
  )
}

