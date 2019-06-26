import Vue from 'vue';
import Router from 'vue-router';

// 导入 Login 组件（注意，不要添加 .vue 后缀）
import Login from '@/components/login/Login';
import Home from '@/components/home/Home';
import User from '@/components/main/User';
import Rights from '@/components/rights/Rights';
import Roles from '@/components/roles/Roles.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [
        { path: 'user', component: User },
        { path: 'rights', component: Rights },
        { path: 'roles', component: Roles }
      ]
    }
  ]
});

// 导航卫士实现登陆拦截
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    // 如果token存在表明登陆过
    next();
  } else {
    if (to.fullPath === '/login') {
      next();
    } else {
      next('/login');
    }
  }
});

export default router;
