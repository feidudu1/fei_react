import React, { PureComponent, Component } from 'react';

export default class Example extends Component{ 

  render() {
    console.log('child render');
    return (
      <div>
        <div>{this.props.person.name}</div>
      </div>
    );
  }
}
