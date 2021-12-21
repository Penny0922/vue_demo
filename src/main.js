import { createApp } from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElIcons from "@element-plus/icons";
import "./assets/css/global.css";
axios.defaults.baseURL = "https://lianghj.top:8888/api/private/v1/";
axios.interceptors.request.use((config) => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // 在最后必须 return config
  return config;
});

// 创建 app 实例
const app = createApp(App);
for (const name in ElIcons) {
  app.component("ElIcon" + name, ElIcons[name]);
}
app.use(ElementPlus);
app.use(VueAxios, axios);
app.use(router);
app.use(store);

// 挂载 app 实例
app.mount("#app");
