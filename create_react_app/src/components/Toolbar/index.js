import React from 'react';
import ThemedButton from '../ThemedButton'

const Toolbar = (props) => {
    return (
      <div>
        <ThemedButton />
      </div>
    )
}
export default Toolbar

// 或者class形式
// import React, { Component } from 'react';
// import ThemedButton from '../ThemedButton'

// class Toolbar extends Component {
//     render() {
//         return (
//             <div>
//               <ThemedButton />
//             </div>
//           )
//     }
// }
// export default Toolbar
