import React, { Component } from 'react';

class Com extends Component {
  render() {
    enum Color {Red=1, Green, Blue}
    let c: Color = Color.Blue
    let a: number[] = [1, 2, 3, 4];
    let ro: ReadonlyArray<number> = a;
    let d = ro as number[]
    // console.log(c);
    
    return (
      <div className="App">
        {d}
      </div>
    );
  }
}

export default Com;
