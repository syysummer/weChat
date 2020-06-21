<template>
  <div class="set_payment">
    <div class="header">
      <publicHeader :title="hasPass ? change_pw.edit_pay_pw : change_pw.set_pw"></publicHeader>
    </div>
    <div class="content">
      <div class="setting">
        <div class="tel_vCode">
          <div>{{tel}}</div>
          <div class="vCode" @click="getCode" v-if="!payDisable && !paySecond && !is_loading">{{$t('login_index.verify')}}</div>
          <div class="vCode" v-if="is_loading">
            <div><img src="../../../assets/icons/is_loading.gif" alt=""></div>
          </div>
          <div class="vCode" @click="getCode" v-if="!payDisable && paySecond">{{$t('registered.popup_box.verify_code_again')}}</div>
          <div class="send_code" v-if="payDisable">{{limitTime}}s{{$t('sms_login.resend')}}</div>
        </div>
        <div class="vCode_input">
          <input type="text" v-model="vCode" :placeholder="$t('login_index.verify_code')">
        </div>
        <!-- <div class="old_pass" v-if="hasPass">
					<input type="password" v-model="oldPass" :placeholder="change_pw.old_pay_pw">
				</div> -->
        <div class="password">
          <input type="password" v-model="password" :placeholder="change_pw.login_pw" />
        </div>
        <div class="new_pass">
          <input type="password" v-model="prePass" :placeholder="change_pw.re_login_pw" />
        </div>
        <!-- <div class="new_pass" v-if="hasPass">
					<input type="password" v-model="password" :placeholder="change_pw.new_pay_pw" />
				</div>
				<div class="new_pass" v-if="hasPass">
					<input type="password" v-model="prePass" :placeholder="change_pw.re_login_pw" />
				</div> -->
      </div>
      <div class="submit" @click="submit">
        <div>{{change_pw.submit}}</div>
      </div>
      <send-message ref="sendMessage" @selfEvent="getTiemOut" :mobile="phone" :globalCode="areaCode" :messageCode="messageCode" @close="closeModel" />
    </div>
  </div>
