import React from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';

function Example() {
  let appState = observable({
    timer: 0
  })

  setInterval(action(() => {
    appState.timer += 1
  }), 1000);

  let App = observer(({appState}) => {
    return (
      <div>
        <h1>{appState.timer}</h1>
      </div>
    );
  })
  
  return (
    <App appState={appState} />
  )
  
  
}

export default Example;