import {
  apiDepartmentList,
  apiDataQuality,
  apiBanner1,
  apiBanner2,
  apiBanner3,
  apiBanner41,
  apiBanner42,
  apiBanner5,
  apiSourceType,
  apiUpdateTable,
  apiTrend,
  apiSourceDepartment,
  apiDepartmentRank,
  apiTableTop,
  apiQuotaList,
  apiProblemTrend,
  apiProblemTable,
  apiAccessTrend,
  apiQualityTop,
  apiTableRatio
} from '../services/index'
import {
  transGT,
  TransUnit,
  TransMethods,
  transGTUnit,
} from '../../../utils/tool';

const qualityObj = {
  indicatorConsistency: '规范性',
  indicatorStability: '稳定性',
  indicatorAccuracy: '准确性',
  indicatorUnique: '唯一性',
  indicatorCompleteness: '完整性',
  indicatorFreshness: '时效性',
}
const bannerDataDefault1 = [
  { x: '来源部门数', y1: 0, z1: '个' },
  { x: '来源数据量', y1: 0, z1: 'G'},
  { x: '来源表数', y1: 0, z1: '张' },
  { x: '来源字段数', y1: 0, z1: '个' },
  { x: '来源条数', y1: 0, z1: '条' },
  { x: '昨日增量', y1: 0, z1: '条' },
]
const bannerDataDefault2 = [
  { x: '来源数据量', y1: 0, z1: 'G' },
  { x: '来源表数', y1: 0, z1: '张' },
  { x: '来源字段数', y1: 0, z1: '个' },
  { x: '来源条数', y1: 0, z1: '条' },
  { x: '昨日增量', y1: 0, z1: '条' },
]
export default {
  namespace: 's1',
  state: {
    DepartmentList: [],
    activeDepartment: {name: '总体情况'},
    bannerData: bannerDataDefault1,
    SourceType: [],
    UpdateTable: [],
    // 总体情况 数据接入趋势----
    trendTypeId: 0,
    trendTimeId: 0,
    TrendData: [],
    // 总体情况 数据来源部门占比----
    selectId5: 1,
    SourceDepartment: [],
    // 总体情况 来源部门增量排名----
    selectId4: 0,
    isDesc2: true,
    DepartmentRank: [],
    barOpts2: {},
    // 总体情况 数据表排名----
    tableData: [],
    isDesc1: true,
    selectId3: 0,
    barOpts1: {},
    // 问题数据量趋势
    trendIssueId: 0,
    ProblemTrend: [],
    // 问题数据列表
    ProblemTable: [],
    // 接入数据趋势
    trendTypeId2: 0,
    trendTimeId2: 0,
    // 数据表质量排名
    isDescQuality: true,
    QualityTop: [],
    activeQuoItem: { name: '完整性', id: 0 },
    barOptsQuality: {
      unit: ['%'],
    },
    // 表数据量排名
    isDescTableNum: true
    
  },
  reducers: { // 跟store相关
    saveDepartmentList(state, { payload: { DepartmentList } }) {
      return {...state,DepartmentList};
    },
    saveDataQuality(state, { payload: { quality } }) {
      return {...state, quality};
    },
    saveBannerData(state, { payload: { bannerData} }) {
      return {...state, bannerData};
    },
    saveSourceType(state, { payload: { SourceType} }) {
      return {...state, SourceType};
    },
    saveUpdateTable(state, { payload: { UpdateTable} }) {
      return {...state, UpdateTable};
    },
    saveTrend(state, { payload: { TrendData } }) {
      return {...state, TrendData};
    },
    saveSourceDepartment(state, { payload: { SourceDepartment } }) {
      return {...state, SourceDepartment};
    },
    saveDepartmentRank(state, { payload: { DepartmentRank, barOpts2 } }) {
      return {...state, DepartmentRank, barOpts2};
    },
    saveTableTop(state, { payload: { tableData, barOpts1 } }) {
      return {...state, tableData, barOpts1};
    },
    saveActiveDepartment(state, { payload: { activeDepartment } }) {      
      return {...state, activeDepartment};
    },
    saveProblemTrend(state, { payload: { ProblemTrend } }) {
      return {...state,ProblemTrend};
    },
    saveProblemTable(state, { payload: { ProblemTable } }) {
      return {...state,ProblemTable};
    },
    saveQualityTop(state, { payload: { QualityTop, barOptsQuality } }) {
      return {...state,QualityTop, barOptsQuality};
    },
    saveTableRatio(state, { payload: { TableRatio } }) {
      return {...state,TableRatio};
    },
  },
  effects: { // 跟server相关
    *changeDeptId({payload: {item, page}}, {put}) {
      yield put({
        type: 'saveActiveDepartment',
        payload: {
          activeDepartment: item
        }
      });      
      yield put({
        type: 'GetData',
        payload: {page}
      });
    },
    *DepartmentList({}, { call, put }) {
      const { data } = yield call(apiDepartmentList);
      const resData = []
      const newData = data.data
      if (newData && newData.length) {
        newData.map(t => {
          resData.push({
            name: t.deptName,
            id: t.deptId
          })
        })
      }
      resData.unshift({name: '总体情况'})
      yield put({
        type: 'saveDepartmentList',
        payload: {
          DepartmentList: resData
        }
      });
    },
    *DataQuality({payload: {page}}, { call, put, select }) {
      let data
      let deptId
      if(page === 'ss1') {
        data = (yield call(apiDataQuality)).data
      } else if(page === 'ss2') {
        deptId = yield select(state => state.s1.activeDepartment.id)
        data = (yield call(apiQuotaList, {deptId})).data
      }
      const resData = []
      const newData = data.data
      Object.keys(qualityObj).map(t => {
        const chooseData = newData.filter((d) => d.indicatorName === t);
        if (chooseData.length > 0) {
          resData.push({
            x: qualityObj[t],
            y: chooseData[0].score,
            z: chooseData[0].trend,
          })
        }
      })
      yield put({
        type: 'saveDataQuality',
        payload: {
          quality: resData
        }
      });
    },
    *getBannerData({payload: {page}}, { call, put, select }) {
      const deptId = yield select(state => state.s1.activeDepartment.id)
      const { data: res1 } = yield call(apiBanner1);
      const { data: res2 } = yield call(apiBanner2, {deptId});
      const { data: res3 } = yield call(apiBanner3, {deptId});
      const { data: res41 } = yield call(apiBanner41, {deptId});
      const { data: res42 } = yield call(apiBanner42, {deptId});
      const { data: res5 } = yield call(apiBanner5, {deptId});
      const data = [];
      if (res2.data && res3.data && res41.data && res42.data && res5.data) {
        if (res1.data && page === 'ss1') {
          const resData1 = res1.data;
          data.push({
            x: resData1.name || '来源部门数',
            y1: resData1.value || 0,
            z1: resData1.unit || '个',
          });
        }
        const resData41 = res41.data;
        data.push({
          x: resData41.name || '来源数据量',
          y1: resData41.value || 0,
          z1: resData41.unit || 'B',
        });
        const resData2 = res2.data;
        data.push({
          x: resData2.name || '来源表数',
          y1: resData2.value || 0,
          z1: resData2.unit || '张',
        });
        const resData3 = res3.data;
        data.push({
          x: resData3.name || '来源字段数',
          y1: resData3.value || 0,
          z1: resData3.unit || '个',
        });
        const resData42 = res42.data;
        data.push({
          x: resData42.name || '来源条数',
          y1: resData42.value || 0,
          z1: resData42.unit || '条',
        });
        const resData5 = res5.data;
        data.push({
          x: resData5.name || '昨日增量',
          y1: resData5.value || 0,
          z1: resData5.unit || '条',
        });
      } else {
        data = page === 'ss1' ? bannerDataDefault1 : bannerDataDefault2
      }
      yield put({
        type: 'saveBannerData',
        payload: {
          bannerData: data
        }
      });
    },
    *SourceType({}, { call, put }) {
      const { data } = yield call(apiSourceType);
      const newData = data.data
      yield put({
        type: 'saveSourceType',
        payload: {
          SourceType: newData
        }
      });
    },
    *UpdateTable({}, { call, put }) {
      const { data } = yield call(apiUpdateTable);
      const newData = data.data
      const resData = []      
      newData.map(t => {
        resData.push([
          t.tableName || '--', t.deptName || '--', t.totalRowCount || 0, t.updateTime || '--', t.rowCountGrowthDaily || 0,
        ])
      })
      yield put({
        type: 'saveUpdateTable',
        payload: {
          UpdateTable: newData
        }
      });
    },
    *AccessTrend({}, { call, put, select }) {
      const type = yield select(state => state.s1.trendTypeId2) // 0数量，1条数，2数据表
      const period = yield select(state => state.s1.trendTimeId2) // 0按周，1按月，2按年
      const deptId = yield select(state => state.s1.activeDepartment.id)
      const { data } = yield call(apiAccessTrend, {type, period, deptId});
      const newData = data.data
      const resData = []
      let method
      if (type === 0) {
        method = TransMethods('size', newData, 'count')
      } else {
        method = TransMethods('num', newData, 'count')
      }
      newData.map(t => {
        resData.push({
          num: period,
          x: t.date,
          y: (t.count / method.divide).toFixed(0),
          unit: `${method.name}${['', '条', '张'][type]}`,
        })
      })      
      yield put({
        type: 'saveTrend',
        payload: {
          TrendData: resData
        }
      });
    },
    *Trend({}, { call, put, select }) {
      const type = yield select(state => state.s1.trendTypeId) // 0数量，1条数，2数据表
      const period = yield select(state => state.s1.trendTimeId) // 0按周，1按月，2按年
      const { data } = yield call(apiTrend, {type, period});
      const newData = data.data
      const resData = []
      let method
      if (type === 0) {
        method = TransMethods('size', newData, 'count')
      } else {
        method = TransMethods('num', newData, 'count')
      }
      newData.map(t => {
        resData.push({
          num: period,
          x: t.date,
          // w: `第${moment(t.date).isoWeeks()}周`,
          y: (t.count / method.divide).toFixed(0),
          unit: `${method.name}${['', '条', '张'][type]}`,
        })
      })      
      yield put({
        type: 'saveTrend',
        payload: {
          TrendData: resData
        }
      });
    },
    *SourceDepartment({}, { call, put, select }) {
      const type = yield select(state => state.s1.selectId5) ? 1 : 0 // 0:条数 1：储存量
      const { data } = yield call(apiSourceDepartment, {type});
      const newData = data.data
      const resData = []
      newData.forEach(t => {
        if (t.count) {
          resData.push({
            department: t.deptName || '',
            transNum: type ? transGTUnit(t.count, 4)[0] : TransUnit(t.count, 3)[0],
            ratio: (t.ratio * 100).toFixed(0),
            number: t.count,
            unit: type ? `${transGTUnit(t.count, 3)[1]}` : `${TransUnit(t.count, 3)[1]}条`,
          })
        }
      })
      yield put({
        type: 'saveSourceDepartment',
        payload: {
          SourceDepartment: resData
        }
      });
    },
    *DepartmentRank({}, { call, put, select }) {
      const type = (yield select(state => state.s1.selectId4)) === 0 ? 1 : 0 // 0:条数 1：储存量
      const order = yield select(state => state.s1.isDesc2) ? 'desc' : 'asc'
      const { data } = yield call(apiDepartmentRank, {type, order});
      const newData = data.data
      const resData = []
      let barOpts2 = {title: ['部门']}
      if (type === 1) {
        const methord = TransMethods('size', newData, 'count')
        newData.map(t => {
          resData.push({
            x: t.deptName,
            y: (t.count / methord.divide).toFixed(1), // 存储量
            v: (t.count / methord.divide).toFixed(1), // 存储量
          })
        })
        barOpts2.unit = [methord.name]
      } else if (type === 0) {
        const methord = TransMethods('num', newData, 'count')
        newData.map(t => {
          resData.push({
            x: t.deptName,
            y: (t.count / methord.divide).toFixed(methord.name ? 1 : 0), // 条数
            v: (t.count / methord.divide).toFixed(methord.name ? 1 : 0), // 条数
          })
        })
        barOpts2.unit = [`${methord.name}条`]
      }
      yield put({
        type: 'saveDepartmentRank',
        payload: {
          DepartmentRank: resData,
          barOpts2,
        }
      });
    },
    *TableTop({}, { call, put, select }) {
      const type = (yield select(state => state.s1.selectId3)) === 0 ? 1 : 0 // 0:条数 1：储存量
      const order = yield select(state => state.s1.isDesc1) ? 'desc' : 'asc'
      const { data } = yield call(apiTableTop, {type, order});
      const newData = data.data
      const resData = []
      let barOpts1 = {title: ['表名']}
      if (type === 1) { // 储存量
        const methord = TransMethods('size', newData, 'count')
        newData.map(t => {
          resData.push({
            x: t.tableName === undefined ? '未知' : t.tableName,
            y: (t.count / methord.divide).toFixed(1), // 存储量
            v: (t.count / methord.divide).toFixed(1), // 存储量
          })
        })
        barOpts1.unit = [methord.name]
      } else if (type === 0) { // 条数
        const methord = TransMethods('num', newData, 'count')
        newData.map(t => {
          resData.push({
            x: t.tableName === undefined ? '未知' : t.tableName,
            y: (t.count / methord.divide).toFixed(methord.name ? 1 : 0) - 0, // 条数
            v: (t.count / methord.divide).toFixed(methord.name ? 1 : 0) - 0, // 条数
          })
        })
        barOpts1.unit = [`${methord.name}条`]
      }
      yield put({
        type: 'saveTableTop',
        payload: {
          tableData: resData,
          barOpts1,
        }
      });
    },
    *ProblemTrend({}, { call, put, select }) {
      const deptId = yield select(state => state.s1.activeDepartment.id)
      const period = yield select(state => state.s1.trendIssueId)
      const { data } = yield call(apiProblemTrend, {deptId, period});
      const newData = data.data
      const resData = []
      const method = TransMethods('num', newData, 'count')
      newData.map(t => {
        resData.push({
          num: period,
          x: t.date,
          // w: `第${moment(t.date).isoWeeks()}周`,
          y: t.count,
          unit: `${method.name}个`,
        })
      })
      yield put({
        type: 'saveProblemTrend',
        payload: {
          ProblemTrend: resData,
        }
      });
    },
    *ProblemTable({}, { call, put, select }) {
      const deptId = yield select(state => state.s1.activeDepartment.id)
      const { data } = yield call(apiProblemTable, {deptId});
      const newData = data.data
      const resData = []
      newData.map(t => {
        resData.push([
          t.tableName, t.problemNote, t.problemName, `${(t.percent * 100).toFixed(1)}%`,
        ])
      })
      yield put({
        type: 'saveProblemTable',
        payload: {
          ProblemTable: resData,
        }
      });
    },
    *QualityTop({}, { call, put, select }) {
      const deptId = yield select(state => state.s1.activeDepartment.id)
      const order = (yield select(state => state.s1.isDescQuality)) ? 'desc' : 'asc'
      const type = yield select(state => state.s1.activeQuoItem.id)
      const title = yield select(state => state.s1.activeQuoItem.name)
      const { data } = yield call(apiQualityTop, {deptId, order, type});
      const newData = data.data
      const resData = []
      newData.map(t => {
        resData.push({
          x: t.tableName,
          y: (t.indicatorValue * 100).toFixed(1),
          v: (t.indicatorValue * 100).toFixed(1),
        })
      })
      const barOptsQuality = {
        unit: ['%'],
        title: ['表名', title]
      }
      yield put({
        type: 'saveQualityTop',
        payload: {
          QualityTop: resData,
          barOptsQuality
        }
      });
    },
    *TableRatio({}, { call, put, select }) {
      const deptId = yield select(state => state.s1.activeDepartment.id)
      const order = (yield select(state => state.s1.isDescTableNum)) ? 'desc' : 'asc'
      const { data } = yield call(apiTableRatio, {deptId, order});
      const newData = data.data
      const resData = []
      newData.map(t => {
        resData.push({
          department_name: t.tableName,
          rate_num: t.tableCount,
          rate: t.tableRank,
        })
      })
      yield put({
        type: 'saveTableRatio',
        payload: {
          TableRatio: resData,
        }
      });
    },
    *GetData({payload: {page}}, { call, put, select }) {
      yield put({
        type: 'DataQuality',
        payload: {page}
      });
      yield put({
        type: 'getBannerData',
        payload: {page}
      });

      if (page === 'ss1') {
        yield put({
          type: 'Trend',
        });

      } else if (page === 'ss2') {
        yield put({
          type: 'ProblemTrend'
        });
        yield put({
          type: 'ProblemTable'
        });
        yield put({
          type: 'AccessTrend'
        });
        yield put({
          type: 'QualityTop'
        });
        yield put({
          type: 'TableRatio'
        });

      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        console.log(3333, query);
        const {id, name, page} = query
        if (pathname === '/s1') {
          dispatch({ type: 'DepartmentList' });
          dispatch({ type: 'DataQuality', payload: {page} });
          dispatch({ type: 'getBannerData', payload: {page} });
          if (page === 'ss1') { // 总体情况
            dispatch({ type: 'SourceType' });
            dispatch({ type: 'UpdateTable' });
            dispatch({ type: 'Trend' });
            dispatch({ type: 'SourceDepartment' });
            dispatch({ type: 'DepartmentRank' });
            dispatch({ type: 'TableTop' });
          } else if (page === 'ss2') {
            dispatch({type: 'ProblemTrend'})
            dispatch({type: 'ProblemTable'})
            dispatch({type: 'AccessTrend'})
          }
        }
      })
    }
  }
}