</template>
<script>
import publicHeader from '../../../components/public_header.vue'
import sendMessage from '../../../components/send-message'
import store from '../../../store'
export default {
  name: 'set_payment',
  data() {
    return {
      hasPass: false,
      oldPass: '',
      password: '',
      prePass: '',
      params: '',
      modifyThe: '',
      tel: '',
      vCode: '',
      payDisable: false,
      messageCode: 5,
      limitTime: 60,
      timeId: '',
      timeoutDate: '',
      areaCode: '',
      phone: '',
      paySecond: false,
      is_loading: false
    }
  },
  components: { publicHeader, sendMessage },
  computed: {
    change_pw() {
      let change_pw = this.$t('change_pw')
      return change_pw
    }
  },
  mounted() {
    let paymentpwdFlag = this.$route.query.num
    console.log(paymentpwdFlag)
    if (paymentpwdFlag == 1) {
      this.hasPass = true
    } else {
      this.hasPass = false
    }
    this.modifyThe = paymentpwdFlag
    let userInfo = JSON.parse(localStorage.getItem('userInformation'))
    let tel = userInfo.tel.substr(0, 3) + '****' + userInfo.tel.substr(7)
    this.tel = '+' + userInfo.globalCode + ' ' + tel
    this.areaCode = userInfo.globalCode
    this.phone = userInfo.tel
    console.log(this.tel)

    // 保留倒计时
    let regTime = sessionStorage.getItem('regTime')
    if (regTime) {
      let times = parseInt(regTime) + 60
      let nowTimeout = parseInt(new Date() / 1000)
      this.timeoutDate = parseInt(times - nowTimeout)
      if (this.timeoutDate > 0) {
        this.payDisable = true
        this.limitTime = this.timeoutDate % 60
        this.timeId = setInterval(() => {
          this.limitTime--
          if (this.limitTime == 0) {
            console.log('----dao---shi ')
            this.payDisable = false
            clearInterval(this.timeId)
          }
        }, 1000)
      } else {
        clearInterval(this.timeId)
        sessionStorage.removeItem('regTime')
        this.payDisable = false
        sessionStorage.removeItem('nameTel')
        sessionStorage.removeItem('area_code')
      }
    }
  },
  methods: {
    getUserinfo() {
      store
        .dispatch('userInfoApi')
        .then(res => {
          if (res.data.code === 1) {
            let userInfo = res.data.data
            userInfo = JSON.stringify(userInfo)
            localStorage.setItem('userInformation', userInfo)
            if (this.$route.query.url) {
              this.$router.push(this.$route.query.url)
            } else {
              this.$router.push('/account')
            }
          } else {
            this.toast.error(res.data.message)
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    getCode() {
      this.is_loading = true
      store
        .dispatch('checkImgApi', {
          clientType: 2,
          module: 4,
          globalCode: this.areaCode,
          mobile: this.phone
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 1) {
            if (res.data.data == 'true') {
              console.log(111111111111)
              this.openModel()
              this.is_loading = false
            } else {
              this.getPhoneCode()
            }
          } else {
            this.is_loading = false
            this.toast.error(res.data.message)
          }
        })
      // this.getTiemOut();
    },
    getPhoneCode() {
      let vCodeId = sessionStorage.getItem('vCodeId')
      this.is_loading = true
      store
        .dispatch('phoneCodeApi', {
          clientType: 2,
          module: 4,
          globalCode: this.areaCode,
          mobile: this.phone,
          vCodeId: vCodeId
        })
        .then(res => {
          console.log(res)
          if (res.data.code === 1) {
            this.payDisable = true
            this.toast.success(res.data.message)
            this.paySecond = true
            this.is_loading = false
            this.getTiemOut()
          } else {
            this.is_loading = false
            this.toast.error(res.data.message)
          }
        })
    },
    openModel() {
      if (!this.payDisable) {
        this.$refs.sendMessage.open()
        // this.$emit("open");
      }
    },
    closeModel() {},
    // 倒计时
    getTiemOut() {
      let timeoutDate = parseInt(new Date() / 1000)
      sessionStorage.setItem('regTime', timeoutDate)
      this.limitTime = 60
      let num = 60
      clearInterval(this.timeId)
      // this.setMsgStatus(true)
      this.payDisable = true
      if (this.payDisable) {
        let t1 = parseInt(new Date().getTime() / 1000)
        this.timeId = setInterval(() => {
          let t2 = parseInt(new Date().getTime() / 1000)
          this.limitTime = num - (t2 - t1)
          if (this.limitTime <= 0) {
            // console.log('----dao---shi ')
            this.payDisable = false
            this.limitTime = 60
            clearInterval(this.timeId)
          }
        }, 1000)
      }
    },

    submit() {
      if (!this.vCode) {
        let passError = this.$t('login_index.verify_err')
        this.toast.error(passError)
        return
      } else if (!this.password) {
        let passError = this.$t('change_pw.login_pw')
        this.toast.error(passError)
        return
      } else if (!this.prePass) {
        let cfmError = this.$t('change_pw.re_login_pw')
        this.toast.error(cfmError)
        return
      } else if (this.password !== this.prePass) {
        let sameError = this.$t(
          'account_and_security.set_payment_pw.inequality'
        )
        this.toast.error(sameError)
        return
      }
      this.params = {
        clientType: 2,
        mCode: this.vCode,
        payPwd: this.password,
        cfmPwd: this.prePass
      }
      if (this.hasPass) {
        this.params.payPasswordStatus = 2
      } else {
        this.params.payPasswordStatus = 0
      }
      store.dispatch('modifyPayPassApi', this.params).then(res => {
        if (res.data.code === 1) {
          this.toast.success(res.data.message)
          this.getUserinfo()
        } else {
          this.toast.error(res.data.message)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.set_payment {
  height: 100%;
  .header {
    border-bottom: 1px solid #ededed;
    position: fixed;
    width: 100%;
    height: 7%;
    min-height: 35px;
    top: 0;
    z-index: 1;
  }
  .content {
    position: fixed;
    top: 7%;
    width: 100%;
    height: 93%;
  }
  .setting {
    background: #fff;
    div {
      &:last-child {
        border-bottom: none;
      }
      height: 45px;
      line-height: 45px;
      border-bottom: 1px solid #ededed;
      margin-left: 20px;
    }
    input {
      border: none;
      width: 100%;
    }
    .tel_vCode {
      display: flex;
      padding-right: 15px;
      align-items: center;
      div {
        &:first-child {
          flex: 1;
        }
        margin: 0;
        color: #666666;
        border-bottom: none;
      }
      .vCode {
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        background: rgba(255, 100, 76, 0.1);
        border: 1px solid #e65a45;
        border-radius: 2px;
        color: #ff644c;
        div {
          min-width: 65px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          img {
            width: 20px;
            margin-bottom: -4px;
          }
        }
      }
      .send_code {
        height: 30px;
        line-height: 30px;
        padding: 0 5px;
        border-radius: 2px;
        background: #b1afaf;
        border: 1px solid #333;
      }
    }
  }
  .submit {
    margin: 80px auto;
    width: 93%;
    div {
      border: none;
      background: #ff644c;
      color: #fff;
      width: 100%;
      padding: 12px;
      border-radius: 4px;
      text-align: center;
    }
  }
}
</style>
