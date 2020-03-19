import React, { PureComponent, Component } from 'react';
import Example from './Example'

export default class IndexPage extends PureComponent{ 
// export default class IndexPage extends Component{ 
  constructor() {
    super();
    this.state = {
      person: {name: 'feifei'}
    };
    console.log('constructor 3');
  }
  changeState = () => {
    let {person} = this.state
    person.name = 'feifei2'
    this.setState({
      person
    })
  };
  render() {
    console.log('parent render');
    return (
      <div>
        <button onClick={this.changeState}>点击</button>
        <Example person={this.state.person} />
      </div>
    );
  }
}
