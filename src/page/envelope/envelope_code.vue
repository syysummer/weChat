<template>
  <div class="envelope_code">
    <div :class="{code_bg: !isEnglish, code_bg_en: isEnglish}">
      <div class="header_img">
        <div class="title" v-if="lang=='zh'"><img src="../../assets/images/envelope_size@2x.png" alt=""></div>
        <div class="title" v-else><img src="../../assets/images/envelope_size_en@2x.png" alt=""></div>
        <img src="../../assets/images/activity_bg@2x.png" alt>
      </div>
      <div class="code_box" ref="qrcode">
        <div class="code">
          <div id="qrcode"></div>
        </div>
        <div class="download">扫描上方二维码即可领取哦！</div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import { setCookie, getCookie } from "../../utils/cookies.js";
export default {
  name: "envelope_code",
  data() {
    return {
      isEnglish: false,
      orderId: "",
      activityId: ""
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
    let orderId = this.$route.query.orderId;
    this.activityId = this.$route.query.activityId;
    this.orderId = orderId;
    this.qrcode(lang);
  },
  methods: {
    qrcode(lang) {
      let qrcode = new QRCode("qrcode", {
        width: 130,
        height: 130,
        text: `https://dev.loong.ph/h5/invitation_register?language=${lang}&orderId=${this.orderId}&activityId=${this.activityId}` // 二维码内容
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
.envelope_code {
  width: 100%;
  height: 100vh;
  .code_bg {
    width: 100%;
    height: 100%;
    // background: url("../../assets/images/activity_bg@2x.png") no-repeat;
    background-image: linear-gradient(-180deg, #ae1f1b 0%, #d9332e 100%);
    background-size: 100% 100%;
    position: relative;
    .header_img {
      width: 92%;
      margin: 0 auto;
      img {
        width: 100%;
      }
      .title {
        width: 60%;
        margin: 0 auto -15px;
        padding: 42px 0 0;
        img {
          width: 100%;
        }
      }
    }
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
    // background: url("../../assets/images/english_invitation@2x.png") no-repeat;
    background-image: linear-gradient(-180deg, #ae1f1b 0%, #d9332e 100%);
    background-size: 100% 100%;
    position: relative;
    .header_img {
      width: 92%;
      margin: 0 auto;
      img {
        width: 100%;
      }
      .title {
        width: 60%;
        margin: 0 auto -15px;
        padding: 42px 0 0;
        img {
          width: 100%;
        }
      }
    }
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
