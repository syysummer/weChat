<template>
  <div class="select_pay_method">
    <div class="phoneHeader">
      <publicHeader :title="select_pay_method.title"></publicHeader>
    </div>

    <div class="pay_container_body">
      <div class="pay_container">
        <div class="bg_box"></div>
        <div class="zhanwei_box"></div>

        <div style="padding:0 0.4rem;">
          <!-- 支付金额 -->
          <div class="pay_detail">
            <p class="pay_amount_title">{{select_pay_method.amount}}</p>
            <p class="pay_amount">{{pay_methods.actual_price}}P</p>
            <div class="surplus_pay_time_box clearFloat">
              <div class="surplus_pay_time_img">
                <img src="../../assets/icons/icon_time@2x.png" />
              </div>
              <div class="surplus_pay_time">
                {{select_pay_method.payment_time}}:
                <span>{{surplus_time}}</span>
              </div>
            </div>
          </div>

          <!-- 选择支付方式（在线支付/货到付款） -->
          <div class="select_paymethod_btn clearFloat">
            <div class="paymethod_title">
              {{select_pay_method.paymethod}}
            </div>
            <!-- 无法货到付款图标 -->
            <div class="cannot_cash_on_delivery_icon" v-if="cannot_cash_on_delivery">
              <img src="../../assets/icons/cannot_cash_on_delivery.png" @click="order_failed=true" />
            </div>
            <!-- 无法货到付款 -->
            <div class="cash_on_delivery_btn cannot_cash_on_delivery" v-if="cannot_cash_on_delivery">
              {{select_pay_method.cod}}
            </div>
            <!-- 货到付款按钮 -->
            <div class="cash_on_delivery_btn" :class="{'active_btn': is_cash_on_delivery}" v-if="!cannot_cash_on_delivery" @click=select_cash_on_delivery>
              {{select_pay_method.cod}}
            </div>
            <div class="inline_pay_btn" :class="{'active_btn': is_inline_pay}" @click="select_inline_pay">
              {{select_pay_method.online_pay}}
            </div>
          </div>

          <!-- 在线支付-->
          <div class="pay_method_select" v-if="is_inline_pay">
            <p>{{select_pay_method.payment_method}}</p>
            <p class="parities">{{select_pay_method.parities}} : 1P={{rate_data.exchangeRate}}CNY</p>
            <div class="pay_method_list_body">
              <!-- 支付方式数据 -->
              <div class="pay_method_list_box" v-for="(item, index) in rate_data.paymentList" :key="index">
                <div class="no_pay_amount" v-if="item.pay_type=='balancepay'&&item.accountBalance<pay_methods.actual_price"></div>
                <div class="pay_method_list clearFloat" @click="check_pay_method(index)">
                  <div class="pay_checkbox">
                    <div class="check_bg" :class="{checked: active_index == index}"></div>
                  </div>
                  <div class="pay_method_icon">
                    <img :src="item.logo" />
                  </div>
                  <div class="pay_method_content">
                    <div>
                      {{item.paymentName}}
                      <p v-if="item.pay_type=='balancepay'" style="color:#999999;margin-bottom:0;">({{living_payment.available_balance}}:{{item.accountBalance}}P)</p>
                    </div>
                  </div>
                  <div class="pay_account" v-if="item.pay_type=='wx'||item.pay_type=='zfb'">￥ {{item.orderMoney}}</div>
                  <div class="pay_account" v-else>{{pay_methods.actual_price}}P</div>
                  <!-- <div class="pay_account">
                ￥ {{item.orderMoney}}
              </div> -->
                </div>
              </div>
            </div>
          </div>

          <!-- 货到付款 -->
          <div class="cash_on_delivery_body" v-if="is_cash_on_delivery">
            <div class="cash_on_delivery_title">
              {{select_pay_method.hint_title}}
            </div>
            <div class="hint_content_box clearFloat" v-if="lang=='zh'">
              <div class="hint_num">1. </div>
              <div class="hint_content">
                请核对信息并准备好零钱与骑手结算，金额为订单应付金额， 如配送员无法找零，可将零钱存入你的余额。
              </div>
              <div class="hint_num">2. </div>
              <div class="hint_content">
                下单后如有骑手索要小费或其它问题，请及时与客服联系，电 话:0976655566
              </div>
            </div>
            <div class="hint_content_box clearFloat" v-if="lang=='en'">
              <div class="hint_num">1. </div>
              <div class="hint_content">
                Please check delivery and prepare exact amount before payment. Your payment should be the order amount. Your change will keep in your app wallet in case rider don’t have change.
              </div>
              <div class="hint_num">2. </div>
              <div class="hint_content">
                If rider asks for tip or other problems arise, kindly contact our CSR at No:0976655566.
              </div>
            </div>
            <div class="cash_on_delivery_title">
              {{select_pay_method.delivery_information}}
            </div>
            <p>
              <span v-if="order_address.sex == 1">
                <span v-if="lang=='en'">Mrs</span> {{order_address.name}}
                <span v-if="lang=='zh'">(女士)</span>
              </span>
              <span v-if="order_address.sex == 0">
                <span v-if="lang=='en'">Mr</span> {{order_address.name}}
                <span v-if="lang=='zh'">(男士)</span>
              </span>
              {{order_address.phone}}
            </p>
            <p>
              {{order_address.houseNumber}}, {{order_address.address}}
            </p>
          </div>

          <!-- 支付按钮（在线支付） -->
          <div class="pay_btn" @click="pay_btn" v-if="is_inline_pay">
            {{select_pay_method.pay}}
          </div>
          <!-- 支付按钮（货到付款） -->
          <div class="pay_btn" @click="orderCodSalesSetting" v-if="is_cash_on_delivery">
            {{select_pay_method.pay}}
          </div>
        </div>

      </div>
    </div>

    <balance-pay @passwordPay="pswPay" ref="pay"></balance-pay>

    <!-- 无法货到付款遮罩 -->
    <div class="order_failed_task" v-if="order_failed" @click="order_failed=false;"></div>
    <!-- 无法货到付款弹窗 -->
    <div class="order_failed_pop" v-if="order_failed">
      <div class="order_failed_title">
        {{select_pay_method.hint_title}}
      </div>
      <div class="order_failed_body">
        <ul>
          <li>
            <span>
              <!-- 系统已开放货到付款功能 -->
              {{cashOnDelivery_msg.promptInfo.status}}
            </span>
          </li>
          <li>
            <span>
              <!-- 单笔订单应付金额不能>500P -->
              {{cashOnDelivery_msg.promptInfo.single_limit}}
            </span>
          </li>
          <li>
            <span>
              <!-- 累计货到付款未完成订单金额不能>1000P -->
              {{cashOnDelivery_msg.promptInfo.accumulative_limit}}
            </span>
          </li>
          <li>
            <span>
              <!-- 累计货到付款未完成订单数量不能>5笔 -->
              {{cashOnDelivery_msg.promptInfo.settlement_number}}
            </span>
          </li>
          <li>
            <span>
              <!-- 支持店铺分类包括:早餐、美食、夜宵 -->
              {{cashOnDelivery_msg.promptInfo.sellerCatInfo}}
            </span>
          </li>
          <li>
            <span>
              <!-- 以上条件均满足方可使用货到付款 -->
              {{cashOnDelivery_msg.promptInfo.notice}}
            </span>
          </li>
        </ul>

        <div class="know_btn_box">
          <div class="know_btn clearFloat">
            <div class="know_btn_icon">
              <img src="../../assets/icons/know_icon.png" />
            </div>
            <div class="know_btn_txt" @click="order_failed=false;">
              {{select_pay_method.konw_btn}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import publicHeader from '@/components/opacity_header.vue'
import store from '../../store'
import balancePay from '../../components/balance-pay'
import { MessageBox } from 'mint-ui'
import { getCookie } from '../../utils/cookies'
export default {
  name: 'selectPayMethod',
  data() {
    return {
      timer: null,
      orderdetail_timer: null,
      over_timer: null,
      active_index: 0,
      surplus_time: '',
      pay_methods: {
        actual_price: ''
      },
      rate_data: {
        exchangeRate: '',
        orderTime: ''
      },
      pay_method_params: {
        paymentId: '',
        pay_type: ''
      },
      min: '',
      sec: '',
      lang: '',
      payOrderNo: '',
      userInformation: '',
      is_cash_on_delivery: false,
      is_inline_pay: true,
      cannot_cash_on_delivery: true,
      order_failed: false,
      btnState: true,
      order_address: {}
    }
  },
  components: {
    publicHeader,
    balancePay
  },
  computed: {
    living_payment() {
      let living_payment = this.$t('living_payment')
      return living_payment
    },
    select_pay_method() {
      let select_pay_method = this.$t('select_pay_method')
      return select_pay_method
    },
    cashOnDelivery_msg() {
      return store.state.cashOnDelivery
    }
  },
  created() {
    this.lang = getCookie('lang')
    this.theOrderDetails()
    this.cashOnDelivery()
  },
  mounted() {
    this.userInformation = JSON.parse(
      window.localStorage.getItem('userInformation')
    )
    this.order_address = JSON.parse(sessionStorage.getItem('orderAddress'))
  },
  methods: {
    // 获取订单数据
    theOrderDetails() {
      this.$axios
        .post('innerService/TheOrderDetails', {
          orderId: this.$route.query.id
        })
        .then(res => {
          let data = res.data
          let creat_time = data.data.create_time
          Object.assign(this.pay_methods, data.data)
          store.state.pay_methods.actual_price = data.data.actual_price

          // 查询支付方式数据
          this.$axios
            .post('innerService/getPaymentList', {
              orderId: this.$route.query.id,
              orderMoney: this.pay_methods.actual_price,
              payPermission: 9
            })
            .then(res => {
              let data = res.data
              Object.assign(this.rate_data, data.data)

              // 剩余支付时间
              let over_time = creat_time + 900000
              this.timer = setInterval(() => {
                let current_time = new Date().getTime()
                this.min = parseInt((over_time - current_time) / 1000 / 60)
                this.sec = parseInt(((over_time - current_time) / 1000) % 60)
                if (this.min <= 9) {
                  this.min = '0' + this.min
                }
                if (this.sec <= 9) {
                  this.sec = '0' + this.sec
                }
                if (current_time <= over_time) {
                  this.surplus_time = this.min + ':' + this.sec
                } else {
                  this.surplus_time = '00:00'
                  clearInterval(this.timer)
                }

                if (this.surplus_time <= '00:00') {
                  // 取消订单
                  this.$axios
                    .post('innerService/CancelTheOrder', {
                      orderId: this.$route.query.id
                    })
                    .then(res => {})
                    .catch(err => {
                      console.error(err)
                    })
                  this.over_timer = setTimeout(() => {
                    this.toast.error(this.select_pay_method.overtime)
                    this.$router.push('/submit_order')
                  }, 1000)
                }
              }, 1000)

              // 默认支付方式
              this.active_index = this.rate_data.paymentList.findIndex(
                item => item.pay_type == 'balancepay'
              )
              if (
                this.rate_data.paymentList[this.active_index].accountBalance <
                this.pay_methods.actual_price
              ) {
                let pay_type = window.localStorage.getItem('pay_type')
                  ? window.localStorage.getItem('pay_type')
                  : ''
                if (pay_type && pay_type != 'balancepay') {
                  this.active_index = this.rate_data.paymentList.findIndex(
                    item => item.pay_type == pay_type
                  )
                } else {
                  if (this.active_index > 0) {
                    this.active_index = 0
                  } else {
                    this.active_index = 1
                  }
                }
              }
              this.pay_method_params.paymentId = this.rate_data.paymentList[
                this.active_index
              ].id
              this.pay_method_params.pay_type = this.rate_data.paymentList[
                this.active_index
              ].pay_type
            })
            .catch(err => {
              console.error(err)
            })
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 在线支付按钮
    select_inline_pay() {
      this.is_cash_on_delivery = false
      this.is_inline_pay = true
    },

    // 货到付款按钮
    select_cash_on_delivery() {
      this.is_cash_on_delivery = true
      this.is_inline_pay = false
    },

    // 选择支付方式(在线支付)
    check_pay_method(index) {
      this.active_index = index
      this.pay_method_params.paymentId = this.rate_data.paymentList[index].id
      this.pay_method_params.pay_type = this.rate_data.paymentList[
        index
      ].pay_type
    },
    pswPay(password) {
      this.$axios
        .post('/innerService/balancePaymentOrder', {
          moneyPassword: password,
          payOrderNo: this.payOrderNo
        })
        .then(res => {
          if (res.data.code === 1) {
            this.toast.success(res.data.message)
            this.$router.push('/order')
          } else if (res.data.code === 30050) {
            this.toast.error(res.data.message)
            this.$refs.pay.reset()
          } else if (res.data.code === 1590) {
            MessageBox.confirm('', {
              message: this.living_payment.psd_lock,
              title: '',
              confirmButtonText: this.living_payment.switch_payment,
              cancelButtonText: this.living_payment.forget_password,
              confirmButtonClass: 'confirm-button',
              cancelButtonClass: 'cancel-button'
            })
              .then(action => {
                console.log(action)
                if (action == 'confirm') {
                  this.$refs.pay.closeMotal()
                }
              })
              .catch(err => {
                console.log(err)
                if (err == 'cancel') {
                  console.log(err)
                  this.$router.push({
                    path: '/set_payment',
                    query: {
                      num: this.userInformation.memberObj.paymentpwdFlag,
                      url: this.$route.fullPath
                    }
                  })
                }
              })
          }
        })
    },

    // 判断是否可以货到付款
    cashOnDelivery() {
      store
        .dispatch('cashOnDelivery', {
          orderId: this.$route.query.id
        })
        .then(res => {
          Object.assign(store.state.cashOnDelivery, res.data.data)
          this.cannot_cash_on_delivery = !this.cashOnDelivery_msg.verify
        })
    },

    // 货到付款支付方法
    orderCodSalesSetting() {
      store
        .dispatch('orderCodSalesSetting', {
          orderId: this.$route.query.id
        })
        .then(res => {
          if (res.data.code == 1) {
            this.$router.push({
              path: '/cash_on_delivery_success',
              query: {
                id: this.$route.query.id
              }
            })
          }
        })
    },
    // 支付
    pay_btn() {
      if (this.btnState) {
        this.btnState = false
        setTimeout(() => {
          this.btnState = true
        }, 3000)
        window.localStorage.setItem('pay_type', this.pay_method_params.pay_type)
        let openId = localStorage.getItem('openId')
        // 获取订单状态
        this.$axios
          .post('innerService/TheOrderDetails', {
            orderId: this.$route.query.id
          })
          .then(res => {
            if (res.data.data.order_status != 0) {
              this.$toast.error(this.select_pay_method.paid)
              this.$router.push('/order')
            } else {
              if (this.pay_method_params.pay_type == 'zfb') {
                // 支付宝支付
                location.href = `https://dev.loong.ph/waimai/innerService/zfbPayOrder?paymentId=${
                  this.pay_method_params.paymentId
                }&payOrderType=2&orderId=${this.$route.query.id}&device=4`
              } else if (this.pay_method_params.pay_type == 'wx') {
                // 微信支付
                // location.href = `https://dev.hzxindakeji.com/waimai/innerService/wxPayOrder?paymentId=${
                //   this.pay_method_params.paymentId
                //   }&payOrderType=2&orderId=${this.$route.query.id}&device=6&openId=${openId}`;
                var params = {
                  paymentId: this.pay_method_params.paymentId,
                  payOrderType: 2,
                  orderId: this.$route.query.id,
                  device: 6,
                  openId: openId
                }
                this.$axios
                  .get('/innerService/wxPublicPayOrder', { params })
                  .then(res => {
                    let data = res.data.data
                    console.log(data)
                    function onBridgeReady() {
                      console.log('data', data.appid)
                      WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        {
                          appId: data.appid, //公众号名称，由商户传入
                          timeStamp: data.timestamp, //时间戳，自1970年以来的秒数
                          nonceStr: data.noncestr, //随机串
                          package: `prepay_id=${data.prepayid}`,
                          signType: 'MD5', //微信签名方式：
                          paySign: data.sign //微信签名
                        },
                        function(res) {
                          // alert(res.err_msg)
                          if (res.err_msg == 'get_brand_wcpay_request:ok') {
                            location.href =
                              'https://www.hzxindakeji.com/wechat/order'
                            // 使用以上方式判断前端返回,微信团队郑重提示：
                            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                          } else if (
                            res.err_msg == 'get_brand_wcpay_request:fail'
                          ) {
                            console.log(res)
                          }
                        }
                      )
                    }
                    if (typeof WeixinJSBridge == 'undefined') {
                      if (document.addEventListener) {
                        document.addEventListener(
                          'WeixinJSBridgeReady',
                          onBridgeReady,
                          false
                        )
                      } else if (document.attachEvent) {
                        document.attachEvent(
                          'WeixinJSBridgeReady',
                          onBridgeReady
                        )
                        document.attachEvent(
                          'onWeixinJSBridgeReady',
                          onBridgeReady
                        )
                      }
                    } else {
                      onBridgeReady()
                    }
                  })
              } else if (this.pay_method_params.pay_type == 'balancepay') {
                if (this.userInformation.memberObj.paymentpwdFlag == 0) {
                  MessageBox.confirm('', {
                    title: '',
                    message: this.living_payment.no_set_psd,
                    showCancelButton: true,
                    cancelButtonText: this.living_payment.not_set_yet,
                    confirmButtonText: this.living_payment.set_now
                  }).then(action => {
                    this.$router.push({
                      path: '/set_payment',
                      query: {
                        num: this.userInformation.memberObj.paymentpwdFlag,
                        url: this.$route.fullPath
                      }
                    })
                  })
                } else {
                  let params = {
                    paymentId: this.pay_method_params.paymentId,
                    payOrderType: 2,
                    orderId: this.$route.query.id,
                    device: 4
                  }
                  this.$axios
                    .post('/innerService/addPayOrder', params)
                    .then(res => {
                      console.log(res.data)
                      if (res.data.code === 1) {
                        this.payOrderNo = res.data.data
                        this.$refs.pay.open()
                      } else if (res.data.code === 1590) {
                        this.toast.error(res.data.message)
                      }
                    })
                }
              } else if (this.pay_method_params.pay_type == 'iPay88') {
                location.href = `https://dev.loong.ph/waimai/innerService/iPay88PayOrder?paymentId=${
                  this.pay_method_params.paymentId
                }&payOrderType=2&orderId=${this.$route.query.id}&device=3`
              }
              // TODO 公众号deviceID = 6, openID
            }
          })
          .catch(err => {
            alert('err:' + err)
          })
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    clearTimeout(this.over_timer)
    clearInterval(this.orderdetail_timer)
  }
}
</script>

<style lang="scss" scoped type="text/css">
body {
  -webkit-overflow-scrolling: auto;
  overflow-scrolling: auto;
}

.select_pay_method {
  height: 100%;
}

.phoneHeader {
  position: absolute;
  width: 100%;
  height: 7%;
  top: 0;
  z-index: 1;
}

.bg_box {
  width: 100%;
  height: 15vh;
  background: url(../../assets/images/order_details_header_bg.png);
  position: absolute;
  z-index: -1;
}

.zhanwei_box {
  width: 100%;
  height: 50px;
}

.pay_container_body {
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.pay_container {
  width: 100%;
  height: 100%;
}

.clearFloat:after {
  content: '';
  clear: both;
  display: block;
}

.pay_detail {
  width: 100%;
  background: white;
  margin: auto;
  margin-top: 0.4rem;
  margin-bottom: 10px;
  padding: 0.4rem;
  border-radius: 5px;
}

.pay_amount_title {
  font-size: 16px;
}

.pay_detail .pay_time_contain {
  width: 100%;
  font-size: 16px;
}

.pay_detail .pay_time_contain span {
  margin-left: 0.4rem;
  font-size: 14px;
  color: #ccc;
}

.pay_detail p {
  text-align: center;
  color: #666666;
}

.pay_detail .pay_amount {
  font-size: 18px;
  color: #ccc;
  margin-top: 0.4rem;
  font-size: 26px;
  color: #ff644d;
}

.pay_detail .pay_amount span {
  float: right;
  font-size: 36px;
  color: #333;
}

.surplus_pay_time_box {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.surplus_pay_time_img {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}

.surplus_pay_time {
  font-size: 16px;
  color: #666666;
}

.surplus_pay_time_img img {
  width: 100%;
  height: 100%;
}

.select_paymethod_btn {
  width: 100%;
  margin: auto;
  margin-bottom: 10px;
  padding: 0 0 0 0.4rem;
}

.paymethod_title {
  float: left;
  height: 30px;
  display: flex;
  align-items: center;
}

.inline_pay_btn,
.cash_on_delivery_btn {
  float: right;
  border: 1px solid #ff5d48;
  border-radius: 4px;
  color: #ff5d48;
  margin-right: 0.4rem;
  text-align: center;
  min-width: 2.5rem;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cannot_cash_on_delivery_icon {
  float: right;
  margin-right: 0.4rem;
  border: 0;
  height: 30px;
  display: flex;
  align-items: center;
}

.cannot_cash_on_delivery_icon img {
  width: 15px;
  height: 15px;
}

.cannot_cash_on_delivery {
  border: 1px solid #999999;
  color: #999999;
}

.active_btn {
  float: right;
  background: #ff5d48;
  border: 1px solid #ff5d48;
  border-radius: 4px;
  color: #ffffff;
}

.pay_method_select {
  width: 100%;
  background: white;
  margin: auto;
  margin-bottom: 30px;
  padding: 20px 10px 0 10px;
}

.pay_method_select p {
  width: 100%;
  margin-bottom: 10px;
}

.parities {
  color: #ff644d;
  font-size: 14px;
}

.cash_on_delivery_body {
  width: 100%;
  background: white;
  margin: auto;
  margin-bottom: 30px;
  padding: 20px 10px;
}

.cash_on_delivery_title {
  color: #333333;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid #ededed;
  margin-bottom: 0.4rem;
}

.hint_content_box {
  width: 100%;
}

.cash_on_delivery_body .hint_num {
  color: #666666;
  float: left;
  width: 0.6rem;
}

.cash_on_delivery_body .hint_content {
  color: #666666;
  width: 9.9rem;
  float: left;
}

.cash_on_delivery_body .hint_content:last-child {
  margin-bottom: 0.4rem;
}

.cash_on_delivery_body p {
  color: #666666;
}

.pay_btn {
  width: 99%;
  height: 44px;
  border-radius: 5px;
  background: #ff644d;
  color: white;
  text-align: center;
  line-height: 44px;
  margin: auto;
  margin-bottom: 60px;
}

.pay_method_list_body {
  width: 100%;
  margin-top: 20px;
}

.pay_method_list_box {
  position: relative;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid gainsboro;
}

.no_pay_amount {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: #fff;
  height: 35px;
  opacity: 0.5;
  margin-top: 20px;
}

.pay_method_list {
  width: 100%;
  height: 35px;
}

.pay_checkbox {
  width: 25px;
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 10px;
  float: left;
}

.pay_checkbox img {
  width: 25px;
  height: 25px;
  display: none;
}

.check_bg {
  width: 25px;
  height: 25px;
  background: url('../../assets/icons/icon_choose@2x.png') no-repeat;
  background-size: 100% 100%;
}

.pay_checkbox .checked {
  background: url('../../assets/icons/icon_chosen@2x.png') no-repeat;
  background-size: 100% 100%;
}

.pay_method_icon {
  float: left;
  width: 35px;
  height: 35px;
  margin-right: 15px;
}

.pay_method_icon img {
  width: 100%;
  height: 100%;
}

.pay_method_content {
  float: left;
  height: 100%;
  display: flex;
  align-items: center;
}

.pay_account {
  float: right;
  height: 100%;
  display: flex;
  align-items: center;
  color: #ff644d;
}

.order_failed_task {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.3;
}

.order_failed_pop {
  width: 80%;
  background: white;
  position: absolute;
  z-index: 9999;
  top: 20%;
  left: 10%;
  border-radius: 8px;
}

.order_failed_title {
  width: 100%;
  padding: 0.4rem 0;
  background: #ff5d48;
  border-radius: 8px 8px 0 0;
  color: #ffffff;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.order_failed_body {
  width: 100%;
  padding: 0.8rem 0.4rem;
}

.order_failed_body ul {
  margin-left: 0.4rem;
}

.order_failed_body li {
  list-style: disc;
  color: #f7b75e;
  line-height: 25px;
}

.order_failed_body span {
  list-style: disc;
  color: #666666;
}

.know_btn_box {
  margin-top: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.know_btn {
  padding: 0.2rem 0.4rem;
  background: #ff5d48;
  color: #ffffff;
  display: flex;
  align-items: center;
}

.know_btn_icon {
  float: left;
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 0.2rem;
}

.know_btn_icon img {
  width: 100%;
  height: 100%;
}

.know_btn_txt {
  float: left;
  font-size: 16px;
}

@media screen and(max-width: 329px) {
  .pay_btn {
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: 0.1rem;
  }
}
</style>
