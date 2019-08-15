import { connect } from 'dva';
import withRouter from 'umi/withRouter'
// import { routerRedux } from 'dva/router';
// import styles from './Users.css';
// import { PAGE_SIZE } from '../constants';
import Tree from './components/Tree/index'
import style from './index.less';
// const width = document.documentElement.clientWidth;
// const height = document.documentElement.clientHeight;
// const visual = width / height;
// const visualFil = 3840 / 2160;
// const connfirm = visual > visualFil;
// const scales = connfirm ? height / 1080 : width / 1920;
// const options = {
//   leftScale: (width - (1920 * scales)) / 2,
//   topScale: (height - (1080 * scales)) / 2,
//   scales,
// };
function S4({
   leftDepts,
   rightDepts,
   rightApps,
   leftData,
   rightData,
   diamondData,
   options
 }) {
   return (
    
    <div className={`${style.main} s4Main`}>
      <Tree leftDepts={leftDepts} rightDepts={rightDepts} rightApps={rightApps} leftData={leftData} rightData={rightData}
      options={options}
      />
      <div className={style.legend}></div>
    </div>
  );
}

function mapStateToProps(state) {
  const { leftDepts, rightDepts, rightApps, leftData, rightData, diamondData } = state.s4;
  const { layout } = state.layout;
  // console.log(3333666, layout);
  const options = {
    scales: layout.scales * 2,
    leftScale: 0,
    topScale: 0
  }
  return {
    leftDepts,
    rightDepts,
    rightApps,
    leftData,
    rightData,
    diamondData,
    options
  };
}

//  export default S4;
export default connect(mapStateToProps)(S4);
//  export default withRouter(connect(mapStateToProps)(S4));