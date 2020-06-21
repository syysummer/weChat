<template>
  <div class="network_detail">
    <div class="pay-dialog" v-if="modal_show">
      <div class=" delete-dialog" @click="madal_hide">
        <i class="el-icon-close"></i>
      </div>
      <div class="pay-madal-title">{{select_pay_method.payment_method}}</div>
      <div class="pay-madal-content">
        <div class="pay_method_list_body">
          <!-- 支付方式数据 -->
          <div class="pay_method_list_box" v-for="(item, index) in rate_data.paymentList" :key="index">
            <div class="no_pay_amount" v-if="item.pay_type=='balancepay'&&item.accountBalance<detail_list.orderMoney"></div>
            <div class="pay_method_list clearFloat" @click="check_pay_method(index)">
              <div class="pay_checkbox">
                <div class="check_bg" :class="{checked: active_index == index}"></div>
              </div>
              <div class="pay_amount" v-if="item.pay_type=='wx'||item.pay_type=='zfb'">￥{{detail_list.payMoney}}</div>
              <div class="pay_amount" v-else>{{detail_list.orderMoney}}P</div>
              <div class="pay_method_icon">
                <img :src="item.logo" />
              </div>
              <div class="pay_method_content">
                {{item.paymentName}}
                <p v-if="item.pay_type=='balancepay'" style="color:#999999;font-size:12px;">({{living_payment.available_balance}}:{{item.accountBalance}}P)</p>
              </div>
            </div>
          </div>
        </div>
        <div class="recharge" @click="pay_btn">{{living_payment.recharge}}</div>
      </div>

    </div>
    <div class="pay-modal" v-if="modal_show">
    </div>
    <div class="header">
      <publicHeader :title="living_payment.recharge_details" v-if='detail_list.payOrderType==3||detail_list.payOrderType==4'></publicHeader>
      <publicHeader :title="living_payment.payment_details" v-else></publicHeader>
    </div>
    <div class="contain_content">
      <div class="detail-order">
        <div class="price">{{detail_list.orderMoney}}P</div>
        <div class="order-cancel">{{detail_list.showStatus}}</div>
        <div class="handle-button" v-if="detail_list.payStatus==0">
          <div class="button-pay" @click="open_dialog">{{living_payment.pay}}</div>
          <div class="button-cancel" @click="cancel_order">{{living_payment.cancel_order}}</div>
        </div>
      </div>
      <ul class="detail-list">
        <li v-if="detail_list.payStatus==4 ||detail_list.payStatus==5 || detail_list.payStatus==6">
          <div>{{living_payment.payment_method}}</div>
          <div class="act">{{detail_list.paymentName}}</div>
        </li>
        <!-- 话费 -->
        <template v-if="detail_list.payOrderType==3">
          <li>
            <div>{{living_payment.cellphone_number}}</div>
            <div>{{detail_list.phone}}</div>
          </li>
          <li>
            <div>{{living_payment.operator}}</div>
            <div>{{detail_list.supplier}}</div>
          </li>
          <li>
            <div>{{living_payment.payment_amount}}</div>
           <div class="act" v-if="detail_list.payCurrency=='PHP'">{{detail_list.payMoney}}P</div>
            <div class="act" v-else>￥{{detail_list.payMoney}}</div>
          </li>
          <li>
            <div>{{living_payment.order_number}}</div>
            <div class="size-small">{{detail_list.payOrderNo}}</div>
          </li>
          <li>
            <div>{{living_payment.creation_time}}</div>
            <div class="size-small">{{detail_list.createTime?$formatDateTime(detail_list.createTime):''}}</div>
          </li>
        </template>
        <!-- 话费 -->

        <!-- 电费 -->
        <template v-if="detail_list.payOrderType==4">
          <li>
            <div>{{living_payment.payment_account}}</div>
            <div>{{detail_list.accountNumber}}</div>
          </li>
          <li>
            <div>{{living_payment.tel}}</div>
            <div>{{detail_list.phone}}</div>
          </li>
          <!-- <li>
            <div>{{living_payment.billing_deadline}}</div>
            <div class="size-small">{{detail_list.deadline?$formatDateTime(detail_list.deadline,'ymd'):''}}</div>
          </li> -->
          <li>
            <div>{{living_payment.payment_amount}}</div>
            <div class="act" v-if="detail_list.payCurrency=='PHP'">{{detail_list.payMoney}}P</div>
            <div class="act" v-else>￥{{detail_list.payMoney}}</div>
          </li>
          <li>
            <div>{{living_payment.order_number}}</div>
            <div class="size-small">{{detail_list.payOrderNo}}</div>
          </li>
          <li>
            <div>{{living_payment.creation_time}}</div>
            <div class="size-small">{{detail_list.createTime?$formatDateTime(detail_list.createTime):''}}</div>
          </li>
        </template>
        <!-- 电费 -->

        <!-- 网费 -->
        <template v-if="detail_list.payOrderType==5">
          <li>
            <div>{{living_payment.operator}}</div>
            <div>{{detail_list.supplier}}</div>
          </li>
          <li>
            <div>{{living_payment.account_number}}</div>
            <div>{{detail_list.accountNumber}}</div>
          </li>
          <li>
            <div>{{living_payment.phone_number}}</div>
            <div>{{detail_list.phone}}</div>
          </li>
          <li>
            <div>{{living_payment.payment_amount}}</div>
            <div class="act" v-if="detail_list.payCurrency=='PHP'">{{detail_list.payMoney}}P</div>
            <div class="act" v-else>￥{{detail_list.payMoney}}</div>
          </li>
          <li>
            <div>{{living_payment.order_number}}</div>
            <div class="size-small">{{detail_list.payOrderNo}}</div>
          </li>
          <li>
            <div>{{living_payment.creation_time}}</div>
            <div class="size-small">{{detail_list.createTime?$formatDateTime(detail_list.createTime):''}}</div>
          </li>
        </template>
        <!-- 网费 -->

        <!-- 水费 -->
        <template v-if="detail_list.payOrderType==6">
          <li>
            <div>{{living_payment.operator}}</div>
            <div>{{detail_list.supplier}}</div>
          </li>
          <li>
            <div>{{living_payment.cellphone_number}}</div>
            <div>{{detail_list.phone}}</div>
          </li>
          <li>
            <div v-if="detail_list.supplier=='PRIMEWATER'">{{living_payment.reference_number}}</div>
            <div v-else>{{living_payment.account_name}}</div>
            <div>{{detail_list.billNumber}}</div>
          </li>
          <li>
            <div>{{living_payment.account_z}}</div>
            <div>{{detail_list.accountNumber}}</div>
          </li>
          <li>
            <div>{{living_payment.deadline}}</div>
            <div class="size-small">{{detail_list.deadline?$formatDateTime(detail_list.deadline,'ymd'):''}}</div>
          </li>
          <li>
            <div>{{living_payment.payment_amount}}</div>
            <div class="act" v-if="detail_list.payCurrency=='PHP'">{{detail_list.payMoney}}P</div>
            <div class="act" v-else>￥{{detail_list.payMoney}}</div>
          </li>
          <li>
            <div>{{living_payment.order_number}}</div>
            <div class="size-small">{{detail_list.payOrderNo}}</div>
          </li>
          <li>
            <div>{{living_payment.creation_time}}</div>
            <div class="size-small">{{detail_list.createTime?$formatDateTime(detail_list.createTime):''}}</div>
          </li>
        </template>
        <!-- 水费 -->
      </ul>
      <div v-if="detail_list.payStatus==0">
        <div class="prompt" v-if="language=='zh'">
          温馨提示：尊敬的客户，我们还未收到订单的款项，请您尽快支付。该订单会为您保留1小时（从下单时间算起），1小时之后如果还未付款，系统将自动关闭该订单。
        </div>
        <div class="prompt" v-if="language=='en'">
          Reminder: Dear customers, the order will be reserved for you for 1 hour, after 1 hour has not been paid, the order will be automatically closed.
        </div>
      </div>
    </div>
    <balance-pay @passwordPay="pswPay" ref="pay"></balance-pay>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'
