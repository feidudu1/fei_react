import React from 'react';
import { connect } from 'dva';
import UsersComponent from '../components/Users/Users';
import styles from './Users.css';

function Users() {
  return (
    <div className={styles.normal}>
      <UsersComponent />
    </div>
  );
}

export default connect()(Users);
