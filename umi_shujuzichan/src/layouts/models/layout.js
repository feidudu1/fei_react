
export default {
  namespace: 'layout',
  state: {
    layout: {}
  },
  subscriptions: {
    setup({ dispatch, history }) {
    },
  },
  effects: {
    *saveLayout({ payload: {layout} }, { call, put }) {
      yield put({
        type: 'save',
        payload: {layout}
      });
    },
  },

  reducers: {
    save(state, { payload: { layout } }) {
      return { ...state, layout };
    },
  },

};