import BalancePay from '@/components/balance-pay.vue'
import publicHeader from '../../../components/public_header'
import { getCookie } from '../../../utils/cookies'
export default {
  data() {
    return {
      start_time: '',
      end_time: '',
      modal_show: false,
      rate_data: {
        exchangeRate: '',
        orderTime: ''
      },
      language: getCookie('lang'),
      active_index: 0,
      pay_method_params: {
        paymentId: '',
        pay_type: ''
      },
      detail_list: [],
      exchangeAccount: '',
      payOrderNo: '',
      userInformation: ''
    }
  },
  components: { publicHeader, BalancePay },
  async created() {
    await this.get_detail_list()
    await this.OrderDetails()
  },
  mounted() {
    this.userInformation = JSON.parse(
      window.localStorage.getItem('userInformation')
    )
  },
  computed: {
    living_payment() {
      let living_payment = this.$t('living_payment')
      return living_payment
    },
    select_pay_method() {
      let select_pay_method = this.$t('select_pay_method')
      return select_pay_method
    }
  },
  methods: {
    get_detail_list() {
      this.$axios
        .get('/innerService/getLifePayCostByOrderNo', {
          params: { orderNo: this.$route.query.orderNo }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.detail_list = res.data.data
          }
        })
    },
    cancel_order() {
      MessageBox.confirm('', {
        message: this.living_payment.sure_order,
        title: '',
        confirmButtonText: this.living_payment.determine,
        cancelButtonText: this.living_payment.cancel,
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      })
        .then(action => {
          if (action == 'confirm') {
            //确认的回调
            this.$axios
              .post('/innerService/lifePayCostCancelOrder', {
                orderNo: this.$route.query.orderNo,
                payCostType: this.detail_list.payOrderType
              })
              .then(res => {
                this.toast.success(res.data.message)
                setTimeout(() => {
                  window.location.reload()
                }, 500)
              })
          }
        })
        .catch(err => {
          if (err == 'cancel') {
            //取消的回调
          }
        })
    },
    madal_hide() {
      this.modal_show = false
    },
    open_dialog() {
      this.modal_show = true
    },
    OrderDetails() {
      this.$axios
        .post('/innerService/getPaymentList', {
          payPermission: 9,
          orderMoney: this.detail_list.orderMoney
        })
        .then(res => {
          let data = res.data
          this.rate_data = data.data
          this.exchangeAccount = data.data.money
          // 默认支付方式
          this.active_index = this.rate_data.paymentList.findIndex(
            item => item.pay_type == 'balancepay'
          )
          if (
            this.rate_data.paymentList[this.active_index].accountBalance <
            this.detail_list.orderMoney
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
    },
    check_pay_method(index) {
      this.active_index = index
      this.pay_method_params.paymentId = this.rate_data.paymentList[index].id
      this.pay_method_params.pay_type = this.rate_data.paymentList[
        index
      ].pay_type
    },
    getUrl(params) {
      let url = ''
      Object.keys(params).forEach((value, index) => {
        url = url + value + '=' + params[value] + '&'
      })
      return url.substring(0, url.length - 1)
    },
    pswPay(password) {
      this.$axios
        .post('/innerService/balancePaymentOrder', {
          moneyPassword: password,
          payOrderNo: this.payOrderNo
        })
        .then(res => {
          console.log(res.data)
          if (res.data.code === 1) {
            this.toast.success(res.data.message)
            if (this.detail_list.payOrderType == 3) {
              this.$router.push('/charge_fee')
            } else if (this.detail_list.payOrderType == 4) {
              this.$router.push('/pay_electricity_charge')
            } else if (this.detail_list.payOrderType == 5) {
              this.$router.push('/network_fee')
            } else {
              this.$router.push('/water_fee')
            }
          } else if (res.data.code == 30050) {
            this.toast.error(res.data.message)
            this.$refs.pay.reset()
          } else if (res.data.code == 1590) {
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
                  this.$router.push({
                    path: '/set_payment',
                    query: {
                      num: this.userInformation.memberObj.paymentpwdFlag,
                      url: `/charge_detail${this.payOrderNo}`
                    }
                  })
                }
              })
          }
        })
    },
    // 支付
    pay_btn() {
      // 获取订单状态
      //网费
      let openId = localStorage.getItem('openId')
      let params = {}
      if (this.detail_list.payOrderType == 3) {
        //话费
        params = {
          paymentId: this.pay_method_params.paymentId,
          payOrderType: this.detail_list.payOrderType,
          payOrderNo: this.$route.query.orderNo,
          phone: this.detail_list.phone,
          supplierId: this.detail_list.supplier,
          extTag: this.detail_list.extTag,
          orderMoney: this.detail_list.orderMoney,
          preferentialPrice: this.detail_list.preferentialPrice,
          phoneType: this.detail_list.type,
          device: this.pay_method_params.pay_type == 'wx' ? 6 : 4
        }
      }
      //电费
      if (this.detail_list.payOrderType == 4) {
        params = {
          paymentId: this.pay_method_params.paymentId,
          payOrderType: this.detail_list.payOrderType,
          payOrderNo: this.$route.query.orderNo,
          orderMoney: this.detail_list.orderMoney,
          phone: this.detail_list.phone,
          extTag: this.detail_list.extTag,
          accountNumber: this.detail_list.accountNumber,
          device: this.pay_method_params.pay_type == 'wx' ? 6 : 4
        }
      }
      //网费
      if (this.detail_list.payOrderType == 5) {
        params = {
          paymentId: this.pay_method_params.paymentId,
          payOrderType: this.detail_list.payOrderType,
          payOrderNo: this.$route.query.orderNo,
          phone: this.detail_list.phone,
          supplierId: this.detail_list.supplier,
          extTag: this.detail_list.extTag,
          orderMoney: this.detail_list.orderMoney,
          accountNumber: this.detail_list.accountNumber,
          device: this.pay_method_params.pay_type == 'wx' ? 6 : 4
        }
      }
      //水费
      if (this.detail_list.payOrderType == 6) {
        params = {
          paymentId: this.pay_method_params.paymentId,
          payOrderType: this.detail_list.payOrderType,
          payOrderNo: this.$route.query.orderNo,
          phone: this.detail_list.phone,
          supplierId: this.detail_list.supplier,
          extTag: this.detail_list.extTag,
          orderMoney: this.detail_list.orderMoney,
          accountNumber: this.detail_list.accountNumber,
          billNumber: this.detail_list.billNumber,
          deadline: this.$formatDateTime(this.detail_list.deadline, 'ymd'),
          device: this.pay_method_params.pay_type == 'wx' ? 6 : 4
        }
      }
      if (this.pay_method_params.pay_type == 'wx') {
        params.openId = openId
      }
      let url_string = this.getUrl(params)
      window.localStorage.setItem('pay_type', this.pay_method_params.pay_type)
      if (this.pay_method_params.pay_type == 'zfb') {
        // 支付宝支付
        location.href = `https://dev.loong.ph/waimai/innerService/zfbPayOrder?${url_string}`
      } else if (this.pay_method_params.pay_type == 'wx') {
        // 微信支付
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
                  if (res.err_msg == 'get_brand_wcpay_request:ok') {
                    let baseUrl = 'https://www.hzxindakeji.com/wechat/'
                    this.detail_list.payOrderType == 3 &&
                      (baseUrl += 'charge_fee')
                    this.detail_list.payOrderType == 4 &&
                      (baseUrl += 'electricity_fee')
                    this.detail_list.payOrderType == 5 &&
                      (baseUrl += 'network_fee')
                    this.detail_list.payOrderType == 6 &&
                      (baseUrl += 'water_fee')
                    location.href = baseUrl
                    // 使用以上方式判断前端返回,微信团队郑重提示：
                    //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                  } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
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
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
              }
            } else {
              onBridgeReady()
            }
          })
      } else if (this.pay_method_params.pay_type == 'iPay88') {
        location.href = `https://dev.loong.ph/waimai/innerService/iPay88PayOrder?${url_string}`
      } else if (this.pay_method_params.pay_type == 'paypal') {
        this.$axios.post('/innerService/addPayOrder', params).then(res => {
          if (res.data.code === 1) {
            let aliplyHtml = res.data.data
            window.location.href = aliplyHtml
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
                num: this.userInformation.memberObj.paymentpwdFlag
              }
            })
          })
        } else {
          this.$axios.post('/innerService/addPayOrder', params).then(res => {
            console.log(res.data)
            if (res.data.code === 1) {
              this.payOrderNo = res.data.data
              this.madal_hide()
              this.$refs.pay.open()
            } else if (res.data.code === 1590) {
              this.toast.error(res.data.message)
            }
          })
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.pay_method_select {
  background: white;
  margin: auto;
  margin-bottom: 30px;
  padding: 20px 10px 0 10px; // height: 50%;
}

.pay_method_select p {
  width: 100%;
  margin-bottom: 10px;
}

.parities {
  color: #ff644d;
  font-size: 14px;
}

.pay_btn {
  width: 80%;
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
  float: right;
}

.pay_checkbox img {
  width: 25px;
  height: 25px;
  display: none;
}

.check_bg {
  width: 25px;
  height: 25px;
  background: url('../../../assets/icons/icon_choose@2x.png') no-repeat;
  background-size: 100% 100%;
}

.pay_checkbox .checked {
  background: url('../../../assets/icons/icon_chosen@2x.png') no-repeat;
  background-size: 100% 100%;
}

.pay_method_icon {
  float: left;
  width: 35px;
  height: 35px;
  margin-right: 15px;
}
.pay_amount {
  float: right;
  margin-right: 10px;
  font-size: 16px;
  color: #fb4e44;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
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
.pay_method_icon img {
  width: 100%;
  height: 100%;
}

.pay_method_content {
  float: left;
  height: 100%;
  // display: flex;
  // align-items: center;
}

.pay_account {
  float: right;
  height: 100%;
  display: flex;
  align-items: center;
  color: #ff644d;
}
.pay-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
  z-index: 2002;
}
.pay-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  background-color: #fff;
  width: 85%;
  border-radius: 3px;
  font-size: 16px;
  -webkit-user-select: none;
  // overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: 0.2s;
  transition: 0.2s;
  z-index: 2003;
  .delete-dialog {
    position: absolute;
    right: -18px;
    top: -23px;
    width: 35px;
    height: 35px;
    background: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 35px;
  }
  .pay-madal-title {
    padding: 17px;
  }
  .pay-madal-content {
    padding: 0 17px 0 17px;
    .recharge {
      background: #ff644d;
      border-radius: 4px;
      width: 100px;
      height: 30px;
      color: #fff;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      margin: 0 auto 18px auto;
    }
  }
}
.network_detail {
  height: 100%;
  background: #fff;
  top: 0;
  bottom: 0;
  .header {
    position: fixed;
    width: 100%;
    height: 45px;
    top: 0;
    z-index: 1;
    border-bottom: 1px solid #dddddd;
  }
  .contain_content {
    position: fixed;
    top: 7%;
    bottom: 0;
    background: #fff;
    width: 100%;
    .handle-button {
      display: flex;
      justify-content: space-around;
      padding-top: 25px;
      .button-pay {
        background: #ff644d;
        border-radius: 4px;
        width: 100px;
        height: 30px;
        color: #fff;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
      }
      .button-cancel {
        width: 100px;
        height: 30px;
        border-radius: 4px;
        color: #ff644d;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ff644d;
        background: #fff;
        font-size: 14px;
      }
    }
    .detail-order {
      padding: 25px 0;
      border-bottom: 1px solid #ededed;
      display: flex;
      flex-direction: column;
      .price {
        color: #ff644d;
        font-size: 17px;
        padding-bottom: 12px;
        font-weight: 700;
        text-align: center;
      }
      .order-cancel {
        color: #999999;
        font-size: 14px;
        text-align: center;
      }
    }
    .detail-list {
      margin: 0 15px;
      padding: 0 0 15px 0;
      border-bottom: 1px solid #ededed;
      li {
        color: #999999;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        padding-top: 15px;
      }
      .act {
        color: #333333;
      }
      .size-small {
        font-size: 11px;
      }
    }
    .prompt {
      color: #999999;
      font-size: 14px;
      margin: 15px;
      padding: 0 0 15px 0;
    }
  }
}
</style>
