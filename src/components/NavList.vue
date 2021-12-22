<template>
  <div>
    <div class="tabs-view-container">
      <div class="tabs-wrapper">
        <span
          class="tags-li"
          :class="{ active: isActive(item.path) }"
          v-for="item of tabList"
          :index="item.path"
          :key="item.path"
          @click="goTo(item)"
        >
          {{ item.name }}
          <i v-if="item.path !== '/welcome'" @click.stop="removeTab(item)"
            ><el-icon><close /></el-icon
          ></i>
        </span>
      </div>
      <div class="tabs-close-item" style="float: right" @click="closeAllTab">
        全部关闭
      </div>
    </div>
  </div>
</template>

<script>
import { Close } from "@element-plus/icons";
export default {
  components: {
    //注册图标组件名称
    Close,
  },
  name: "NavList",
  data() {
    return {
      tabList: this.$store.state.tabList,
    };
  },
  created() {
    //保存当前页标签
    this.$store.dispatch("saveTab", this.$route);
    console.log(this.$store.state.tabList);
  },
  computed: {
    isFold() {
      return this.$store.state.collapse ? "el-icon-s-unfold" : "el-icon-s-fold";
    },
  },
  methods: {
    isActive(path) {
      return path === this.$route.fullPath;
    },
    goTo(tab) {
      //跳转标签
      this.$router.push({ path: tab.path });
    },
    removeTab(tab) {
      //删除标签
      this.$store.commit("removeTab", tab);
      //如果删除的是当前页则返回上一标签页
      if (tab.path === this.$route.path) {
        var tabList = this.$store.state.tabList;
        this.$router.push({ path: tabList[tabList.length - 1].path });
      }
    },
    closeAllTab() {
      this.$store.commit("resetTab");
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
.tabs-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  width: 95%;
}

.tabs-view-container {
  display: flex;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  height: 33px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.tabs-close-item {
  position: absolute;
  right: 10px;
  display: inline-block;
  cursor: pointer;
  height: 25px;
  line-height: 25px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 5px;
}

.tags-li {
  float: left;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  background: #2e9afe;
  color: #f8f8f8;
}
</style>
