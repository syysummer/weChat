<template>
	<div class="login">
		<div class="header">
			<div class="back" @click="back">
				<img src="../../assets/icons/icon_arrows_left@2x.png" alt="">
			</div>
			<div class="title">
				{{login_index.verify_phone}}
			</div>
		</div>
		<div class="login_content">
			<div class="login_style">
				<div class="user_login" v-if="loginType==2">
					<div class="areacode" @click="setCode">
						<img src="../../assets/icons/goto@2x.png" alt="">
						<div>{{login_index.pm_belong}}</div>
						<div>+{{areaCodes}}</div>
					</div>
					<div class="password">
						<input type="number" v-model="tel" :placeholder="login_index.tel_err" />
						<div class="img_code" @click="checkImg" v-if="!disabled">
							<div v-if="!isSecond">{{login_index.verify}}</div>
							<div v-else>{{$t('registered.popup_box.verify_code_again')}}</div>
						</div>
						<div class="send_code" v-if="showLoading">
							<div><img src="../../assets/icons/is_loading.gif" alt=""></div>
						</div>
						<div class="send_code" v-if="!showLoading && disabled">
							<div>{{limitTime}}s {{$t('sms_login.resend')}}</div>
						</div>
					</div>
					<div class="mCode">
						<input type="text" v-model="mCode" :placeholder="login_index.verify_err">
					</div>
					<send-message ref="sendMessage" @selfEvent="getTiemOut" :mobile="tel" :globalCode="areaCodes" :messageCode="messageCode" @close="closeModel" />
				</div>
			</div>
			<div class="agreement" v-if="loginType==2" @click="goAgreements">
				<span>{{$t('pw_login.prompt_pw')}}</span>
				<!-- <router-link to="/service_agreement">{{login_index.user_server}}</router-link> -->
				<router-link :to="{ path: '/service_agreement',query:{from_path: this.$route.from_path}}">
					{{login_index.user_server}}
				</router-link>
			</div>
			<div class="login_btn" @touchstart="goLogin">
				<!-- <div class="login_btn"> -->
				<div class="btn_login">{{$t('login_index.title')}}</div>
			</div>
		</div>
	</div>
