<template>
  <div class="tags">
    <ul>
      <li
        class="tags-li"
        :class="{ active: isActive(item.path) }"
        v-for="item of tabList"
        :index="item.path"
        :key="item.path"
        @click="goTo(item)"
      >
        <span
          v-if="item.path != '/'"
          @click.stop="removeTab(item)"
          class="tags-li-name"
          >{{ item.name }}<el-icon><close-bold /></el-icon>
        </span>
      </li>
    </ul>
  </div>
  <div class="tabs-close-item" style="float: right" @click="closeAllTab">
    全部关闭
  </div>
</template>

<script>
import { CloseBold } from "@element-plus/icons";
export default {
  components: {
    //注册图标组件名称
    CloseBold,
  },
  name: "NavList",
  data() {
    return {
      tabList: this.$store.state.tabList,
      currentRoute: this.$route.path,
    };
  },
  mounted() {
    //保存当前页标签
    this.$store.dispatch("saveTab", this.$route);
    console.log(this.$route.path);
  },
  computed: {
    //标签是否处于当前页

    isFold() {
      return this.$store.state.collapse ? "el-icon-s-unfold" : "el-icon-s-fold";
    },
  },
  methods: {
    isActive(path) {
      return path === this.$route.path;
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
      this.$router.push({ path: "/home" });
    },
  },
};
</script>

<style scoped>
.tags {
  position: relative;
  height: 30px;
  overflow: hidden;
  background: #fff;
}
.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
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

  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
}

.tags-li.active {
  background: rgb(42, 94, 153);
}

.tags-li-name {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-name {
  color: #fff;
}
</style>
