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
      <el-row :gutter="24">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="gettableData"
            ref="input"
          >
            <template #append>
              <el-button @click="search">
                <el-icon><search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-col>

        <el-col :span="8">
          <!-- 日期选择 -->
          <el-date-picker
            v-model="queryInfo.query"
            type="date"
            placeholder="Pick a day"
            value-format="YYYY年MM月D日"
          >
          </el-date-picker>
          <el-button type="primary" @click="search"> 搜索 </el-button>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
    </div>

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      height="500"
      stripe
      style="width: 100%"
      :span-method="arrSpanMethod"
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
      <el-table-column label="创建时间">{{ timestampToTime }}</el-table-column>
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
            icon="el-icon-edit"
          >
          </el-button>
          <!-- 删除按钮 -->
          <el-button
            size="mini"
            @click="removeUserById(scope.row.id)"
            icon="el-icon-delete"
          >
          </el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              size="mini"
              @click="setRole(scope.row)"
              icon="el-icon-setting"
            >
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-button type="primary" @click="exportExcel(this.tableData)"
      >导出当前页</el-button
    >
    <el-button type="primary" @click="exportExcel(this.allData)"
      >导出全部</el-button
    >
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
  <!-- 分配角色的对话框 -->
  <el-dialog
    title="分配角色"
    v-model="setRoleDialogVisible"
    width="50%"
    @close="setRoleDialogClosed"
  >
    <div>
      <p>当前的用户：{{ userInfo.username }}</p>
      <p>当前的角色：{{ userInfo.role_name }}</p>
      <p>
        分配新角色：
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
    </div>
    <span class="dialog-footer">
      <el-button @click="setRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      merge: [],
      pos: "",
      // 表格数据
      tableData: [],
      allData: [],
      showdata: false,
      total: 0,
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 4,
      },
      allInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: "",
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

      // 控制修改用户对话框的显示与隐藏

      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      setRoleDialogVisible: false,
    };
  },

  /* created() {
    this.gettableData();
  }, */

  created() {
    this.gettableData();
  },
  methods: {
    // eslint-disable-next-line no-irregular-whitespace
    //导出数据excel
    exportExcel(tabledata) {
      var that = this;
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../assets/js/Export2Excel"); //这里必须使用绝对路径
        const tHeader = ["姓名", "邮箱", "角色"]; // 导出的表头名信息
        const filterVal = ["username", "email", "role_name"]; // 导出的表头字段名，需要导出表格字段名
        const list = tabledata;
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "下载数据excel"); // 导出的表格名称，根据需要自己命名
      });
    },
    //格式转换，直接复制即可
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    //模糊查找
    async search() {
      //定义的新数组存放筛选之后的数据
      this.list = [];
      console.log(this.queryInfo.query);

      console.log(this.tableData);
      //循环模拟数据的数组
      await this.tableData.map((msg) => {
        //拿当前json的id、name、time去分别跟输入的值进行比较
        //indexOf 如果在检索的字符串中没有出现要找的值是会返回-1的，所以我们这里不等于-1就是假设输入框的值在当前json里面找到的情况

        if (
          msg.email.indexOf(this.queryInfo.query) != -1 ||
          msg.username.indexOf(this.queryInfo.query) != -1
        ) {
          //然后把当前json添加到list数组中
          this.list.push(msg);
        }
      });
      console.log(this.list);
      this.tableData = this.list;
    },

    //排序
    getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.merge.push(1);
          this.pos = 0;
        } else {
          if (data[i].email === data[i - 1].email) {
            this.merge[this.pos] += 1;
            this.merge.push(0);
            console.log(data[i].email);
          } else {
            this.merge.push(1);
            this.pos = i;
          }
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    arrSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        const _row = this.merge[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    // 获取所有的成员列表
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
      console.log("当前页数据", this.tableData);
      this.merge = [];
      this.pos = "";
      this.getSpanArr(this.tableData);
      this.allInfo.pagesize = this.total;
      const { data: response } = await this.axios.get("users", {
        params: this.allInfo,
      });
      this.allData = response.data.users;
      console.log("全部数据", this.allData);
    },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;

      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }

      this.rolesList = res.data;

      this.setRoleDialogVisible = true;
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色！");
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("更新角色失败！");
      }

      this.$message.success("更新角色成功！");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = {};
    },
    /* .then(function (res) {
          console.log(res.data.data.users);

          this.warehouseNamesetdates(res.data.data.users);
        }); */
    //页码切换
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.gettableData();
    },
    //添加用户
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
    //删除用户
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

      const { data: res } = await this.axios.delete("users/" + id);

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
      });
      return a;
    },
  },
};
</script>
<style lang="less" scoped></style>
