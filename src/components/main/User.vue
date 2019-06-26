<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="searchData" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchUsers"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="addUserVisible = true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="userlist" stripe style="width: 100%">

      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="日期" width="180">
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row.id, scope.row.mg_state)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="role_name" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain @click="editUserShow(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="delUserById(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="changePage"
      :current-page="curPage">
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserVisible" width="40%">
      <el-form :model="addUserForm" :rules="addFormRules" ref="addUserForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="120px" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editUserVisible" width="40%">
      <el-form :model="editUserForm" :rules="editFormRules" ref="editUserForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="120px" prop="mobile">
          <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    return {
      userlist: [],
      username: '',
      searchData: '',
      pageSize: 3,
      total: 0,
      curPage: 1,
      addUserVisible: false,
      editUserVisible: false,
      editUserId: -1,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确手机号码' }
        ],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }]
      }
    };
  },
  methods: {
    // 获取所有用户数据
    getUserList() {
      this.$axios
        .get('/users', {
          params: {
            pagenum: this.curPage,
            pagesize: this.pageSize,
            query: this.searchData
          }
        })
        .then(res => {
          const { data, meta } = res.data;
          if (meta.status === 200) {
            // 获取数据成功
            this.userlist = data.users;
            this.total = data.total;
          }
        });
    },
    // 改变当前页
    changePage(curPage) {
      this.curPage = curPage;
      this.getUserList();
    },
    // 搜索功能
    searchUsers() {
      this.getUserList();
    },
    // 改变用户状态
    changeStatus(id, status) {
      this.$axios.put(`/users/${id}/state/${status}`).then(res => {
        const { meta } = res.data;
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 1000
          });
        }
      });
    },
    // 添加用户
    addUser() {
      this.$refs.addUserForm.validate(valid => {
        if (valid) {
          this.$axios.post('/users', this.addUserForm).then(res => {
            const { meta } = res.data;
            if (meta.status === 201) {
              this.addUserVisible = false;
              this.$refs.addUserForm.resetFields();
              this.curPage = 1;
              this.getUserList();
            }
          });
        }
      });
    },
    // 删除用户
    delUserById(id) {
      this.$axios.delete(`/users/${id}`).then(res => {
        console.log(res);
        const { meta } = res.data;
        if (meta.status === 200) {
          // let index = this.userlist.findIndex(v => v.id === id);
          // this.userlist.splice(index, 1);
          this.curPage = 1;
          this.getUserList();
          this.$message({
            type: 'success',
            message: meta.msg
          });
        }
      });
    },
    // 显示编辑对话框
    editUserShow(id) {
      this.editUserId = id;
      const index = this.userlist.findIndex(v => v.id === id);
      for (var key in this.editUserForm) {
        this.editUserForm[key] = this.userlist[index][key];
      }
      this.editUserVisible = true;
    },
    // 编辑用户信息
    eidtUser() {
      this.$refs.editUserForm.validate(async valid => {
        if (valid) {
          const res = await this.$axios.put(`/users/${this.editUserId}`);
          const { meta } = res.data;
          if (meta.status === 200) {
            this.$message({
              type: 'success',
              message: meta.msg
            });
            this.editUserVisible = false;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.breadcrumb {
  height: 40px;
  background-color: #d4dae0;
  line-height: 40px;
  padding-left: 10px;
  font-size: 16px;
}
</style>
