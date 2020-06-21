<template>
  <div ref="wrapper" class="coupon_contain" :class="{iphone5: isIphone5, iphoneP: isIphoneP, iphone6: isIphone6, iphoneX: isIphoneX, awidth: isShow}">
    <div>
      <div class="coupon_row" v-if="isEmpty" v-for="(item, index) in couponsData" :key="index">
        <!-- TODO 有数据后根据可用状态放开蒙层 -->
        <div class="useless_mask" v-if="item.expire == 1">
          <!-- <img v-lazy="useless_zh" v-if="language == 'zh'">
            <img v-lazy="useless_en" v-if="language == 'en'"> -->
          <img :src="useless_zh" v-if="language == 'zh'">
          <img :src="useless_en" v-if="language == 'en'">
        </div>
        <div class="useless_mask" v-if="item.used == 1">
          <!-- <img v-lazy="used_zh" v-if="language == 'zh'">
            <img v-lazy="used_en" v-if="language == 'en'"> -->
          <img :src="used_zh" v-if="language == 'zh'">
          <img :src="used_en" v-if="language == 'en'">
        </div>
        <div class="coupon_items" :class="item.universalId == 0 ? 'coupon_platform' : 'coupon_store'">
          <div class="coupon_discrpt">
            <p class="coupon_worth">
              <span :class='{smallFont: couponsData.isSmall}'>{{item.money}}</span> P</p>
          </div>
          <div class="coupon_detail">
            <p class="coupon_name" v-if="item.universalId==0">
              <span v-if="item.fullMoney == 0">{{en_txt.no_threshold}}</span>
              <span v-if="item.fullMoney != 0">{{en_txt.full}} {{item.fullMoney}} {{en_txt.to_use}}</span>            
            </p>
            <p class="coupon_name active" v-if="item.universalId!=0">{{en_txt.full}} {{item.fullMoney}} {{en_txt.to_use}}</p>
            <p class="expired_date" :class="{store_color: item.universalId != 0, iphone5: isIphone5}">{{$formatDateTime(item.startTime, 'ymd').replace(/-/g,'.')}}-{{$formatDateTime(item.expireTime, 'ymd').replace(/-/g,'.')}}</p>
            <p class="use_platform" v-if="item.universalId == 0">{{en_txt.source}}：{{en_txt.platform_voucher}}</p>
            <p class="use_platform" v-if="item.universalId != 0">{{en_txt.source}}：{{en_txt.merchant_voucher}}</p>
            <div v-if="item.universalId == 0">
              <p class="use_platform act" v-if="item.sellerCatId == 0">{{en_txt.platform_use}}</p>
              <p class="use_platform act" v-else>{{en_txt.limit}}{{item.name}}{{en_txt.category}}</p>
            </div>
            <div v-if="item.universalId != 0">
              <p class="use_platform act">{{en_txt.limit}}{{item.name}}{{en_txt.use}}</p>
            </div>
            <!-- <p class="use_phone">{{en_txt.Limit_number}} {{item.tel}}</p> -->
          </div>
          <div v-if="item.no_use == 1" class="use-button">
            <div v-if="item.status==1">
              <img :src="no_used_zh" v-if="language == 'zh'" class="no_used">
              <img :src="no_used_en" v-if="language == 'en'" class="no_used">
            </div>
            <div class="coupon_right" :class="item.universalId != 0 ? 'act' : ''" v-else>
              <div @click="goUse(item.universalId,item.sellerCatId,item.universalId,item.name)">{{en_txt.go_use}}</div>
            </div>
          </div>
        </div>
        <div class="useless_tip" v-if="item.expire == 1">
          <span>{{en_txt.unavailable_reason}}</span>
        </div>
        <!-- <div class="useless_tip" v-if="item.used == 1">
					<span></span>
				</div> -->
      </div>
    </div>
    &emsp;
    <div class="empty_coupon" v-if="!isEmpty">
      <!-- <img v-lazy='empty_img'> -->
      <img :src='empty_img'>
      <p>{{$t('coupon.not_enough_voucher')}}</p>
    </div>
  </div>
