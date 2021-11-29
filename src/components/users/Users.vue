<template>
  <!-- 面包屑区域 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <!-- 搜索与添加区域 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
        >
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" @click="getUserList">
          <el-icon><search /></el-icon>
        </el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true"
          >添加用户</el-button
        >
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      height="500"
      stripe
      style="width: 100%"
      v-loading="pictLoading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      element-loading-text="正在加载中"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="创建时间" prop="create_time"></el-table-column>
      <el-table-column label="状态">
        <template v-slot="scope">
          <el-switch v-model="scope.row.mg_state" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180px">
        <template v-slot="scope">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            size="mini"
            @click="showEditDialog(scope.row.id)"
          >
            <el-icon><edit /></el-icon>
          </el-button>
          <!-- 删除按钮 -->
          <el-button size="mini" @click="removeUserById(scope.row.id)">
            <el-icon><delete /></el-icon>
          </el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button type="warning" size="mini" @click="setRole(scope.row)">
              <el-icon><setting /></el-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </el-card>

  <!-- 添加用户的对话框 -->
  <el-dialog
    title="添加用户"
    v-model="addDialogVisible"
    width="50%"
    @close="addDialogClosed"
  >
    <!-- 内容主体区域 -->
    <el-form
      :model="editForm"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="70px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { formatDate } from "../../common/date.js";
import { Delete, Edit, Setting, Search } from "@element-plus/icons";
export default {
  components: {
    Delete,
    Edit,
    Setting,
    Search,
    //注册图标组件名称
  },
  data() {
    return {
      // 左侧菜单数据
      tableData: [],
      total: 0,
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 20,
      },
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      pictLoading: "",
      date: 1638153197,
    };
  },
  computed: {
    // 时间
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy.MM.dd");
    },
  },
  created() {
    this.gettableData();
  },
  methods: {
    // 获取所有的成员
    async gettableData() {
      this.pictLoading = true;
      console.log(this.pictLoading);
      const { data: res } = await this.axios.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.tableData = res.data.users;
      this.total = res.data.total;
      this.pictLoading = false;
      console.log(this.pictLoading);
      console.log(res.data);
    },
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.gettableData();
    },
    async addUser() {
      // 可以发起添加用户的网络请求
      const { data: res } = await this.axios.post("users", this.addForm);

      if (res.meta.status !== 201) {
        this.$message.error("添加用户失败！");
      }

      this.$message.success("添加用户成功！");
      // 隐藏添加用户的对话框
      this.addDialogVisible = false;
      // 重新获取用户列表数据
      this.gettableData();
    },
  },
};
</script>
