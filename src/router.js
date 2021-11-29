import { createRouter, createWebHashHistory } from 'vue-router'
import Login from './components/MyLogin.vue'
import Home from './components/MyHome.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/users/Users.vue'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
      {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children:
          [{ path: '/welcome', component: Welcome },
          { path: '/users', component: Users }
          
          
        ]
        },
    ],
})
  
export default router