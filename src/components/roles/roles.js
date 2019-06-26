export default {
  data() {
    return {
      rolesList: [],
      editRoleVisible: false,
      editRoleForm: {
        id: -1,
        roleName: '',
        roleDesc: ''
      },
      formLabelWidth: '120px'
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const res = await this.$axios.get('/roles');
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.rolesList = data;
      }
    },
    delRole(role) {
      console.log(role);
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { id } = role;
          const res = await this.$axios.delete(`/roles/${id}`);
          const { meta } = res.data;
          if (meta.status === 200) {
            const index = this.rolesList.findIndex(v => v.id === id);
            this.rolesList.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
        .catch(() => {
          console.log('取消成功');
        });
    },
    editRoleDialogShow(role) {
      for (var key in this.editRoleForm) {
        this.editRoleForm[key] = role[key];
      }
      this.editRoleVisible = true;
    },
    async editRole() {
      const { id, roleName, roleDesc } = this.editRoleForm;
      const res = await this.$axios.put(`/roles/${id}`, {
        roleName,
        roleDesc
      });
      console.log(res);
      const { meta } = res.data;
      if (meta.status === 200) {
        this.getRolesList();
        this.editRoleVisible = false;
        this.$message({
          type: 'success',
          message: '修改成功'
        });
      }
    }
  }
};
