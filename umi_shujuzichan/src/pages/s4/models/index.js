import { apiDeptLeft } from '../services/index'
export default {
  namespace: 's4',
  state: {
    leftDepts: [],
    total: null,
    page: null,
  },
  reducers: { // 跟store相关
    saveDeptLeft(state, { payload: { leftDepts } }) {
      return { ...state, leftDepts };
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
    // *remove({payload: id}, {call, put, select}) {
    //   yield call(usersService.remove, id);
    //   const page = yield select(state => state.users.page)
    //   yield put({type: 'fetch', payload: { page }});
    // },
    // *patch({payload: {id, values}}, {call, put, select}) {
    //   yield call(usersService.patch, id, values);
    //   const page = yield select(state => state.users.page)
    //   yield put({type: 'fetch', payload: {page}})
    // }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/s4') {
          dispatch({ type: 'DeptLeft'});
        }
      });
    },
  },
};