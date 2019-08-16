import { connect } from 'dva';
import withRouter from 'umi/withRouter'
import Tree from './components/Tree/index'
import MiddleDiamond from './components/MiddleDiamond/index'
import style from './index.less';

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
      <MiddleDiamond
        // getMoveStatus={this.getMoveStatus}
        // getNodeId={this.getNodeId}
        diamond={diamondData}
        // leftTop={this.options}
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