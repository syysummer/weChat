<template>
  <div class="envelope_register" v-show="isShow">
    <!-- <div class="phoneHeader">
            <publicHeader title="龙外卖新人优惠" v-if="!isActive"></publicHeader>
            <publicHeader title="Loong take out new staff discount" v-else></publicHeader>
    </div>-->
    <div class="bg_container">
      <div class="title" v-if="lang=='zh'">
        <img src="../../assets/images/envelope_size@2x.png" alt>
      </div>
      <div class="title" v-else>
        <img src="../../assets/images/envelope_size_en@2x.png" alt>
      </div>
      <div class="page_bg">
        <img src="../../assets/images/activity_bg@2x.png" alt>
      </div>
    </div>
    <!-- <div class="bg_container" v-else>
      <img class="page_bg" src="@/assets/images/english_invitation@2x.png" alt="">
    </div>-->
    <div class="inputs">
      <div class="input_bg">
        <div class="area_code" @click="setCode">
          <img src="../../assets/icons/DisclosureIndicator@2x.png" alt>
          <span v-if="!isActive">手机归属地</span>
          <span v-else>Phone number place</span>
          <span>+{{areaCode}}</span>
        </div>
        <div class="phone">
          <input @focus="focued" type="text" v-model="tel" ref="input_tel" @blur="inviteMess">
          <span class="holider" @click="onfoucus" ref="span_tel" v-if="!isActive">请输入手机号</span>
          <span class="holider" @click="onfoucus" ref="span_tel" v-else>Phone number</span>
          <div v-if="!isLoading">
            <div
              class="codes"
              @click="getPhoneCode"
              v-if="!invitDisabled && !isActive && !isSecond"
            >获取验证码</div>
            <div
              class="codes"
              @click="getPhoneCode"
              v-if="!invitDisabled && !isActive && isSecond"
            >重获验证码</div>
            <div
              class="codes"
              @click="getPhoneCode"
              v-if="!invitDisabled && isActive && !isSecond"
            >Get code</div>
            <div
              class="codes"
              @click="getPhoneCode"
              v-if="!invitDisabled && isActive && isSecond"
            >reacquire</div>
            <div v-if="invitDisabled && !isActive">
              <span class="limit">{{limitTime}}s后重新发送</span>
            </div>
            <div v-if="invitDisabled && isActive">{{limitTime}}s resend</div>
          </div>
          <div class="loading_img" v-else>
            <img src="../../assets/icons/is_loading.gif" alt>
          </div>
        </div>
        <div class="phone_code">
          <span class="holider" @click="onOtherfoucus" ref="span_code" v-if="!isActive">请输入验证码</span>
          <span class="holider" @click="onOtherfoucus" ref="span_code" v-else>Please enter the code</span>
          <input @focus="focued" type="text" v-model="vCode" ref="input_code" @blur="inviteMess">
        </div>
      </div>
      <div class="middle_btn">
        <div class="btn" @click="jionUs">
          <div v-if="!isActive">
            <button>立即领取</button>
          </div>
          <div v-else>
            <button>Receive now</button>
          </div>
        </div>
        <div class="agree" v-if="!isActive">
          <span>阅读并同意</span>
          <span @click="goAgreement">《用户服务协议》</span>
        </div>
        <div class="agree" v-else>
          <span>Read and agree</span>
          <span @click="goAgreement">《User agreement》</span>
        </div>
      </div>
    </div>
    <send-message
      ref="sendMessage"
      @selfEvent="getTiemOut"
      :mobile="tel"
      :globalCode="areaCode"
      :messageCode="messageCode"
      @close="closeModel"
    />
  </div>
