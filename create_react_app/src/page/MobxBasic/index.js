import React, { Component } from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';

// @observer
class Com extends Component {
  // @observable timer = 0
  // @observable todos = []
  // @computed get unfinishedTodoCount() {
  //   return this.todos.filter(todo => !todo.finished).length 
  // }

  // onReset() {
  //   this.props.appState.resetTimer()
  // }

  render() {

    return (
      <div className="App">
        
      </div>
    );
  }
}



export default Com;
