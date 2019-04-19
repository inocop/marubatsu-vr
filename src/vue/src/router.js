import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/marubatsu_2d/:id",
      name: "marubatsu_2d",
      meta: { layout: 'none'},
      component: () =>
        import(/* webpackChunkName: "marubatsu_2d" */ "./views/MaruBatsu2D.vue"),
      props: route => ({id: Number(route.params.id)}),
    },
    {
      path: "/marubatsu_vr",
      name: "marubatsu_vr",
      meta: { layout: 'none'},
      component: () =>
        import(/* webpackChunkName: "marubatsu_vr" */ "./views/MaruBatsuVR.vue")
    },
    {
      path: '*',
      redirect: '/'
    },
  ]
});
