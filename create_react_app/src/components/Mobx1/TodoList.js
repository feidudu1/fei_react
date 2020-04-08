import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

import Todo from './Todo'

@observer
export default class TodoList extends Component {
    @observable newTodoTitle = '';

    @action
    handleInputChange = e => {
        console.log(e.target.value);
        this.newTodoTitle = e.target.value
    }

    @action
    handleFormSubmit = e => {
        this.props.store.addTodo(this.newTodoTitle)
        this.newTodoTitle = ''
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    New Todo:
                    <input 
                        type="text"
                        value={this.newTodoTitle}
                        onChange={this.handleInputChange}
                    />
                    <button type="submit">Add</button>
                </form>
                <hr/>
                <ul>
                    {this.props.store.todos.map(todo => (
                        <Todo todo={todo} key={todo.id} />
                    ))}
                </ul>
                <hr/>
                task left: {this.props.store.unfinishedTodoCount}
            </div>
        )
    }
}