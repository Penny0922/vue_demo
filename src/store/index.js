import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    tabList: [],
    isCollapse: false,
  },
  mutations: {
    // 保存标签
    saveTab(state, tab) {
      if (state.tabList.findIndex((item) => item.path === tab.path) == -1) {
        state.tabList.push({ name: tab.name, path: tab.path });
      }
      console.log(tab.path);
    },
    // 移除标签
    removeTab(state, tab) {
      if (tab.name !== "首页") {
        var index = state.tabList.findIndex((item) => item.name === tab.name);
        state.tabList.splice(index, 1);
      }
    },
    // 重置标签
    resetTab(state) {
      state.tabList = [{ name: "首页", path: "/home" }];
    },
  },
  actions: {
    saveTab(context, data) {
      context.commit("saveTab", data);
    },
  },
});
