<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="rights-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 权限列表 -->
    <el-table :data="rightsList" style="width: 100%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180">
      </el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-if="scope.row.level == 2">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const res = await this.$axios.get('/rights/list');
      console.log(res);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.rightsList = data;
      }
    }
  }
};
</script>

<style>
.rights-breadcrumb {
  height: 40px;
  background-color: #d4dae0;
  line-height: 40px;
  padding-left: 10px;
  font-size: 16px;
}
</style>
