import { RouteRecordRaw } from "vue-router";
import PhotoBedView from "@/views/PhotoBedView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "图床",
    component: PhotoBedView,
  },
  {
    path: "/byr",
    name: "北邮人论坛",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/BYRView.vue"),
  },
  {
    path: "/other",
    name: "其他",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];
