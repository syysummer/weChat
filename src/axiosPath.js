import Vue from 'vue';
import axios from 'axios';
Vue.prototype.$axios = axios;
import qs from 'qs';
Vue.prototype.$qs = qs;
import store from './store'
import {
  setCookie,
  getCookie,
  removeCookie
} from './utils/cookies'
import router from './router';

// axios 配置
axios.defaults.timeout = 8000;
// 生产环境
// axios.defaults.baseURL = "https://loong.ph/waimai/";
// uat环境
axios.defaults.baseURL = "https://uat.hzxindakeji.com/waimai/";
// 开发环境
// axios.defaults.baseURL = "https://dev.hzxindakeji.com/waimai/";
// 测试环境
axios.defaults.baseURL = "https://sit.hzxindakeji.com/waimai/";
// 王成涛
// axios.defaults.baseURL = "192.168.0.168:8080";
// 曹骏
// axios.defaults.baseURL = "http://cao.loong.ph:8080";
// 王萌
// axios.defaults.baseURL = "http://wangmeng.loong.ph:8080";

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true

// http request 拦截器
axios.interceptors.request.use(
  config => {
    store.state.is_loading = true;
    store.state.loading_img = true;
    let setTimeouts = null
    setTimeouts = setTimeout(() => {
      store.state.is_loading = false;
      clearTimeout(setTimeouts)
    }, 8000)
    if (router.app._route.fullPath.indexOf('/h5Activity') !== -1) store.state.has_loading = true;
    if (router.app._route.fullPath.indexOf('/home') !== -1) store.state.has_loading = true;
    if (router.app._route.fullPath.indexOf('/order') !== -1) store.state.has_loading = true;
    if (router.app._route.fullPath.indexOf('/order_details') !== -1) store.state.has_loading = true;
    // if (router.app._route.fullPath.indexOf('/business_shop') !== -1) store.state.shop_loading = true;
    if (router.app._route.fullPath.indexOf('/shop_comment') !== -1) store.state.shop_loading = true;
    if (router.app._route.fullPath.indexOf('/shop_aptitude') !== -1) store.state.shop_loading = true;

    localStorage.setItem('change_loading', store.state.is_loading);
    config.headers['Accept-Language'] = getCookie('lang');

    if (config.method == 'post') {
      config.data = qs.stringify(config.data)
    }


    return config;
  },
  error => {
    return Promise.reject(error);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    store.state.loading_img = false;
    if (response.data.code == 9999) {
      // 当返回的错误码为9999时,统一提示连接不稳定
      // let lang = getCookie('lang')
      // let message
      // if (lang == 'zh') {
      // 	message = '网络连接状态不稳定,请重试!'
      // } else {
      // 	message = 'Unstable Disconnected Network. Please try again!'
      // }
      if (response.request.responseURL.indexOf('getOpenId') == -1) {
        Vue.prototype.toast.warning(response.data.message)
      }
      // Vue.prototype.toast.warning(message);
      // response.data.message = message
    }
    if (response.data.code == 716) {
      Vue.prototype.toast.warning(response.data.message);
      sessionStorage.removeItem('orderAddress')
      setTimeout(() => {
        router.go(0)
      }, 500)
    }
    if (response.data.message == '接口异常' || response.data.message == 'Interface exception') {
      store.state.no_wify = true;
    } else {
      store.state.no_wify = false;
    }
    if (router.app._route.fullPath.indexOf('/business_shop') !== -1) {
      if (response.config.url.indexOf('/getSellerGoods') !== -1) {
        store.state.shop_loading = false;
      }
    } else {
      store.state.has_loading = false;
      store.state.is_loading = false;
      store.state.shop_loading = false;
    }

    return response;
  },
  error => {
    store.state.has_loading = false;
    store.state.is_loading = false;
    store.state.shop_loading = false;
    if (error.response) {
      let lang = getCookie("lang");
      if (error.response.status == 401) {

        // 未登录
      } else if (error.response.status == 410) {
        if (router.app._route.fullPath === '/home') return false
        if (router.app._route.fullPath.indexOf('/business_shop') != -1) return false
        if (router.app._route.fullPath.indexOf('/submit_order') != -1) return false
        if (router.app._route.fullPath.indexOf('/shop_detail') !== -1) return false
        if (router.app._route.fullPath.indexOf('/shop_search') !== -1) return false
        if (router.app._route.fullPath.indexOf('/shop_platform') !== -1) return false
        // if (router.app._route.fullPath.indexOf('/user') !== -1) return false
        localStorage.setItem('hasLog', 0)
        if (lang == 'zh') {
          Vue.prototype.toast.warning('您的账号在其他设备登录')
        } else if (lang == 'en') {
          Vue.prototype.toast.warning('Your account is logged in on other devices')
        }
        router.push('/login');
      } else {
        console.error(error.response.status);
      }
    } else {
      let setTimeoutItem = null
      if (lang == 'zh') {
        setTimeoutItem = setTimeout(() => {
          store.state.has_loading = false;
          store.state.is_loading = false;
          store.state.no_wify = true;
          clearTimeout(setTimeoutItem)
        }, error.config.timeout);
      } else if (lang == 'en') {
        setTimeoutItem = setTimeout(() => {
          store.state.has_loading = false;
          store.state.is_loading = false;
          store.state.no_wify = true;
          clearTimeout(setTimeoutItem);
        }, error.config.timeout);
      }
    }

    // return Promise.reject(error.response) // 返回接口返回的错误信息
  });

export default axios;
