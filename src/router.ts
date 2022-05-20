

import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "introduce" */ './page/index.vue'),
    name: 'home'
  },
  {
    path: '/two',
    component: () => import(/* webpackChunkName: "introduce" */ './page/cascader.vue'),
    name: 'cascader'
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});