</template>
<script>
import publicHeader from '../../components/public_header'
import sendMessage from '../../components/send-message'
// import phonePlugin from "@/components/phone_area_plugin.vue"
import store from '../../store'
import axios from 'axios'
export default {
  name: 'login',
  data() {
    return {
      loginType: 2,
      username: '',
      tel: '',
      password: '',
      vCode: '',
      mCode: '',
      areaCode: '63',
      areaCodes: '63',
      clientType: '2',
      messageCode: 1,
      codeImg: '',
      maskShow: false,
      limitTime: 0,
      timeId: '',
      inputShow: false,
      disabled: false,
      openPass: true,
      fromRoute: '',
      id: '',
      userNum: '',
      userNamesNum: '',
      timeoutDate: '',
      isSecond: false,
      showLoading: false,
      backend: 5
    }
  },
  components: { publicHeader, sendMessage },
  created() {
    if (this.$route.query.path == 'cart') {
      this.fromRoute = 'cart'
    }
    this.id = localStorage.getItem('id')
    sessionStorage.setItem('login_type', 2)
    this.loginType = sessionStorage.getItem('login_type')
    this.getImgcode()
    // alert(1111111)
    if (!sessionStorage.getItem('area_code')) {
      sessionStorage.setItem('area_code', '63')
    }
  },
  computed: {
    login_index() {
      let login_index = this.$t('login_index')
      return login_index
    }
  },
  mounted() {
    // 测试倒计时

    // var num = 60;
    // var t1 = parseInt(new Date().getTime() / 1000);
    // let btn_countDown = setInterval(() => {
    //   var t2 = parseInt(new Date().getTime() / 1000);
    //   var t_time = t2 - t1;
    //   if (t_time <= num) {
    //     this.backend = num - t_time
    //     return this.backend
    //   } else {
    //     clearInterval(btn_countDown);
    //   }
    // }, 1000);
    //end
    let username = sessionStorage.getItem('username')
    if (username) {
      this.username = username
    }
    let tel = sessionStorage.getItem('userTel')
    if (tel) {
      this.tel = tel
    }
    let code = sessionStorage.getItem('area_codes')
    if (code) {
      this.areaCodes = code
    } else {
      this.areaCodes = 63
    }
    let namePa = sessionStorage.getItem('namePa')
    if (namePa) {
      this.password = namePa
    }
    let namemCode = sessionStorage.getItem('namemCode')
    if (namemCode) {
      this.mCode = namemCode
    }
    let areaCodes = sessionStorage.getItem('area_code')
    if (areaCodes) {
      this.areaCode = JSON.parse(areaCodes)
      if (this.loginType == 2) {
        this.areaCodes = areaCodes
        sessionStorage.setItem('area_codes', this.areaCodes)
      }
    } else {
      this.areaCode = 63
    }
    let userNum = /^\d{3,14}$/
    let user = /^[a-zA-Z]{1}[0-9A-Za-z]{4,16}/
    this.userNamesNum = user
    this.userNum = userNum
    // 保留倒计时
    let timeNow = sessionStorage.getItem('timeNow')
    if (timeNow) {
      let times = parseInt(timeNow) + 60
      let nowTimeout = parseInt(new Date() / 1000)
      this.timeoutDate = parseInt(times - nowTimeout)
      if (this.timeoutDate > 0) {
        this.disabled = true
        this.areaCodes = sessionStorage.getItem('area_codes')
        this.limitTime = this.timeoutDate % 60
        this.timeId = setInterval(() => {
          this.limitTime--
          if (this.limitTime == 0) {
            console.log('----dao---shi ')
            this.disabled = false
            clearInterval(this.timeId)
          }
        }, 1000)
      } else {
        this.disabled = false
        clearInterval(this.timeId)
        sessionStorage.removeItem('timeNow')
        sessionStorage.removeItem('userTel')
        sessionStorage.removeItem('area_codes')
      }
    }
  },
  watch: {
    username(newValue, oldValue) {
      let userNum = /^\d{3,14}$/
      if (userNum.test(newValue)) {
        this.inputShow = true
      } else {
        this.inputShow = false
      }
    }
  },
  methods: {
    getImgcode() {
      let vCodeId = sessionStorage.getItem('vCodeId')
      store
        .dispatch('getCode', {
          clientType: this.clientType,
          vCodeId: vCodeId
        })
        .then(res => {
          let codeImg = res
          this.codeImg = codeImg
        })
        .catch(error => {
          console.log(error)
        })
    },
    switchImg() {
      this.getImgcode()
    },
    back() {
      if (this.$route.query.from_path) {
        if (this.$route.query.from_path == 'living_payment') {
          this.$router.push({
            path: '/home'
          })
        } else if (this.$route.query.from_path == 'living_list') {
          this.$router.push({
            path: '/living_payment'
          })
        } else {
          this.$router.push({
            path: this.$route.query.from_path
          })
        }
      } else if (this.$route.query.pathName == 'account') {
        this.$router.push('/user')
      } else if (this.$route.query.id) {
        this.$router.push(
          `business_shop?id=${this.$route.query.id}&pathName=home`
        )
      } else {
        this.$router.go(-1)
      }
      sessionStorage.removeItem('area_code')
      sessionStorage.removeItem('username')
      sessionStorage.removeItem('namePa')
      sessionStorage.removeItem('namemCode')
    },
    showArea(username) {
      sessionStorage.setItem('username', username)
    },
    setCode() {
      let type = this.loginType
      sessionStorage.setItem('login_type', type)
      this.$router.push('/phone_area')
      sessionStorage.setItem('namePa', this.password)
      sessionStorage.setItem('namemCode', this.mCode)
      sessionStorage.setItem('userTel', this.tel)
    },
    changeType() {
      this.openPass = !this.openPass
    },
    checkImg() {
      let self = this
      sessionStorage.setItem('userTel', this.tel)
      let vCodeId = sessionStorage.getItem('vCodeId')
      if (!self.tel) {
        let telErrors = self.$t('registered.tel_err')
        self.toast.error(telErrors)
        return
      } else if (!self.userNum.test(self.tel)) {
        let txt = self.$t('login_index.tel_right')
        self.toast.warning(txt)
        return
      }
      self.showLoading = true
      store
        .dispatch('checkImgApi', {
          clientType: self.clientType,
          globalCode: self.areaCode,
          mobile: self.tel,
          module: 1
        })
        .then(res => {
          console.log('1111111111', res)
          if (res.data.code === 1) {
            self.imgCodeShow = res.data.data
            if (self.imgCodeShow == 'true') {
              self.openModel()
              self.showLoading = false
            } else {
              store
                .dispatch('phoneCodeApi', {
                  clientType: self.clientType,
                  globalCode: self.areaCode,
                  mobile: self.tel,
                  module: 1,
                  vCodeId: vCodeId
                })
                .then(res => {
                  console.log(res)
                  if (res.data.code === 1) {
                    self.disabled = true
                    self.showLoading = false
                    self.toast.success(res.data.message)
                    this.isSecond = true
                    self.getTiemOut()
                  } else {
                    self.showLoading = false
                    self.toast.error(res.data.message)
                  }
                })
                .catch(error => {
                  self.showLoading = false
                  console.log(error)
                })
            }
          } else {
            self.showLoading = false
            self.toast.error(res.data.message)
          }
        })
        .catch(error => {
          self.showLoading = false
          console.log(error)
        })
    },
    openModel() {
      if (!this.disabled) {
        this.$refs.sendMessage.open()
        this.$emit('open')
      }
    },
    // 倒计时
    getTiemOut() {
      // if (!this.$refs.inputVal.value || this.disabled) return
      let timeoutDate = parseInt(new Date() / 1000)
      sessionStorage.setItem('timeNow', timeoutDate)
      console.log('555', this.disabled)
      this.limitTime = 60
      let num = 60
      clearInterval(this.timeId)
      // this.setMsgStatus(true)
      this.disabled = true
      if (this.disabled) {
        let t1 = parseInt(new Date().getTime() / 1000)
        this.timeId = setInterval(() => {
          let t2 = parseInt(new Date().getTime() / 1000)
          this.limitTime = num - (t2 - t1)
          console.log('----dao---shi ')
          if (this.limitTime <= 0) {
            console.log('----dao---shi ')
            this.disabled = false
            this.limitTime = 60
            clearInterval(this.timeId)
          }
        }, 1000)
      }
    },
    closeModel() {
      this.maskShow = false
    },
    goRegister() {
      sessionStorage.setItem('userTel', this.tel)
      this.$router.push('/register')
      sessionStorage.removeItem('area_code')
      sessionStorage.removeItem('username')
      sessionStorage.removeItem('namePa')
      sessionStorage.removeItem('namemCode')
    },
    goLogin() {
      let num = /^[0-9]\d*$/
      let userPass = /^[0-9A-Za-z]{6,14}/
      let vCodeId = sessionStorage.getItem('vCodeId')
      if (this.loginType == 1) {
        if (!this.username) {
          let txt = this.$t('login_index.text')
          this.toast.warning(txt)
          return
        }
        if (!this.password) {
          let txt = this.$t('registered.set_pw_holder')
          this.toast.warning(txt)
          return
        } else if (!userPass.test(this.password)) {
          let txt = this.$t('registered.text_pass')
          this.toast.error(txt)
          return
        } else if (!this.vCode) {
          let txt = this.$t('login_index.verify_err')
          this.toast.warning(txt)
          return
        } else if (num.test(this.username)) {
          if (!this.userNum.test(this.username)) {
            let txt = this.$t('login_index.tel_right')
            this.toast.warning(txt)
            return
          }
        } else {
          if (this.userNamesNum.test(this.username)) {
            this.areaCode = ''
          }
          if (!this.userNamesNum.test(this.username)) {
            let txt = this.$t('login_index.user_right')
            this.toast.warning(txt)
            return
          }
        }
      } else {
        if (!this.tel) {
          let txt = this.$t('login_index.text')
          this.toast.warning(txt)
          return
        }
        if (!this.mCode) {
          let txt = this.$t('login_index.verify_err')
          this.toast.warning(txt)
          return
        } else if (!this.userNum.test(this.tel)) {
          let txt = this.$t('login_index.tel_right')
          this.toast.warning(txt)
          return
        }
      }
      let params = {
        loginType: this.loginType,
        clientType: this.clientType,
        globalCode: this.areaCode,
        password: this.password,
        vCode: this.vCode,
        mCode: this.mCode,
        vCodeId: vCodeId,
        authorizeToken: sessionStorage.getItem('openId'),
        flag: sessionStorage.getItem('flag')
      }
      if (this.loginType == 1) {
        params.userName = this.username
      } else {
        params.userName = this.tel
      }
      store
        .dispatch('loginApi', params)
        .then(res => {
          console.log(res)
          if (res.data.code === 1) {
            clearInterval(this.timeId)
            this.timeId = null
            sessionStorage.removeItem('timeNow')
            this.timeoutDate = 0
            let userInformation = JSON.stringify(res.data.data.userObj)
            localStorage.setItem('userInformation', userInformation)
            this.toast.success(res.data.message)
            sessionStorage.setItem('hasLog', 1)
            localStorage.setItem('hasLog', 1)
            store.state.is_login = res.data.code == 1 && true
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('area_code')
            sessionStorage.removeItem('area_codes')
            sessionStorage.removeItem('login_type')
            sessionStorage.removeItem('namePa')
            sessionStorage.removeItem('userTel')
            sessionStorage.removeItem('namemCode')
            // store.state.userInfo.phoneArea = '63'
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            userInfo.phoneArea = '63'
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
            if (this.fromRoute == 'cart') {
              console.log(1111)
              this.batchAddGoodsCart()
            } else {
              if (this.$route.query.from_path == 'living_list') {
                this.$router.push({
                  path: '/living_payment'
                })
              } else if (this.$route.query.from_path) {
                this.$router.push({
                  path: this.$route.query.from_path
                })
              } else {
                this.$router.push('/user')
              }
            }
          } else {
            this.toast.error(res.data.message)
            this.getImgcode()
          }
        })
        .catch(error => {
          console.error(error)
          this.getImgcode()
        })
    },
    goForget() {
      sessionStorage.setItem('userTel', this.tel)
      this.$router.push('/forget')
      sessionStorage.removeItem('area_code')
      // sessionStorage.removeItem("username");
      sessionStorage.removeItem('namePa')
      sessionStorage.removeItem('namemCode')
    },
    goAgreement() {
      // this.$router.push("/service_agreement");
      sessionStorage.setItem('namePa', this.password)
      sessionStorage.setItem('namemCode', this.mCode)
      sessionStorage.setItem('username', this.username)
    },
    goAgreements() {
      sessionStorage.setItem('userTel', this.tel)
      sessionStorage.setItem('namePa', this.password)
      sessionStorage.setItem('namemCode', this.mCode)
    },
    // 购物车批量导入
    batchAddGoodsCart() {
      let data = localStorage.getItem('orderData')

      store
        .dispatch('batchAddGoodsCart', { goodsCart: data, platform: 3 })
        .then(res => {
          console.log('购物车信息', res.data)
          let data = res.data
          if (res.data.code == 1) {
            this.$router.push('/submit_order?id=' + this.id)
            // localStorage.setItem("cartList", JSON.stringify([]));
            Object.assign(store.state.batchAddGoodsCart, data)
          } else {
            this.toast.error(res.data.message)
          }
        })
        .catch(err => {
          // this.loginStatus = err.status;
          // console.error("err:", this.loginStatus);
        })
    }
  }
}
</script>
<style scoped lang="scss">
.login {
  height: 100%;
  .header {
    text-align: center;
    padding: 15px;
    background: #fff;
    position: relative;
    border-bottom: 1px solid #dddddd;
    .back {
      width: 12px;
      float: left;
      margin-top: 2px;
      img {
        width: 100%;
      }
    }
    .title {
      font-size: 20px;
      color: #666; // display: inline-block;
    }
    .right {
      // float: right;
      color: #666;
      font-size: 20px;
      position: absolute;
      top: 15px;
      right: 12px;
    }
  }
  .login_content {
    // height: 60%;
    // overflow-y: auto;
  }
  .user_message {
    div {
      color: #666;
      width: 100%;
      height: 46px;
      line-height: 46px;
      display: inline-block;
      text-align: center;
      span {
        display: inline-block;
        padding: 0 0.6rem;
        &:first-child {
          padding: 0 1rem;
        }
      }
    }
  }
  .login_style {
    background: #fff;
    padding-top: 3px;
    .areacode {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      border-bottom: 1px solid #ededed;
      position: relative;
      img {
        width: 13px;
        position: absolute;
        top: 13px;
        right: 16px;
      }
      div {
        &:last-child {
          float: right;
          padding-right: 15px;
        }
        display: inline-block;
        color: #666;
      }
    }
    input {
      font-size: 16px;
      height: 30px;
      line-height: 30px;
      width: 100%;
      outline: none;
      border: none;
      display: block;
      padding: 20px;
      border-bottom: 1px solid #ededed;
    }
    .password {
      position: relative;
      .img {
        img {
          width: 25px;
          position: absolute;
          top: 9px;
          right: 15px;
        }
      }
      .img_code {
        width: 85px;
        height: 29px;
        line-height: 29px;
        text-align: center;
        position: absolute;
        top: 8px;
        right: 15px;
        background: url('../../assets/images/button01@2x.png') no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        div {
          font-size: 13px;
          color: #ff644c;
        }
      }
      .send_code {
        width: 95px;
        height: 29px;
        line-height: 29px;
        text-align: center;
        position: absolute;
        top: 8px;
        right: 15px;
        background: #b1afaf;
        border: 1px solid #333;
        div {
          width: 100%;
          font-size: 12px; // color: #ff644c;
          img {
            width: 20px;
            margin-bottom: -4px;
          }
        }
      }
    }
    .vCode {
      position: relative;
      .right_img {
        img {
          width: 20px;
          position: absolute;
          top: 10px;
          right: 3rem;
        }
      }
      .code_img {
        width: 80px;
        position: absolute;
        top: 2px;
        right: 12px;
        img {
          width: 100%;
        }
      }
    }
    .mCode {
      position: relative;
      .right_img {
        img {
          width: 20px;
          position: absolute;
          top: 10px;
          right: 0.5rem;
        }
      }
    }
  }
  .agreement {
    margin: 15px 20px;
    text-align: center;
    span {
      font-size: 12px;
      color: #999;
    }
    a {
      font-size: 12px;
      color: #4a90e2;
    }
  }
  .login_btn {
    margin-top: 2rem;
    div {
      border: none;
      background: #ff644c;
      color: #fff;
      margin: 10px 20px;
      padding: 10px;
      font-size: 18px;
      border-radius: 4px;
      width: 90%;
      text-align: center;
    }
  }
  .forget {
    float: right;
    margin-right: 20px;
    color: #999;
  }
}

@media screen and (max-width: 329px) {
  .login {
    .login_style {
      .vCode {
        .right_img {
          img {
            right: 3.5rem;
          }
        }
      }
    }
    .login_btn input {
      width: 88%;
    }
  }
}
</style>
