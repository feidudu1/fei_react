import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {ReactPropsDemo} from '../../components/ReactPropsDemo'
import Toolbar from '../../components/Toolbar'
import {ThemeContext} from '../../components/contextConfig'
import MouseTracker from '../../components/MouseTracker'
import WithMouse from '../../components/WithMouse'
import Cat from '../../components/Cat'

const WithMouseWrapper = WithMouse(Cat)

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ReactPropsDemo name="feifei" age={43}/>

        <ThemeContext.Provider value="dark">
          <Toolbar/>
        </ThemeContext.Provider>

        {/* 纯render props  */}
        <MouseTracker />
        {/* HOC + render props */}
        <WithMouseWrapper />
      </div>
    );
  }
}

export default App;
