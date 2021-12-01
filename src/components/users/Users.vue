<template>
  <!-- 面包屑区域 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <!-- 搜索与添加区域 -->

    <div class="handle-box">
      <el-input
        placeholder="请输入内容"
        v-model="queryInfo.query"
        clearable
        @clear="gettableData"
      />
      <el-button type="primary" @click="gettableData"> 搜索 </el-button>
      <el-button type="primary" @click="addDialogVisible = true"
        >添加用户</el-button
      >
    </div>

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'create_time', order: 'descending' }"
      height="500"
      stripe
      style="width: 100%"
      v-loading="pictLoading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      element-loading-text="正在加载中"
      :header-cell-style="{ background: '#eef1f6' }"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="创建时间" sortable>{{
        timestampToTime
      }}</el-table-column>
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
    <el-form :model="addForm" label-width="70px">
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

  <!-- 修改用户的对话框 -->
  <el-dialog
    title="修改用户"
    v-model="editDialogVisible"
    width="50%"
    @close="editDialogClosed"
  >
    <el-form
      :model="editForm"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="70px"
    >
      <el-form-item label="用户名">
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUserInfo">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
//import { timestampToTime } from "../../common/date.ts";
import { Delete, Edit, Setting } from "@element-plus/icons";
export default {
  components: {
    Delete,
    Edit,
    Setting,

    //注册图标组件名称
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      total: 0,
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10,
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
      // 控制修改用户对话框的显示与隐藏

      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
    };
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
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.axios.get("users/" + id);

      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }

      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起修改用户信息的数据请求
        const { data: res } = await this.axios.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败！");
        }

        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.gettableData();
        // 提示修改成功
        this.$message.success("更新用户信息成功！");
      });
    },
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.delete("users/" + id);

      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败！");
      }

      this.$message.success("删除用户成功！");
      this.gettableData();
    },
  },

  computed: {
    //时间戳转换
    timestampToTime() {
      let a = "";
      this.tableData.forEach((x) => {
        //时间戳转换
        var date = new Date(x.create_time * 1000);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        let d = date.getDate();
        a = y + "年" + MM + "月" + d + "日";
        console.log(a);
      });
      return a;
    },
  },
};
</script>
<style lang="less" scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
</style>
