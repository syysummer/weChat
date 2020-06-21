<template>
	<div class="coupon_list">
		<div class="header">
			<div class="back" @click="back">
				<img src="../assets/icons/icon_arrows_left@2x.png" alt="">
			</div>
			<div class="title">
				{{en_txt.select_voucher}}
			</div>
		</div>

		<div class="noUse" @click="useless_coupon">{{en_txt.no_voucher}}</div>
		<div class="coupon_auto">
			<div class="coupon_row" v-for="(item, index) in couponsData" :key="index" @click="chooseCoupon(index, item)">
				<!-- TODO 有数据后根据可用状态放开蒙层 -->
				<div class="useless_mask" v-if="item.status == 1">
					<!-- <img v-lazy="useless_zh" v-if="language == 'zh'">
                    <img v-lazy="useless_en" v-if="language == 'en'"> -->
				</div>
				<div class="use_coupon coupon_items" :class="item.universalId == 0 ? 'coupon_platform' : 'coupon_store'">
					<div class="coupon_discrpt">
						<p class="coupon_worth">
							<span :class="{smallFont: isSmall}">{{item.money}}</span> P</p>
					</div>
					<div class="coupon_detail">
						<p class="coupon_name" v-if="item.universalId==0">
							<span v-if="item.fullMoney == 0">{{en_txt.no_threshold}}</span>
							<span v-if="item.fullMoney != 0">{{en_txt.full}} {{item.fullMoney}} {{en_txt.to_use}}</span>
						</p>
						<p class="coupon_name active" v-if="item.universalId!=0">{{en_txt.full}} {{item.fullMoney}} {{en_txt.to_use}}</p>
						<p class="expired_date" :class="{store_color: item.universalId != 0}">{{$formatDateTime(item.startTime, 'ymd').replace(/-/g,'.')}}-{{$formatDateTime(item.expireTime, 'ymd').replace(/-/g,'.')}}</p>
						<p class="use_platform" v-if="item.universalId == 0">{{en_txt.source}}：{{en_txt.platform_voucher}}</p>
						<p class="use_platform" v-if="item.universalId != 0">{{en_txt.source}}：{{en_txt.merchant_voucher}}</p>
						<div v-if="item.universalId==0">
							<p class="use_platform act" v-if="!item.name">{{en_txt.platform_use}}</p>
							<p class="use_platform act" v-else>{{en_txt.limit}}{{item.name}}{{en_txt.category}}</p>
						</div>
						<div v-if="item.universalId!=0">
							<p class="use_platform act">{{en_txt.limit}}{{item.sellerName}}{{en_txt.use}}</p>
						</div>
					</div>
				</div>
				<div class="useless_tip" v-if="item.status == 1">
					<span>{{en_txt.unavailable}}</span>
				</div>
				<!-- <div class="useless_tip" v-if="used == 1">
                    <span></span>
                </div> -->
			</div>
		</div>
		<div class="empty_coupon" v-if="!couponsData">
			<!-- <img v-lazy='empty_img'> -->
			<img :src='empty_img'>
			<p>{{$t('coupon.not_enough_voucher')}}</p>
		</div>
	</div>
</template>
<script>
import { setCookie, getCookie, removeCookie } from '@/utils/cookies'
import store from '@/store'
export default {
  data() {
    return {
      empty_img: require('@/assets/images/我的-无优惠卷插图.png'),
      used_zh: require('@/assets/images/已使用@2x.png'),
      used_en: require('@/assets/images/已使用-english@2x.png'),
      useless_zh: require('@/assets/images/已失效@2x.png'),
      useless_en: require('@/assets/images/已失效-english@2x.png'),
      isHover: true,
      platform: true,
      expire: 1,
      used: 1,
      universal_id: 1,
      couponsData: {},
      isSmall: false
    }
  },
  computed: {
    en_txt() {
      return this.$t('coupon')
    }
  },
  created() {
    this.language = getCookie('lang')
    // this.couponsData = store.state.reduceData
    // store.state.select_coupon = {
    //     money: '',
    //     id: '',
    //     activityType: '',
    //     showCoupon: false
    // }
    this.couponsData = JSON.parse(sessionStorage.getItem('voucherData'))
  },
  mounted() {
    this.isSmall = document.body.clientWidth < 329 && true
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    chooseCoupon(index, item) {
      console.log(1111)
      if (item.status == 1) return
      store.state.select_voucher.money = this.couponsData[index].money
      store.state.select_voucher.id = this.couponsData[index].id
      store.state.select_voucher.controlType = this.couponsData[
        index
      ].controlType
      store.state.select_voucher.showVoucher = true
      store.state.select_coupon.showCoupon = false
      store.state.select_coupon = {}
      this.$router.go(-1)
    },
    useless_coupon() {
      store.state.select_voucher.showVoucher = false
      store.state.select_coupon.showCoupon = false
      store.state.select_coupon = {}
      store.state.select_voucher = {}
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped type="text/css">
.coupon_auto {
  height: 82%;
  overflow-y: auto;
}

.coupon_list {
  height: 100%; // overflow-y: auto;
  // padding: 0.5rem 0.4rem 0.4rem;
  .header {
    text-align: center;
    padding: 12px 15px;
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
      font-size: 18px;
      color: #666;
    }
  }
  .coupon_platform {
    background-image: url(../assets/images/voucher_en.png);
  }
  .coupon_store {
    background-image: url(../assets/images/代金券.png);
  }
  .noUse {
    margin: 10px 10px 15px 10px;
    text-align: center;
    background: #fff;
    padding: 10px;
    font-size: 17px;
    border: 1px solid #dddddd;
    border-radius: 6px;
    overflow: hidden;
  }
  .coupon_row {
    position: relative;
    margin: 0 10px 15px 10px;
    &:first-child .coupon_items {
      margin: 0;
    }
    .useless_mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5);
      img {
        position: absolute;
        width: 30%;
        right: 1.5rem;
        top: 0.2rem;
      }
    }
    .coupon_items {
      padding: 0.2rem 0.2rem 0.4rem 0.4rem;
      display: -webkit-box;
      background-size: 100% 100%;
      margin-top: 0.4rem;
      height: 3.2rem;
      .coupon_detail {
        padding-left: 6%;
        -webkit-box-flex: 20;
        .coupon_name {
          font-size: 14px;
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
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #fff;
        width: 2.5rem;
        // -webkit-box-flex: 1;
        .coupon_worth {
          // margin-top: 0.2rem;
          font-size: 14px;
          span {
            font-size: 30px;
            &.smallFont {
              font-size: 30px;
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
      margin-top: -5px;
      span {
        font-size: 12px;
      }
    }
  }
  .empty_coupon {
    margin-top: 5.5rem;
    text-align: center;
    img {
      width: 40%;
    }
    p {
      font-size: 14px;
      color: #666;
      margin-top: 0.4rem;
    }
  }
}

@media screen and(max-width: 329px) {
  .coupon_contain .coupon_row .coupon_items {
    padding: 0.1rem 0.2rem 0.4rem 0.4rem;
  }
  .coupon_list .coupon_row .coupon_items .coupon_discrpt .coupon_worth span {
    font-size: 16px;
  }
}
</style>
