<template>
	<div class="contain">
		<div class="phoneHeader">
			<publicHeader :title='get_coupon_title' :rightBtn="get_coupon_records" @rightBtnFn="right_btn_fn"></publicHeader>
		</div>
		<div class="coupon_title_box">
			<div class="coupon_title">
				<div :class="{'hover': isHover}" @click='getVoucher(1)'>{{$t('coupon._available')}}</div>
				<div :class="{'hover': !isHover}" @click='getVoucher(0)'>{{$t('coupon.already_expired')}}</div>
			</div>
		</div>
		<couponsDetails :couponsData=couponsData></couponsDetails>
	</div>
</template>
<script>
import publicHeader from '@/components/public_header.vue'
import { setCookie, getCookie, removeCookie } from '@/utils/cookies'
import couponsDetails from './components/voucher_detail.vue'
import store from '@/store'
export default {
  data() {
    return {
      isHover: true,
      source: '',
      couponsData: [],
      isSmall: false
    }
  },
  components: {
    publicHeader,
    couponsDetails
  },
  computed: {
    get_coupon_title() {
      let coupon_title = this.$t('coupon.voucher_list')
      return coupon_title
    },
    get_coupon_records() {
      let coupon_records = this.$t('coupon.use_records')
      return coupon_records
    }
  },
  methods: {
    right_btn_fn(data) {
      this.$router.push('/voucher_records')
    },
    getVoucher(status) {
      let url = ''
      this.isHover = status == 0 ? false : true
      if (status == 1) {
        url = 'innerService/getVoucher'
      } else if (status == 0) {
        url = 'innerService/getNoVoucher'
      } else {
        url = 'innerService/getUsedVoucher'
      }
      let params = {
        showCount: 1000
      }
      store.dispatch('getVoucher', { url, params }).then(res => {
        if (res.data.code == 1) {
          console.log(res.data)
          if (status == 0) {
            for (let [i, item] of res.data.data.deliveryList.entries()) {
              item.expire = 1
            }
          } else if (status == 2) {
            for (let [i, item] of res.data.data.deliveryList.entries()) {
              item.used = 1
            }
          } else if (status == 1) {
            for (let [i, item] of res.data.data.deliveryList.entries()) {
              item.no_use = 1
            }
          }
        } else {
          this.toast('error')
        }
        res.data.data.deliveryList.isSmall = this.isSmall
        this.couponsData = res.data.data.deliveryList
      })
    }
  },
  mounted() {
    this.getVoucher(1)
    this.isSmall = document.body.clientWidth < 329 && true
  }
}
</script>

<style lang="scss" scoped="" type="text/css">
.contain {
  height: 100%;
}
.phoneHeader {
  position: fixed;
  width: 100%;
  height: 7%;
  top: 0;
  z-index: 1;
}
.coupon_title_box {
  width: 100%;
  position: fixed;
  background: #fafafa;
  top: 7%;
  left: 0;
  z-index: 1;
  .coupon_title {
    // background: #fafafa;
    // color: #666;
    // font-size: 14px;
    // position: fixed;
    // width: 80%;
    // top: 7vh;
    // left: 10%;
    // z-index: 2;
    display: flex;
    justify-content: space-around;
    div {
      width: 30%;
      // -webkit-box-flex: 1;
      text-align: center;
      padding: 0.4rem 0;
      border-bottom: 1px solid transparent;
      // position: relative;
      &:hover,
      &.hover {
        color: #ff3633;
        border-bottom: 2px solid #ff3633;
      }
      // &:hover::before, &.hover::before {
      // 	content: '';
      // 	width: 80px;
      // 	height: 1px;
      // 	background-color: #ff3633;
      // 	position: absolute;
      // 	bottom: -1px;
      // 	left: 50%;
      // 	margin-left: -40px;
      // }
    }
  }
}
</style>
