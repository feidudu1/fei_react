import React, { Component } from 'react';
import './index.css';
// import NavLink from './navLink'
import {useRouteMatch, Link} from 'react-router-dom' // 要使用useRouteMatch，那么下面必须是函数的形式，不能用class组件

export default function Home() {
  let match = useRouteMatch();
  return (
    <div className="App">
      <div role="nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/app">App</Link></li>
      </div>
    </div>
  )
}
