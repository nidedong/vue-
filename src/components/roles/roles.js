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
      formLabelWidth: '120px',
      assignRightShow: false,
      rightsTreeList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      assignId: -1
    };
  },
  created() {
    this.getRolesList();
    this.getRightsTree();
  },
  methods: {
    // 获取权限树形结构
    async getRightsTree() {
      const res = await this.$axios.get('/rights/tree');
      console.log(res);
      this.rightsTreeList = res.data.data;
    },
    // 获取所有角色数据
    async getRolesList() {
      const res = await this.$axios.get('/roles');
      const { data, meta } = res.data;
      console.log(res);
      if (meta.status === 200) {
        this.rolesList = data;
      }
    },
    // 根据id删除角色
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
    // 显示编辑角色对话框
    editRoleDialogShow(role) {
      for (var key in this.editRoleForm) {
        this.editRoleForm[key] = role[key];
      }
      this.editRoleVisible = true;
    },
    // 根据id编辑角色
    async editRole() {
      const { id, roleName, roleDesc } = this.editRoleForm;
      const res = await this.$axios.put(`/roles/${id}`, {
        roleName,
        roleDesc
      });
      const { meta } = res.data;
      if (meta.status === 200) {
        this.getRolesList();
        this.editRoleVisible = false;
        this.$message({
          type: 'success',
          message: '修改成功'
        });
      }
    },
    // 删除角色权限
    async delRoleRight(roleId, rightId) {
      const res = await this.$axios.delete(
        `/roles/${roleId}/rights/${rightId}`
      );
      const { data, meta } = res.data;
      if (meta.status === 200) {
        const curRole = this.rolesList.find(v => v.id === roleId);
        curRole.children = data;
        this.$message({
          type: 'success',
          message: meta.msg
        });
      }
    },
    // 显示分配权限对话框
    assignDialog(role) {
      this.assignId = role.id;
      this.assignRightShow = true;
      const checkArr = [];
      role.children.forEach(v => {
        v.children.forEach(v => {
          v.children.forEach(v => {
            checkArr.push(v.id);
          });
        });
      });
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(checkArr);
      });
    },
    // 根据选中权限给角色分配权限
    async assignRights() {
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      const allKeys = [...checkedKeys, ...halfCheckedKeys];
      const res = await this.$axios.post(`/roles/${this.assignId}/rights`, {
        rids: allKeys.join(',')
      });
      const { meta } = res.data;
      if (meta.status === 200) {
        this.assignRightShow = false;
        this.$message({
          type: 'success',
          message: '分配权限成功'
        });
        this.getRolesList();
      }
    }
  }
};
