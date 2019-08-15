import {
  apiDeptLeft,
  apiDeptRight,
  apiAppRight,
  apiLeftStatus,
  apiRightStatus,
  apiMiddleDiamond,
} from '../services/index'
export default {
  namespace: 's4',
  state: {
    leftDepts: [],
    rightDepts: [],
    rightApps: [],
    leftData: {},
    rightData: {},
    diamondData: [],
  },
  reducers: { // 跟store相关
    saveDeptLeft(state, { payload: { leftDepts } }) {
      return {...state,leftDepts};
    },
    saveDeptRight(state, { payload: { rightDepts } }) {
      return {...state, rightDepts};
    },
    saveAppRight(state, { payload: { rightApps} }) {
      return {...state, rightApps};
    },
    saveMiddleDiamond(state, { payload: { diamondData } }) {
      return {...state, diamondData};
    },
    saveLeftStatus(state, { payload: { leftData } }) {
      return {...state,leftData};
    },
    saveRightStatus(state, { payload: { rightData } }) {
      return {...state,rightData};
    },
  },
  effects: { // 跟server相关
    *DeptLeft({}, { call, put }) {
      const { data } = yield call(apiDeptLeft);
      yield put({
        type: 'saveDeptLeft',
        payload: {
          leftDepts: data.data
        }
      });
    },
    *DeptRight({}, { call, put }) {
      const { data } = yield call(apiDeptRight);
      yield put({
        type: 'saveDeptRight',
        payload: {
          rightDepts: data.data
        }
      });
    },
    *AppRight({}, { call, put }) {
      const { data } = yield call(apiAppRight);
      yield put({
        type: 'saveAppRight',
        payload: {
          rightApps: data.data,
        }
      });
    },
    *MiddleDiamond({payload, cb}, { call, put }) {
      const { data } = yield call(apiMiddleDiamond);
      const res = yield put({
        type: 'saveMiddleDiamond',
        payload: {
          diamondData: data.data,
        }
      });
      if (cb && typeof cb === 'function') {
        cb(res.payload.diamondData)
      }
    },
    *LeftStatus({payload: {nodeId}}, { call, put }) {
      console.log(6666, nodeId);
      
      const { data } = yield call(apiLeftStatus, {nodeId});
      yield put({
        type: 'saveLeftStatus',
        payload: {
          leftData: data.data
        }
      });
    },
    *RightStatus({payload: {nodeId}}, { call, put }) {
      const { data } = yield call(apiRightStatus, {nodeId});
      yield put({
        type: 'saveRightStatus',
        payload: {
          rightData: data.data
        }
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/s4') {
          dispatch({ type: 'DeptLeft' });
          dispatch({ type: 'DeptRight' });
          dispatch({ type: 'AppRight' });
          dispatch({
            type: 'MiddleDiamond',
            cb: res => {
              if (res && res.length) {
                const nodeId = res[0].children[0].categoryId
                dispatch({ type: 'LeftStatus', payload: {nodeId}});
                dispatch({ type: 'RightStatus', payload: {nodeId}});
              }
            }
          });
        }
      });
    },
  },
};