<template>
	<div class="contain">
		<div class="phoneHeader">
			<publicHeader :title="get_coupon_title"></publicHeader>
		</div>
		<div class="coupon-box">
			<couponsDetails :couponsData=couponsData></couponsDetails>
		</div>
	</div>
</template>
<script>
import publicHeader from '@/components/public_header.vue'
import couponsDetails from './components/voucher_detail.vue'
import store from '@/store'
export default {
  data() {
    return {
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
      let title = this.$t('coupon.use_records')
      return title
    }
  },
  mounted() {
    this.isSmall = document.body.clientWidth < 329 && true
    this.getVoucher(2)
  },
  methods: {
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
  }
}
</script>

<style lang="scss" scoped type="text/css">
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
.coupon-box .coupon_contain {
  top: 7%;
}
</style>
