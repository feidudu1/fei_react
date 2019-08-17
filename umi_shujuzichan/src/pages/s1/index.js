import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
// import withRouter from 'umi/withRouter'
import LeftPolygon from './components/LeftPolygon/index'
import SelectOption from './components/SelectOption/index'
import StaticInfo from './components/StaticInfo/index'
import LayerGroup from './components/LayerGroup/index'
import StaticList from './components/StaticList/index'
import SwitchBtn from './components/SwitchBtn/index'
import LineArea from './components/LineArea/index'
import PieSource from './components/PieSource/index'
import SortIcon from './components/SortIcon/index'
import RectBar from './components/RectBar/index'
import AllContent from './components/AllContent/index'
import CircleBar from './components/CircleBar/index'
import style from './index.less';

const switchTypeData = [[{ name: '数据量', id: 0 }, { name: '条数', id: 1 }, { name: '数据表', id: 2 }], ['trend_type', '分类']]
const switchTimeData = [[{ name: '年', id: 2 }, { name: '月', id: 1 }, { name: '周', id: 0 }], ['trend_time', '周期']]
const switchdata5 = [[{ name: '数据量', id: 1 }, { name: '条数', id: 0 }], ['dept_pie']]
const switchdata4 = [[{ name: '储存量', id: 0 }, { name: '条数', id: 1 }], ['source_bar']]
const switchdata3 = [[{ name: '储存量', id: 0 }, { name: '条数', id: 1 }], ['table_bar']]
const updateHead = ['表名', '来源部门', '总条数(条)', '更新时间', '数据日增量(条)']
const updateTableOpt = [450, 250, 190, 230, 200]
// 具体部门
const switchIssueData = [[{ name: '年', id: 2 }, { name: '月', id: 1 }, { name: '周', id: 0 }], ['issue_time', '周期']]
const trendIssueOpt = {
  width: 970, height: 440
}
const problemHead = ['表名', '数据表问题', '问题类型', '比率']
const problemTableOpt = [480, 340, 210, 150]
const QuoMenu = [
  { name: '完整性', id: 0 },
  { name: '唯一性', id: 1 },
  { name: '准确性', id: 2 },
  { name: '规范性', id: 3 },
  { name: '稳定性', id: 4 },
  { name: '时效性', id: 5 },
]
const QuoOpt = {
  width: '222px'
}

