import React, { PureComponent, Component } from 'react';

// export default class IndexPage extends PureComponent{ 
  // 页面渲染好之后，第一次点击不打印render，显示的state不变，第二次点击不打印render，显示的state不变
export default class IndexPage extends Component{ 
  // 页面渲染好之后，第一次点击打印render并且state变为12，第二次点击打印render，但是state为122
  constructor() {
    super();
    this.state = {
      arr: [1]
    };
    console.log('constructor');
  }
  changeState = () => {
    let {arr} = this.state
    arr.push(2)
    console.log(arr);
    this.setState({
      arr
    })
  };
  render() {
    console.log('render');
    return (
      <div>
        <button onClick={this.changeState}>点击</button>
        <div>{this.state.arr.map(item => item)}</div>
      </div>
    );
  }
}
