<template>
  <div>
    <div class="red_envelope" v-show="isShow && loading">
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
      <div v-if="status == 2">
        <div class="coupon" v-if="userStatus==1">
          <div class="bg_img" v-if="activityInfo.activityType == 1">
            <div class="money">
              <span>₱</span>
              <span>{{activityInfo.money}}</span>
            </div>
            <div class="use">
              <div>{{$t("envelope.used")}}</div>
              <!-- <div v-if="activityInfo.isFullReduction==1">{{$t("coupon.complete")}}{{activityInfo.fullReductionMoney}}{{$t("coupon.available")}}</div> -->
              <div v-if="activityInfo.isFullReduction==1">{{$t("envelope.full")}}{{activityInfo.fullReductionMoney}}{{$t("envelope.to_use")}}</div>
              <div v-else>{{$t("coupon.no_threshold")}}</div>
              <div>{{$formatDateTime(activityInfo.activityBeginTime, "_ymd")}}-{{$formatDateTime(activityInfo.activityEndTime, "_ymd")}}</div>
            </div>
            <div class="btn" :class="{btn_en: lang=='en'}" @click="goUse">{{$t("envelope.use")}}</div>
          </div>
          <div class="envelopes_img" v-if="activityInfo.activityType == 2">
            <div class="money">
              <span>₱</span>
              <span>{{activityInfo.money}}</span>
            </div>
            <div class="envelopes_red">
              <div>{{$t("envelope.cash")}}</div>
              <div :class="{plaforms: lang='en'}">{{$t("envelope.plaform")}}</div>
              <div>{{$formatDateTime(activityInfo.createTime, "_ymd")}}</div>
            </div>
            <div class="btn" :class="{btn_en: lang=='en'}" @click="goUse">{{$t("envelope.use")}}</div>
          </div>
          <div class="account">
            {{$t("envelope.account")}}：
            <span>{{userAcount}}</span>
          </div>
        </div>
        <div class="no_coupon" v-if="userStatus == 0">
          <div class="img_bg">
            <div class="img">
              <img src="../../assets/images/no_use@2x.png" alt>
            </div>
            <div class="notes">
              <div>{{$t("envelope.note")}}</div>
              <div>{{$t("envelope.note1")}}</div>
            </div>
            <!-- <div class="note" v-else>红包已失效</div> -->
          </div>
        </div>
        <div class="look_luck">
          <div class="title">
            <span class="line" :class="{lines: lang=='en'}"></span>
            <span :class="{look_en: lang=='en'}">{{$t("envelope.look")}}</span>
            <span class="line" :class="{lines: lang=='en'}"></span>
          </div>
          <div class="luck_list" v-for="(item, index) in listMap" :key="index">
            <div class="img">
              <img :src="item.userPhoto || defaultImg" alt>
            </div>
            <div class="name">
              <div>{{item.userName}}</div>
              <div>{{item.userTime}}{{$t("envelope.receive")}}</div>
            </div>
            <div class="num" v-if="item.Maxstatus==1">₱{{item.money}}</div>
            <div class="num" v-if="item.Maxstatus==0">
              <div>₱{{item.money}}</div>
              <div>
                <img src="../../assets/icons/luck_icon@2x.png" alt>
                {{$t("envelope.luck")}}
              </div>
            </div>
          </div>
          <div class="luck_list no_appear" v-if="!luck_hand">{{$t("envelope.lucking")}}</div>
        </div>
        <div class="look_luck">
          <div class="title titles">
            <span class="line"></span>
            <span>{{$t("envelope.activity")}}</span>
            <span class="line"></span>
          </div>
          <div class="activity_list" v-if="lang=='zh'">{{activityInfo.activityRule}}</div>
          <div class="activity_list" v-else>{{activityInfo.activityRuleEn}}</div>
          <!-- <div class="activity_list">3. 下单即可分享红包给好友或者微信群；</div>
          <div class="activity_list">4. 下单即可分享红包给好友或者微信群；</div>
          <div class="activity_list">5. 下单即可分享红包给好友或者微信群；</div>
          <div class="activity_list">6. 下单即可分享红包给好友或者微信群；</div>-->
        </div>
      </div>
      <div class="no_coupon" v-if="status == 1">
        <div class="img_bg">
          <div class="img">
            <img src="../../assets/images/no_use@2x.png" alt>
          </div>
          <div class="note">{{$t("envelope.noUse")}}</div>
        </div>
      </div>
      <div class="banquan" :class="{ banquans: status==1 }">{{$t("envelope.note2")}}</div>
      <div class="using" @click="goUse" v-if="status == 2">{{$t("envelope.use")}}</div>
    </div>
  </div>
