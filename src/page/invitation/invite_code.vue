<template>
  <div class="invite_code">
    <div :class="{code_bg: !isEnglish, code_bg_en: isEnglish}">
      <div class="code_box" ref="qrcode">
        <div class="code">
          <div id="qrcode"></div>
        </div>
        <div class="download">{{$t('invitation.invite_code.download')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import { setCookie, getCookie } from "../../utils/cookies.js";
export default {
  name: "invite_code",
  data() {
    return {
      isEnglish: false,
      userId: ''
    };
  },
  beforeCreate() {
    this.$nextTick(function() {
      this.lang = this.$route.query.language;
      let language = getCookie("lang");
      console.log("lang", lang);
      console.log("language", language);
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
  created() {},
  mounted() {
    let lang = getCookie("lang");
    if (lang == "en") {
      this.isEnglish = true;
    } else {
      this.isEnglish = false;
    }
    let userId = this.$route.query.userID
    // if (userId) {
    //   this.$refs.qrcode.style.display = 'block'
    // } else {
    //   this.$refs.qrcode.style.display = 'none'
    // }
    this.userId = userId
    this.qrcode(lang);
  },
  methods: {
    qrcode(lang) {
      let qrcode = new QRCode("qrcode", {
        width: 130,
        height: 130,
        text:
          `https://dev.loong.ph/h5/invitation_register?language=${lang}&userID=${this.userId}` // 二维码内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f'
        // foreground: '#ff0'
      });
      console.log(qrcode);
    }
  }
};
</script>
<style scoped lang="scss">
.invite_code {
  width: 100%;
  height: 100vh;
  .code_bg {
    width: 100%;
    height: 100%;
    background: url("../../assets/images/invitation_bg@2x.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
    .code_box {
      width: 100%;
      position: absolute;
      top: 55%;
      text-align: center;
      color: #fdf3d3;
      #qrcode {
        width: 150px;
        background: #fff;
        padding: 10px;
      }
      .code {
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .download {
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }
  .code_bg_en {
    width: 100%;
    height: 100%;
    background: url("../../assets/images/english_invitation@2x.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
    .code_box {
      width: 100%;
      position: absolute;
      top: 55%;
      text-align: center;
      color: #fdf3d3;
      #qrcode {
        width: 150px;
        background: #fff;
        padding: 10px;
      }
      .code {
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .download {
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }
}
</style>
