import { createRouter, createWebHashHistory } from "vue-router";
import Login from "./components/MyLogin.vue";
import Home from "./components/MyHome.vue";
import Users from "./components/users/Users.vue";
import Roles from "./components/power/Roles.vue";
import Welcome from "./components/Welcome.vue";
import Rights from "./components/power/Rights.vue";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",

      children: [
        { path: "/welcome", name: "首页", component: Welcome },
        {
          path: "/users",
          name: "用户",
          component: Users,
        },
        {
          path: "/roles",
          name: "角色列表",
          component: Roles,
          icon: "el-icon-lx-cascades",
        },
        {
          path: "/rights",
          name: "权限列表",
          component: Rights,
        },
      ],
    },
  ],
});

export default router;
