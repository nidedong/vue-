<template>
  <el-row
    type="flex"
    class="row-bg login-wrapper"
    justify="center"
    align="middle"
  >
    <el-col
      :xs="10"
      :sm="10"
      :md="10"
      :lg="7"
      :xl="7"
      class="login-content"
      min-width="320px"
    >
      <div>
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          class="demo-loginForm"
          label-position="top"
        >
          <el-form-item
            label="用户名"
            prop="username"
          >
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
          >
            <el-input
              type="password"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm()"
            >登陆</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }]
      }
    };
  },
  methods: {
    login() {
      axios
        .post('http://localhost:8888/api/private/v1/login', this.loginForm)
        .then(res => {
          console.log(res);
          let { data, meta } = res.data;
          if (meta.status === 200) {
            // 登陆成功跳转到首页,将token存储到localstorage中
            localStorage.setItem('token', data.token);
            this.$router.push('/home');
          } else {
            // 登陆失败
            this.$message.error('账号或者密码错误');
          }
        });
    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 发送请求校验账号密码
          this.login();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    }
  }
};
</script>

<style>
.login-wrapper {
  height: 100%;
  width: 100%;
  background-color: #2d434c;
}
.login-content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
}
</style>