</template>
<script>
import publicHeader from "../../components/public_header";
import sendMessage from "../../components/send-message";
import store from "../../store";
import Vue from "vue";
import { removeCookie, setCookie, getCookie } from "../../utils/cookies.js";
export default {
  name: "envelope_register",
  data() {
    return {
      areaCode: "",
      tel: "",
      vCode: "",
      invitDisabled: false,
      messageCode: 1,
      timeId: "",
      limitTime: 60,
      invitation: "",
      isActive: false,
      maskShow: false,
      lang: "",
      isShow: false,
      timeoutDate: "",
      isSecond: false,
      elemHeight: Number,
      isLoading: false
    };
  },
  components: { publicHeader, sendMessage },
  watch: {
    tel(newVal, oldVal) {
      if (newVal != "") {
        this.$refs.span_tel.style.display = "none";
      } else {
        this.$refs.span_tel.style.display = "inline";
      }
    },
    vCode(newVal, oldVal) {
      console.log(222222);
      if (newVal != "") {
        this.$refs.span_code.style.display = "none";
      } else {
        this.$refs.span_code.style.display = "inline";
      }
    }
  },
  computed: {
    // certificate() {
    //     return this.$router.query
    // }
  },
  beforeCreate() {
    let isShow = sessionStorage.getItem("isShow");
    if (!isShow) {
      sessionStorage.setItem("isShow", "false");
    } else if (sessionStorage.getItem("isShow") == "true") {
      this.isShow = true;
    } else if (sessionStorage.getItem("isShow") == "false") {
      this.isShow = false;
    }
    this.$nextTick(function() {
      this.lang = localStorage.getItem("language");
      let language = getCookie("lang");
      if (this.lang != language) {
        setCookie("lang", this.lang, 365);
        setCookie("language", this.lang, 365);
        sessionStorage.setItem("isShow", "true");
        location.reload();
      } else {
        this.isShow = true;
        // if (location.href.indexOf("&xyz=") < 0) {
        //   console.log("res",558585)
        //   location.href = location.href + "&xyz=" + Math.random();
        //   sessionStorage.setItem('xyz', this.$route.query.xyz)
        // }
      }
    });
  },
  created() {
    // 语言切换
    this.$nextTick(function() {
      if (this.lang == "en") {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    });
  },
  mounted() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      let token = getCookie("tokenKey");
      if (token) {
        this.$router.push({
          path: "/red_envelope",
          query: {
            orderId: localStorage.getItem("orderId"),
            activityId: localStorage.getItem("activityId"),
            language: this.lang
          }
        });
      }
    }
    this.elemHeight = document.documentElement.clientHeight;
    let areaCodes = sessionStorage.getItem("area_code");
    if (areaCodes) {
      this.areaCode = JSON.parse(areaCodes);
    } else {
      this.areaCode = 63;
    }
    let tel = sessionStorage.getItem("inviteTel");
    if (tel) {
      this.tel = tel;
    }
    let vCode = sessionStorage.getItem("invitevCode");
    if (vCode) {
      this.vCode = vCode;
    }
    // 保留倒计时
    let inviteTime = sessionStorage.getItem("inviteTime");
    if (inviteTime) {
      let times = parseInt(inviteTime) + 60;
      let nowTimeout = parseInt(new Date() / 1000);
      this.timeoutDate = parseInt(times - nowTimeout);
      if (this.timeoutDate > 0) {
        this.invitDisabled = true;
        this.limitTime = this.timeoutDate % 60;
        this.timeId = setInterval(() => {
          this.limitTime--;
          if (this.limitTime == 0) {
            console.log("----dao---shi ");
            this.invitDisabled = false;
            clearInterval(this.timeId);
          }
        }, 1000);
      } else {
        this.invitDisabled = false;
        sessionStorage.removeItem("inviteTel");
        sessionStorage.removeItem("area_code");
        sessionStorage.removeItem("invitevCode");
      }
    }
  },
  methods: {
    focued() {
      document.getElementsByTagName("body")[0].style.height =
        this.elemHeight + "px";
      document.getElementsByClassName("envelope_register")[0].style.height =
        this.elemHeight + "px";
    },
    setCode() {
      this.$router.push("/phone_area");
    },
    onfoucus() {
      this.$refs.input_tel.focus();
    },
    onOtherfoucus() {
      this.$refs.input_code.focus();
    },
    goAgreement() {
      this.$router.push({
        path: "/service_agreement",
        query: {
          language: this.lang,
          local: 0
        }
      });
    },
    inviteMess() {
      sessionStorage.setItem("inviteTel", this.tel);
      sessionStorage.setItem("invitevCode", this.vCode);
    },
    getPhoneCode() {
      let self = this;
      let num = /^\d{3,14}$/;
      let vCodeId = sessionStorage.getItem("vCodeId");
      if (!self.tel) {
        if (!self.isActive) {
          self.toast.error("请输入手机号");
        } else {
          self.toast.error("Please enter the phone number");
        }
        return;
      } else if (!num.test(self.tel)) {
        if (!self.isActive) {
          self.toast.error("请输入正确的手机号");
        } else {
          self.toast.error("Please enter the correct phone number");
        }
        return;
      } else if (!self.areaCode) {
        if (!self.isActive) {
          self.toast.error("手机归属地不能为空");
        } else {
          self.toast.error("Country code can't be empty");
        }
        return;
      }
      this.isLoading = true;
      store
        .dispatch("checkImgApi", {
          clientType: 2,
          globalCode: self.areaCode,
          mobile: self.tel,
          module: 1
        })
        .then(res => {
          console.log("1111111111", res);
          if (res.data.code === 1) {
            self.imgCodeShow = res.data.data;
            if (self.imgCodeShow == "true") {
              this.isLoading = false;
              self.openModel();
            } else {
              store
                .dispatch("phoneCodeApi", {
                  clientType: 2,
                  globalCode: self.areaCode,
                  mobile: self.tel,
                  module: 1,
                  vCodeId: vCodeId
                })
                .then(res => {
                  console.log(res);
                  if (res.data.code === 1) {
                    this.isLoading = false;
                    self.invitDisabled = true;
                    self.toast.success(res.data.message);
                    this.isSecond = true;
                    self.getTiemOut();
                  } else {
                    this.toast.error(res.data.message);
                  }
                })
                .catch(error => {
                  this.isLoading = false;
                  console.log(error);
                });
            }
          } else {
            // self.toast.error(res.data.message)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTiemOut() {
      let timeoutDate = parseInt(new Date() / 1000);
      sessionStorage.setItem("inviteTime", timeoutDate);
      this.limitTime = 60;
      clearInterval(this.timeId);
      // this.setMsgStatus(true)
      this.invitDisabled = true;
      if (this.invitDisabled) {
        this.timeId = setInterval(() => {
          this.limitTime--;
          if (this.limitTime <= 0) {
            // console.log('----dao---shi ')
            this.invitDisabled = false;
            this.limitTime = 60;
            clearInterval(this.timeId);
          }
        }, 1000);
      }
    },
    openModel() {
      if (!this.invitDisabled) {
        this.$refs.sendMessage.open();
        // this.$emit("open");
      }
    },
    closeModel() {
      this.maskShow = false;
    },
    close() {
      // this.phoneCodeVisible = false;
    },
    jionUs() {
      // this.$router.push("/coupon_invit");
      let self = this;
      let vCodeId = sessionStorage.getItem("vCodeId");
      if (!this.tel) {
        if (!this.isActive) {
          this.toast.error("请输入手机号");
        } else {
          this.toast.error("Please enter the phone number");
        }
        return;
      } else if (!this.vCode) {
        if (!this.isActive) {
          this.toast.error("请输入验证码");
        } else {
          this.toast.error("Please enter the code");
        }
        return;
      } else {
        store
          .dispatch("loginApi", {
            loginType: 2,
            clientType: 2,
            globalCode: self.areaCode,
            userName: self.tel,
            mCode: self.vCode,
            vCodeId: vCodeId
          })
          .then(res => {
            // alert(certificate)
            if (res.data.code == 1) {
              console.log(res);
              let userInformation = JSON.stringify(res.data.data.userObj)
              localStorage.setItem('userInformation', userInformation)
              this.$router.push({
                path: "/red_envelope",
                query: {
                  orderId: this.$route.query.orderId,
                  activityId: this.$route.query.activityId,
                  language: this.$route.query.language
                }
              });
              removeCookie("tokenKey");
              sessionStorage.removeItem("inviteTel");
              sessionStorage.removeItem("area_code");
              sessionStorage.removeItem("invitevCode");
              clearInterval(self.timeId);
              sessionStorage.removeItem("inviteTime");
            } else {
              self.toast.error(res.data.message);
            }
          })
          .catch(error => {
            // alert(111111111)
            console.log(error);
          });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.envelope_register {
  height: 100vh;
  background-image: linear-gradient(-180deg, #ae1f1b 0%, #d9332e 100%);
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  overflow-y: auto;
  .bg_container {
    width: 100%;
    // height: 52%;
    overflow: hidden;
    .title {
      width: 55%;
      margin: 0 auto -30px;
      padding-top: 20px;
      img {
        width: 100%;
      }
    }
    .page_bg {
      width: 92%;
      // height: auto;
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
  }
  .phoneHeader {
    position: fixed;
    width: 100%;
    height: 7vh;
    top: 0;
    z-index: 1;
    min-height: 40px;
  }
  .content_bg {
    width: 100%;
  }
  .inputs {
    margin-top: -75px;
    .input_bg {
      position: relative;
      div {
        background: #fdf3d3;
        width: 73%;
        margin: 0.5rem auto;
        margin-top: 0;
        height: 40px;
        line-height: 40px;
        border-radius: 6px;
        padding-left: 15px;
        input {
          font-size: 14px;
          border: none;
          background: none;
          color: #f65724;
        }
        span {
          font-size: 14px;
        }
      }
      .area_code {
        padding-right: 30px;
        position: relative;
        span {
          &:last-child {
            float: right;
          }
          color: #f65724;
        }
        img {
          width: 7px;
          position: absolute;
          top: 13px;
          right: 15px;
        }
      }
      .phone {
        position: relative;
        .holider {
          position: absolute;
          left: 15px;
          color: #f65724;
          // z-index: 999;
        }
        .loading_img {
          img {
            width: 22px;
            margin-bottom: -5px;
          }
        }
        div {
          z-index: 1;
          width: 3.2rem;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 12px;
          position: absolute;
          top: 0;
          right: 0;
          margin: 0;
          padding: 0;
          color: #df2843;
          background: url("../../assets/images/button_06_5@2x.png") no-repeat;
          background-size: 100% 100%;
          background-position: center;
          span {
            font-size: 12px;
          }
        }
      }
      .phone_code {
        position: relative;
        .holider {
          position: absolute;
          left: 15px;
          color: #f65724;
        }
        input {
          width: 100%;
          padding-right: 15px;
        }
      }
    }
    .middle_btn {
      width: 73%;
      margin: 35px auto 0;
      .go_login {
        font-size: 14px;
        float: right;
        color: #fdf3d3;
        margin-bottom: 15px;
      }
      .btn {
        margin: 0;
        clear: both;
        div {
          width: 100%;
          height: 45px;
          background: url("../../assets/images/Group9@2x.png") no-repeat;
          background-size: 100% 100%;
          button {
            width: 100%;
            height: 38px;
            line-height: 38px;
            border: none;
            color: #f75824;
            font-weight: 600;
            background: none;
            font-size: 18px;
          }
        }
      }
      .agree {
        text-align: center;
        margin-top: 10px;
        padding-bottom: 10px;
        span {
          font-size: 13px;
          color: #fdf3d3;
        }
      }
    }
  }
}
@media screen and (max-width: 360px) {
  .envelope_register {
    .inputs {
      // margin-top: -60px;
      .input_bg {
        div {
          height: 32px;
          line-height: 32px;
        }
        .phone {
          div {
            height: 32px;
            line-height: 32px;
            font-size: 12px;
            span {
              transform: scale(0.9);
              display: inline-block;
            }
          }
        }
        .area_code {
          img {
            top: 9px;
            right: 12px;
          }
        }
      }
      .middle_btn {
        .btn {
          div {
            height: 40px;
            button {
              height: 35px;
              line-height: 35px;
            }
          }
        }
        .agree {
          span {
            font-size: 12px;
          }
        }
      }
    }
  }
}
@media screen and (min-height: 810px) {
  .envelope_register {
    .inputs {
      bottom: 3rem;
      .middle_btn {
        .agree {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