function S1({
  dispatch,
   DepartmentList,
   activeDepartment,
   quality,
   bannerData,
   SourceType,
   UpdateTable,
   trendTypeId,
   trendTimeId,
   TrendData,
   selectId5,
   SourceDepartment,
   selectId4,
   isDesc2,
   DepartmentRank,
   barOpts2,
   selectId3,
   isDesc1,
   barOpts1,
   tableData,
   // 具体部门相关
   trendIssueId,
   ProblemTrend,
   ProblemTable,
   trendTypeId2,
   trendTimeId2,
   isDescQuality,
   QualityTop,
   activeQuoItem,
   barOptsQuality,
   isDescTableNum,
   TableRatio
   
 }) {
   function handleSelect(item) {
     const page = item.id ? 'ss2' : 'ss1'
     dispatch({
       type: 's1/changeDeptId',
       payload: {item, page}
     })
    // const id = item.id
    // const name = item.name
    // const page = id ? 'ss2' : 'ss1';
    //  dispatch(routerRedux.push({
    //   pathname: '/s1',
    //   query: { page, id, name },
    // }))
   }
   function changeQuoItem(item) {
     const page = item.id ? 'ss2' : 'ss1'
    //  dispatch({
    //    type: 's1/changeDeptId',
    //    payload: {item, page}
    //  })
   }
   return (
    <div className={style.main}>
      {/* 部门下拉表 */}
      <div className={style.selectBlock}>
        <SelectOption
        menu={DepartmentList}
        item={activeDepartment}
        handleSelect={(item) => handleSelect(item)}
        title="筛选："
        />
      </div>
      <div className={style.qualityBlock}>
        <LeftPolygon data={quality}/>
      </div>
      <div className={style.bannerBlock}>
        <StaticInfo data={bannerData}/>
      </div>
      {
        activeDepartment.id ? 
        <div>
          {/* 问题数据量趋势 */}
          <div className={style.trendIssueBtn}>
            <SwitchBtn id={trendIssueId} data={switchIssueData}/>
          </div>
          <div className={style.trendIssueBlock}>
            <LineArea data={ProblemTrend} opts={trendIssueOpt} />
          </div>
          {/* 问题数据列表 */}
          <div className={style.problemTableBlock}>
            <StaticList data={ProblemTable} tableHead={problemHead} options={problemTableOpt}/>
          </div>
          {/* 数据接入趋势 */}
          <div className={style.trendBtn1}>
            <SwitchBtn id={trendTypeId2} data={switchTypeData} />
          </div>
          <div className={style.trendBtn2}>
            <SwitchBtn id={trendTimeId2} data={switchTimeData} />
          </div>
          <div className={style.trendBlock}>
            <LineArea data={TrendData}/>
          </div>
          {/* 数据表质量排名 */}
          <div className={style.qualityRankBtn}>
            <SortIcon isDesc={isDescQuality} />
          </div>
          <div className={style.selectTypeBlock}>
            <SelectOption
              options={QuoOpt}
              menu={QuoMenu}
              item={activeQuoItem}
              handleSelect={(item) => changeQuoItem(item)}
              title="分类："
              />
          </div>
          <div className={style.qualityRankBlock}>
            <RectBar opts={barOptsQuality} data={QualityTop}/>
          </div>
          {/* 表数据量排名 */}
          <div className={style.tableNumRankBtn}>
            <SortIcon isDesc={isDescTableNum} />
          </div>
          <div className={style.tableNumRankBlock}>
            <CircleBar data={TableRatio}/>
          </div>
          <AllContent page={2}/> 
        </div>
        : 
        <div>
          <AllContent page={1}/> 
          {/* 数据来源类型数 */}
          <div className={style.SourceTypeBlock}>
            <LayerGroup data={SourceType}/>
          </div>
          {/* 当周更新表 */}
          <div className={style.UpdateTableBlock}>
            <StaticList data={UpdateTable} tableHead={updateHead} options={updateTableOpt}/>
          </div>
          {/* 数据接入趋势 */}
          <div className={style.trendBtn1}>
            <SwitchBtn id={trendTypeId} data={switchTypeData} />
          </div>
          <div className={style.trendBtn2}>
            <SwitchBtn id={trendTimeId} data={switchTimeData} />
          </div>
          <div className={style.trendBlock}>
            <LineArea data={TrendData}/>
          </div>
          {/* 数据来源部门占比 */}
          <div className={style.sourceRatioBtn}>
            <SwitchBtn id={selectId5} data={switchdata5}/>
          </div>
          <div className={style.sourceRatioBlock}>
            <PieSource data={SourceDepartment} />
          </div>
          {/* 来源部门排名 */}
          <div className={style.deptRankBtn1}>
            <SwitchBtn id={selectId4} data={switchdata4} />
          </div>
          <div className={style.deptRankBtn2}>
            <SortIcon isDesc={isDesc2} />
          </div>
          <div className={style.deptRankBlock}>
            <RectBar data={DepartmentRank} opts={barOpts2}/>
          </div>
          {/* 数据表排名 */}
          <div className={style.tableRankBtn1}>
            <SwitchBtn id={selectId3} data={switchdata3}/>
          </div>
          <div className={style.tableRankBtn2}>
            <SortIcon isDesc={isDesc1} />
          </div>
          <div className={style.tableRankBlock}>
            <RectBar opts={barOpts1} data={tableData}/>
          </div>
        </div>
      }
        
    </div>
  );
}

function mapStateToProps(state) {
  const { DepartmentList, activeDepartment, quality, bannerData, SourceType, UpdateTable, trendTypeId, trendTimeId, TrendData, selectId5, SourceDepartment, selectId4, isDesc2, DepartmentRank, barOpts2, selectId3, isDesc1, barOpts1, tableData,
  // 具体部门相关
  trendIssueId, 
  ProblemTrend,
  ProblemTable,
  trendTypeId2,
  trendTimeId2,
  isDescQuality,
  QualityTop,
  activeQuoItem,
  barOptsQuality,
  isDescTableNum,
  TableRatio
  } = state.s1;
  // const { layout } = state.layout;
  console.log(3333666, tableData);
  // const options = {
  //   scales: layout.scales * 2,
  //   leftScale: 0,
  //   topScale: 0
  // }
  return {
    DepartmentList,
    activeDepartment,
    quality,
    bannerData,
    SourceType,
    UpdateTable,
    trendTypeId,
    trendTimeId,
    TrendData,
    selectId5,
    SourceDepartment,
    selectId4,
    isDesc2,
    DepartmentRank,
    barOpts2,
    selectId3,
    isDesc1,
    barOpts1,
    tableData,
    // 具体部门相关
    trendIssueId,
    ProblemTrend,
    ProblemTable,
    trendTypeId2,
    trendTimeId2,
    isDescQuality,
    QualityTop,
    activeQuoItem,
    barOptsQuality,
    isDescTableNum,
    TableRatio
  };
}

//  export default S4;
export default connect(mapStateToProps)(S1);
//  export default withRouter(connect(mapStateToProps)(S4));