</template>
<script>
import Bscroll from 'better-scroll'
import { setCookie, getCookie, removeCookie } from '@/utils/cookies'
export default {
  data() {
    return {
      empty_img: require('@/assets/images/我的-无优惠卷插图.png'),
      no_used_zh: require('@/assets/images/未开始@2x.png'),
      no_used_en: require('@/assets/images/Upcoming@2x.png'),
      used_zh: require('@/assets/images/已使用@2x.png'),
      used_en: require('@/assets/images/已使用-english@2x.png'),
      useless_zh: require('@/assets/images/已失效@2x.png'),
      useless_en: require('@/assets/images/已失效-english@2x.png'),
      isHover: true,
      platform: true,
      isIphoneX: false,
      isIphoneP: false,
      isIphone6: false,
      isIphone5: false,
      isEmpty: true,
      isShow: false
    }
  },
  props: ['couponsData'],
  created() {
    this.language = getCookie('lang')
    let ALL_HEIGHT = document.body.clientHeight
    let is_iOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if (is_iOS) {
      if (ALL_HEIGHT > 630 && ALL_HEIGHT < 640) {
        this.isIphoneX = true
      } else if (ALL_HEIGHT > 545 && ALL_HEIGHT < 560) {
        this.isIphone6 = true
      } else if (ALL_HEIGHT > 610 && ALL_HEIGHT < 630) {
        this.isIphoneP = true
      } else if (ALL_HEIGHT > 450 && ALL_HEIGHT < 470) {
        this.isIphone5 = true
      }
    }
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.wrapper, {
        mouseWheel: true,
        click: true,
        tap: true
      })
    })
  },
  methods: {
    goUse(voucherSource, sellerCatId = '', universalId = '', name = '') {
      if (voucherSource == 0) {
        if (sellerCatId == 0 || sellerCatId.indexOf(',') > -1) {
          this.$router.push('/home')
        } else {
          localStorage.setItem('label_title', name)
          localStorage.setItem('catId', sellerCatId)
          this.$router.push({
            path: '/seller_list',
            query: {
              catId: sellerCatId,
              allDay: ''
            }
          })
        }
      } else {
        this.$router.push({
          path: '/business_shop',
          query: {
            id: universalId,
            pathName: this.$route.name
          }
        })
      }
    }
  },
  computed: {
    en_txt() {
      return this.$t('coupon')
    }
  },
  watch: {
    couponsData: function(newVal, oldVal) {
      if (newVal.length == 0) {
        this.isEmpty = false
        this.isShow = true
      } else {
        this.isEmpty = true
        this.isShow = false
      }
    }
  }
  // updated() {
  //   this.scroll.destroy()
  //   this.$nextTick(() => {
  //     setTimeout(() => {
  //       this.scroll = new Bscroll(this.$refs.wrapper, {})
  //       this.scroll.refresh()
  //       this.scroll.scrollTo(0, 0, 10)
  //     }, 500)
  //   })
  // }
}
</script>
<style lang="scss" scoped="" type="text/css">
.contain {
  height: 100%;
}
.coupon_contain {
  height: 84%;
  // overflow-y: auto;
  padding: 0.5rem 0.4rem 0.4rem;
  position: fixed;
  // overflow-y: auto;
  padding: 0.5rem 0.4rem 0.4rem;
  width: 100%;
  top: 16%;
  &.awidth {
    width: 100%;
  }
  .coupon_platform {
    background-image: url(../../../assets/images/voucher_en.png);
  }
  .coupon_store {
    background-image: url(../../../assets/images/代金券.png);
  }
  .coupon_row {
    position: relative;
    &:first-child .coupon_items {
      margin: 0;
    }
    .useless_mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.6);
      img {
        position: absolute;
        width: 30%;
        right: 0.1rem;
        top: 0.2rem;
      }
    }
    .coupon_items {
      .no_used {
        width: 2rem;
      }
      padding: 0.2rem 0.2rem 0.2rem 0.4rem;
      display: -webkit-box;
      background-size: 100% 100%;
      margin-top: 0.4rem;
      height: 3.2rem;
      .coupon_right {
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #ff3a37;
        text-align: center;
        height: 25px;
        line-height: 23px;
        border: 1px solid #ff3f3c;
        margin-right: 0.3rem;
        border-radius: 5px;
        padding: 0 4px;
        &.act {
          color: #ffcc37;
          border: 1px solid #ffcc37;
        }
        // float: right;
      }
      .use-button {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .coupon_detail {
        padding-left: 6%;
        -webkit-box-flex: 20;
        .coupon_name {
          font-size: 15px;
          color: #ff3633;
          font-weight: bold;
          &.active {
            color: #ffcc37;
            width: 113%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .expired_date {
          font-size: 12px;
          color: #ff8280;
          // margin-bottom: 0.2rem;
        }
        .use_platform,
        .use_phone {
          &.act {
            margin-top: 0.2rem;
            font-size: 13px;
          }
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          color: #999;
        }
        .store_color {
          color: #ffb900;
        }
      }
      .coupon_discrpt {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        width: 2.5rem;
        // -webkit-box-flex: 1;
        // margin-top: 4%;
        .coupon_worth {
          // margin-top: 0.2rem;
          font-size: 14px;
          text-align: center;
          span {
            font-size: 30px;
            &.smallFont {
              font-size: 24px;
            }
          }
        }
        .coupo_limit {
          color: #ffffff;
          font-size: 12px;
        }
      }
    }
    .useless_tip {
      color: #666;
      padding: 0.2rem 0.2rem 0.2rem 0.4rem;
      background-color: #fafafa;
      border-radius: 4px;
      span {
        font-size: 12px;
      }
    }
  }
  .empty_coupon {
    margin-top: 5.5rem;
    width: 100%;
    text-align: center;
    font-size: 14px !important;

    img {
      width: 40%;
      font-size: 14px !important;
    }
    p {
      font-size: 14px;
      color: #666;
      margin-top: 0.4rem;
    }
  }
}
// .coupon_contain.iphoneP{
//   height: 75vh;
// }
// .coupon_contain.iphone6{
//   height: 74vh;
// }
// .coupon_contain.iphoneX{
//   height: 71vh;
// }
// .coupon_contain.iphone5{
//   height: 72vh;
// }
// .coupon_contain .coupon_row .coupon_items .coupon_detail .expired_date.iphone5{
//   margin-top: -.2rem;
// }
@media screen and (max-width: 329px) {
  .coupon_contain .coupon_row .coupon_items {
    padding: 0.1rem 0.2rem 0.4rem 0.4rem;
  }
  .coupon_list .coupon_row .coupon_items .coupon_discrpt .coupon_worth span {
    font-size: 16px;
  }
}
</style>
