import React, { Component } from 'react';
import './index.css';
import IndexPage from '../IndexPage'
import IndexPage2 from '../IndexPage2'
import IndexPage3 from '../IndexPage3'

class PureComponent extends Component {
  render() {
    return (
      <div className="App">
        purecomponent
        《基础类型》
        <IndexPage />
        《引用类型》
        <IndexPage2 />
        对子组件的影响
        <IndexPage3 />
      </div>
    );
  }
}

export default PureComponent;
