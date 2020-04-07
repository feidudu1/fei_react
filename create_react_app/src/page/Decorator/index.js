import React, { Component } from 'react';
// import {observable} from 'mobx';

function dec(id){
  console.log('evaluated', id);
  return (target, property, descriptor) => console.log('executed', id, target, property, descriptor);
}

class Com extends Component {
  @dec(1)
  @dec(2)
  method(){}
  
  render() {

    return (
      <div className="App">
        decorator: 
      </div>
    );
  }
}

export default Com;
