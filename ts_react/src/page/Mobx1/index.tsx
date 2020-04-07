import React, { Component } from 'react';
import {observable} from 'mobx';

function dec(id:number){
  console.log('evaluated', id);
  return (target:any, property:any, descriptor:any) => console.log('executed', id, target, property, descriptor);
}

var counter = 0;

var add = function (id:number) {
  return (target:any, property:any, descriptor:any) => console.log('count', counter++, target, property, descriptor);
};

class Com extends Component {
  @observable title = 'hi';
  
  @dec(1)
  @dec(2)
  method(){}

  @add(2)
  foo() {
  }
  
  render() {

    return (
      <div className="App">
        mobx: {this.title}
      </div>
    );
  }
}

export default Com;
