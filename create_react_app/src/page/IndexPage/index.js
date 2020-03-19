import React, { PureComponent, Component } from 'react';

// export default class IndexPage extends PureComponent{ 
  // 页面渲染好之后，第一次点击打印render并且state变为true，第二次点击不打印render，且state仍为true
export default class IndexPage extends Component{ 
  // 页面渲染好之后，第一次点击打印render并且state变为true，第二次点击打印reander，但是state仍然为true，后面跟第二次一样
  constructor() {
    super();
    this.state = {
      isShow: false
    };
    console.log('constructor');
  }
  changeState = () => {
    this.setState({
      isShow: true
    })
  };
  render() {
    console.log('render');
    return (
      <div>
        <button onClick={this.changeState}>点击</button>
        <div>{this.state.isShow.toString()}</div>
      </div>
    );
  }
}
