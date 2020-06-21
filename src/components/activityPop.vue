<template>
  <div v-if="show" class="activityPop">
    <div class="mask">
    </div>
    <div class="pop" @click="showFun">
      <div class="img-box">
        <span @click="showFun"><img src="../assets/icons/icon_close_pops.png" alt=""></span>
        <img v-if="imgUrl==='en'" src="../assets/images/red_bags_en.gif" alt="">
        <img v-else src="../assets/images/red_bags.gif" alt="">
        <div v-if="isLogin===0" class="link-btn">
          <router-link to="/login">
            <img v-if="imgUrl==='en'" src="../assets/images/bags_btn_en.gif" alt="">
            <img v-else src="../assets/images/bags_btn.gif" alt="">
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCookie } from '../utils/cookies.js'
export default {
  name: 'activityPop',
  data() {
    return {
      imgUrl: 'zh',
      show: true,
      isLogin: false
    }
  },
  beforeCreate() {},
  mounted() {
    let lang = getCookie('lang')
    switch (lang) {
      case 'zh':
        this.imgUrl = 'zh'
        break
      case 'en':
        this.imgUrl = 'en'
        break
      default:
        this.imgUrl = 'en'
        break
    }
    let isSHow = sessionStorage.getItem('activity')
    this.isLogin = parseInt(localStorage.getItem('hasLog'))
    // console.log(this.isLogin, '=========')
    if (isSHow) {
      this.show = false
    } else {
      this.show = true
      // if (this.isLogin) {
      //   this.show = true
      // } else {
      //   this.show = false
      // }
    }
  },
  methods: {
    showFun() {
      this.show = false
      sessionStorage.setItem('activity', true)
    }
  }
}
</script>
<style scoped>
.mask {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  opacity: 0.5;
  background: #000;
  overflow: hidden;
  z-index: 99996;
}
.pop {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 99997;
  overflow: hidden;
}
.img-box {
  position: relative;
  width: 80%;
  padding-top: 28%;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
}
.link-btn {
  position: absolute;
  width: 50%;
  bottom: 10%;
  margin-left: 25%;
}
.img-box span {
  position: absolute;
  width: 25px;
  height: 25px;
  top: 50px;
  right: 30px;
  z-index: 99997;
  color: #fff;
}
.img-box img {
  display: inline-block;
  width: 100%;
}
</style>
