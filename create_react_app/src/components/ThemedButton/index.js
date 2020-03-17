import React, { Component } from 'react';
import {ThemeContext} from '../contextConfig'

export default class ThemeButton extends Component {
    static contextType = ThemeContext;
    render() {
        return (
            <div>
                {/* <button>theme: {this.context}</button> */}
                {/* 或者 */}
                <ThemeContext.Consumer>
                    {
                       (value) => <button>theme: {value}</button>
                    }
                </ThemeContext.Consumer>
            </div>
        )
    }
    
}

