import React, { Component } from 'react';
import DevTools from 'mobx-react-devtools';

import TodoListModel from '../../models/Mobx1/TodoListModel';
import TodoList from '../../components/Mobx1/TodoList'

const store = new TodoListModel();

class Com extends Component {

  componentDidMount() {
    store.addTodo("Get Coffee");
    store.addTodo("Write simpler code");
    store.todos[0].finished = true;
  }  

  render() {

    return (
      <div className="App">
        <DevTools />
        <h1>mobx list</h1>
        <TodoList store={store} />
      </div>
    );
  }
}

export default Com;