</template>
<script>
import publicHeader from "../../components/public_header";
import { $formatDateTime } from "../../utils";
import store from "../../store";
import Vue from "vue";
import defaultImg from "../../assets/images/default_img@2x.png";
import { removeCookie, setCookie, getCookie } from "../../utils/cookies.js";
export default {
  name: "red_envelope",
  data() {
    return {
      defaultImg,
      lang: "",
      isShow: false,
      isUser: 1,
      show_wx: false,
      activityInfo: {},
      listMap: [],
      userStatus: "",
      status: "",
      luck_hand: false,
      loading: false,
      userAcount: ""
    };
  },
  components: { publicHeader },
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
      this.lang = this.$route.query.language;
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
  mounted() {
    this.getRedPacket();
    this.redPacketDetails();
  },
  methods: {
    getRedPacket() {
      store
        .dispatch("getRedPacket", {
          orderId: this.$route.query.orderId,
          activiceId: this.$route.query.activityId
        })
        .then(res => {
          console.log(res, "get_envelope");
          if (res.data.code == 1) {
            this.toast.success(res.data.message);
          } else {
            this.toast.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    redPacketDetails() {
      store
        .dispatch("redPacketDetails", {
          orderId: this.$route.query.orderId
        })
        .then(res => {
          console.log(res, "red_envelope");
          if (res.data.code == 1) {
            this.loading = true;
            this.activityInfo = res.data.data.activityInfo;
            this.userAcount = res.data.data.userAcount;
            this.listMap = res.data.data.listMap;
            this.listMap.forEach(item => {
              if (item.Maxstatus == 0) {
                this.luck_hand = true;
              } else {
                this.luck_hand = false;
              }
              let days = item.userTime / (1000 * 60 * 60 * 24);
              let hours =
                (item.userTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
              let minutes = (item.userTime % (1000 * 60 * 60)) / (1000 * 60);
              let seconds = (item.userTime % (1000 * 60)) / 1000;
              console.log(days, hours, minutes, seconds, "timer");
              if (days >= 1) {
                item.userTime = Math.floor(days) + this.$t("envelope.days");
              } else if (hours >= 1) {
                item.userTime = Math.floor(hours) + this.$t("envelope.hours");
              } else if (minutes >= 1) {
                item.userTime =
                  Math.floor(minutes) + this.$t("envelope.minutes");
              } else if (seconds >= 1) {
                item.userTime =
                  Math.floor(seconds) + this.$t("envelope.seconds");
              }
            });
            this.userStatus = res.data.data.userStatus;
            if (res.data.data.status == 1) {
              this.status = 1;
            } else {
              this.status = 2;
            }
          } else {
            this.loading = false;
            this.toast.error(res.data.message);
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    goUse() {
      location.href = `https://dev.loong.ph/app/index_page?language=${this.lang}`
    }
  }
};
</script>
<style scoped lang="scss">
.red_envelope {
  height: 100vh;
  background-image: linear-gradient(-180deg, #ae1f1b 0%, #d9332e 100%);
  overflow-y: auto;
  padding: 0 10px;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
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
      width: 94%;
      // height: auto;
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
  }
  .coupon {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    width: 100%;
    padding: 13px 11px;
    margin: -80px 0 10px;
    position: relative;
    z-index: 1;
    .bg_img {
      background: url("../../assets/images/platform_user@2x.png") no-repeat;
      background-size: 100% auto;
      display: flex;
      align-items: center;
      padding: 16px 14px;
      .money {
        margin-right: 0.4rem;
        span {
          &:last-child {
            font-size: 45px;
            font-family: Helvetica;
          }
          display: inline-block;
          font-family: LucidaGrande-Bold;
          font-size: 20px;
          color: #ff274a;
          background-image: linear-gradient(
            to right,
            #ff7665,
            #ff3633,
            #ff6b4e
          );
          letter-spacing: 0;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .use {
        flex: 1;
        div {
          &:first-child {
            font-family: PingFangSC-Semibold;
            font-size: 15px;
            color: #333333;
          }
          &:last-child {
            font-size: 12px;
            color: #cccccc;
          }
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #999999;
          line-height: 25px;
        }
      }
      .btn {
        background-image: linear-gradient(
          135deg,
          #ff7665 0%,
          #ff3633 100%,
          #ff6b4e 100%
        );
        border-radius: 28px;
        font-family: PingFangSC-Semibold;
        font-size: 12px;
        color: #ffffff;
        padding: 5px 10px;
        margin-top: -5px;
        font-weight: 600;
        &.btn_en {
          padding: 5px 20px;
        }
      }
    }
    .envelopes_img {
      background: url("../../assets/images/cash_bg@2x.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      padding: 16px 14px 16px 0;
      .money {
        margin: 0 0.8rem 0 0.2rem;
        width: 2.8rem;
        text-align: center;
        span {
          &:last-child {
            font-size: 40px;
            font-family: Helvetica;
          }
          display: inline-block;
          font-family: LucidaGrande-Bold;
          font-size: 20px;
          color: #ff274a;
          background-image: linear-gradient(
            to right,
            #ff7665,
            #ff3633,
            #ff6b4e
          );
          letter-spacing: 0;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .envelopes_red {
        flex: 1;
        div {
          &:first-child {
            font-family: PingFangSC-Semibold;
            font-size: 15px;
            // color: #333333;
          }
          &:last-child {
            font-size: 12px; // color: #cccccc;
          }
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #ffffff;
          font-weight: 600;
          line-height: 25px;
        }
        .plaforms {
          font-size: 13px;
        }
      }
      .btn {
        background: #fede81;
        border-radius: 28px;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #7d4910;
        // text-align: center;
        padding: 8px 15px;
        margin-top: -5px;
        font-weight: 600;
        &.btn_en {
          padding: 5px 20px;
        }
      }
    }
    .account {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      width: 100%;
      text-align: center;
      margin: 10px 0 0;
      span {
        color: #666;
      }
    }
  }
  .no_coupon {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    width: 100%;
    padding: 13px 11px;
    margin: -80px 0 10px;
    position: relative;
    z-index: 1;
    .img_bg {
      background: url("../../assets/images/platform_notuser@2x.png") no-repeat;
      background-size: 100% 100%;
      padding: 24px 0 16px;
      .img {
        width: 56px;
        margin: 0 auto 15px;
        img {
          width: 100%;
        }
      }
      .notes {
        div {
          &:last-child {
            font-size: 12px;
            color: #999999;
          }
          font-family: PingFangSC-Medium;
          font-size: 15px;
          color: #333333;
          text-align: center;
          line-height: 25px;
        }
      }
      .note {
        font-size: 15px;
        color: #999999;
        text-align: center;
        margin-bottom: 10px;
      }
    }
  }
  .look_luck {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    width: 100%;
    padding: 16px 24px;
    margin-bottom: 10px;
    .title {
      text-align: center;
      margin-bottom: 10px;
      // line-height: 22px;
      span {
        &:nth-child(2) {
          display: inline-block;
          margin: 0 5px;
        }
        font-family: PingFangSC-Semibold;
        font-size: 18px;
        font-weight: 600;
        color: #333333;
      }
      .look_en {
        font-size: 16px;
      }
      .line {
        display: inline-block;
        border-bottom: 1px solid #dd9f9c;
        width: 2.5rem;
        margin-bottom: 5px;
        &.lines {
          width: 1.2rem;
        }
      }
    }
    .luck_list {
      &:last-child {
        border-bottom: none;
      }
      display: flex;
      padding: 10px 0 12px;
      border-bottom: 1px solid #dd9f9c;
      align-items: center;
      .img {
        // width: 35px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-bottom: -4px;
        }
      }
      .name {
        flex: 1;
        width: 30%;
        margin: 0 10px;
        div {
          &:last-child {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            font-weight: 500;
          }
          &:first-child {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          font-family: PingFangSC-Medium;
          font-size: 13px;
          color: #333333;
          font-weight: 600;
          line-height: 22px;
        }
      }
      .num {
        font-family: LucidaGrande;
        font-size: 20px;
        color: #333333;
        float: right;
        div {
          &:last-child {
            font-family: PingFangSC-Medium;
            font-size: 13px;
            color: #ff274a;
            background-image: linear-gradient(
              to right,
              #ff7665,
              #ff3633,
              #ff6b4e
            );
            letter-spacing: 0;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          font-family: LucidaGrande;
          font-size: 20px;
          color: #333333;
          text-align: right;
          img {
            width: 14px;
            margin: 0 5px 0 -2px;
          }
        }
      }
    }
    .no_appear {
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #333333;
      justify-content: center;
    }
    .titles {
      margin-bottom: 12px;
    }
    .activity_list {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      line-height: 28px;
    }
  }
  .banquan {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    margin-top: 15px;
  }
  .banquans {
    margin-top: 30px;
  }
  .using {
    background-image: linear-gradient(-154deg, #f2c04b 0%, #ffcd0d 100%);
    border-radius: 8px;
    width: 95%;
    margin: 25px auto 35px;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: -0px;
    text-align: center;
    height: 45px;
    line-height: 45px;
    font-weight: 600;
  }
}
@media screen and (max-width: 329px) {
  .red_envelope {
    .coupon {
      .bg_img {
        padding: 10px;
        .money {
          span {
            font-size: 16px;
            &:last-child {
              font-size: 32px;
            }
          }
        }
        .use {
          div {
            &:last-child {
              transform: scale(0.9);
              margin-left: -6px; // display: inline-block;
            }
            line-height: 22px;
          }
        }
      }
      .envelopes_img {
        padding: 12px 10px 12px 0;
        .money {
          margin-right: 0.6rem;
        }
        .btn {
          padding: 5px 10px;
          &.btn_en {
            padding: 5px 15px;
          }
        }
      }
    }
    .look_luck {
      padding: 16px 20px;
      .title {
        span {
          font-size: 15px;
        }
        .look_en {
          font-size: 14px;
        }
        .line {
          width: 2.4rem;
          &.lines {
            width: 1rem;
          }
        }
      }
      .luck_list {
        display: flex;
        padding: 15px 0 8px;
        .img {
          // width: 35px;
          img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
