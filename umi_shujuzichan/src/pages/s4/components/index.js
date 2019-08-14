import { connect } from 'dva';
import withRouter from 'umi/withRouter'
// import { routerRedux } from 'dva/router';
// import styles from './Users.css';
// import { PAGE_SIZE } from '../constants';
// import UserModal from './UserModal'

 function S4({ list: dataSource, total}) {
  function deleteHandler(id) {
    // dispatch({
    //   type: 'users/remove',
    //   payload: id,
    // })
  }
   return (
    <div>
      我们 {dataSource}
    </div>
  );
}

 function mapStateToProps(state) {
  const { leftDepts, total } = state.s4;
  console.log(9999, leftDepts);
  return {
    leftDepts,
    total,
    // loading: state.loading.models.users,
  };
}

//  export default S4;
 export default connect(mapStateToProps)(S4);
//  export default withRouter(connect(mapStateToProps)(S4));