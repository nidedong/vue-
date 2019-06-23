<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb
      separator="/"
      class="breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="search"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button
          type="success"
          plain
        >添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      :data="userlist"
      stripe
      style="width: 100%"
    >

      <el-table-column
        prop="username"
        label="姓名"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="日期"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
      >
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="操作"
      >
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="100"
      :page-size="3"
      @next-click="fn"
    >
    </el-pagination>
  </div>

</template>

<script>
import axios from 'axios';

export default {
  created() {
    this.getUserList();
  },
  data() {
    return {
      userlist: [],
      username: '',
      search: ''
    };
  },
  methods: {
    // 获取所有用户数据
    getUserList() {
      axios
        .get('http://localhost:8888/api/private/v1/users', {
          params: {
            pagenum: 1,
            pagesize: 3
          },
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        .then(res => {
          console.log(res);
          const { data, meta } = res.data;
          if (meta.status === 200) {
            // 获取数据成功
            this.userlist = data.users;
          }
        });
    },
    fn(currentPage) {
      console.log(currentPage);
    }
  }
};
</script>

<style>
.breadcrumb {
  height: 40px;
  background-color: #d4dae0;
  line-height: 40px;
  padding-left: 10px;
  font-size: 16px;
}
</style>
