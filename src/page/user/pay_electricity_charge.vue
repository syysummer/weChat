<template>
  <div class="pay-network">
    <div class="header">
      <publicHeader :title="living_payment.pay_electricity_bill"></publicHeader>
    </div>
    <div class="contain_content">
      <!-- <div class="electricity-des" v-if="language=='zh'">目前仅支持菲律宾电费缴纳，请填写的信息与账单一致，并于账单截至日期前3个工作日前提交。</div>
      <div class="electricity-des" v-if="language=='en'">Only support the Philippines, please inform the bill and submit it three working days before the bill closes.</div> -->
      <div class="account-num">
        <input type="text" :placeholder="living_payment.please_input_username" v-model="accountNum">
      </div>
      <div class="billing-num">
        <input type="text" :placeholder="living_payment.contact_number" v-model="contactNumber" :maxlength="11">
      </div>
      <div class="account-box">
        <div class="account-title">{{living_payment.pay_electricity_bill}}</div>
        <ul class="account-list">
          <li :class="{'act':selectedIndex==index}" v-for="(item,index) in electricityList" @click="select_account(index,item)">
            {{item.lookupItemName}}P
          </li>
        </ul>
      </div>
      <!-- <div class="account-money">
        <input type="text" :placeholder="living_payment.please_enter_amount" v-model="orderAccount" :maxlength="10" @keyup="get_account">
        <div>P</div>
      </div>
      <div class="deadline" @click="openPicker">
        <div>{{deadline?deadline:living_payment.please_due_date}}</div>
        <i class="el-icon-arrow-down"></i>
      </div>
      <mt-datetime-picker ref="picker_deadline" type="date" v-model="select_deadline" @confirm="handleConfirm">
      </mt-datetime-picker> -->
      <!-- <div class="pay-example" @click="go_page">
        {{living_payment.electricity_example}}
      </div> -->
      <!-- <div class="need-account">
        <div>{{living_payment.amounts_payable}}</div>
        <div class="act">￥{{exchangeAccount?exchangeAccount:0}}</div>
      </div> -->
      <div class="pay_method_select">
        <p>{{select_pay_method.payment_method}}</p>
        <p class="parities">{{$t('select_pay_method').parities}}:1P={{this.rate_data.exchangeRate}}CNY</p>
        <div class="pay_method_list_body">
          <!-- 支付方式数据 -->
          <div class="pay_method_list_box" v-for="(item, index) in rate_data.paymentList" :key="index">
            <div class="no_pay_amount" v-if="item.pay_type=='balancepay'&&item.accountBalance<rechargeAmount"></div>
            <div class="pay_method_list clearFloat" @click="check_pay_method(index)">
              <div class="pay_checkbox">
                <div class="check_bg" :class="{checked: active_index == index}"></div>
              </div>
              <div class="pay_amount" v-if="item.pay_type=='wx'||item.pay_type=='zfb'">￥{{exchangeAccount}}</div>
              <div class="pay_amount" v-else>{{rechargeAmount}}P</div>
              <div class="pay_method_icon">
                <img :src="item.logo" />
              </div>
              <div class="pay_method_content">
                <div>
                  {{item.paymentName}}
                  <p v-if="item.pay_type=='balancepay'" style="color:#999999;margin-bottom:0;">({{living_payment.available_balance}}:{{item.accountBalance}}P)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pay_btn" @click="pay_confirm">
        {{living_payment.pay_immediately}}
      </div>
      <!-- <div class="electricity-bottom" v-if="language=='zh'">温馨提示：目前龙外卖暂不受理逾期订单，请自行前往柜台缴费，敬请谅解。</div>
			<div class="electricity-bottom" v-if="language=='en'">Reminder: At present, Long Takeaway will not accept overdue orders, please go to the counter to pay the fee, please understand.</div> -->
    </div>
    <balance-pay @passwordPay="pswPay" ref="pay"></balance-pay>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'
import publicHeader from '../../components/public_header'
import BalancePay from '@/components/balance-pay.vue'
import { getCookie } from '../../utils/cookies'
import store from '../../store'
export default {
  name: 'pay_electricity',
  data() {
    return {
      accountNum: '',
      contactNumber: '',
      rechargeAmount: '',
      // orderAccount: store.state.electricity_list.orderAccount,
      // select_deadline: this.$formatDateTime(new Date(), 'ymd'),
      // deadline: store.state.electricity_list.deadline,
      rate_data: {
        exchangeRate: '',
        orderTime: ''
      },
      active_index: 0,
      pay_method_params: {
        paymentId: '',
        pay_type: ''
      },
      language: '',
      electricityList: [],
      selectedIndex: 0,
      extTag: '',
      payOrderNo: '',
      userInformation: '',
      exchangeAccount: ''
    }
  },
  components: { publicHeader, BalancePay },
  async mounted() {
    this.language = getCookie('lang')
    this.accountNum = window.localStorage.getItem('accountNum')
      ? window.localStorage.getItem('accountNum')
      : ''
    // if (getCookie('lang') == 'en') {
    //   document.getElementsByClassName(
    //     'mint-datetime-cancel'
    //   )[0].innerHTML = this.living_payment.cancel
    //   document.getElementsByClassName(
    //     'mint-datetime-confirm'
    //   )[0].innerHTML = this.living_payment.determine
    // }
    this.userInformation = JSON.parse(
      window.localStorage.getItem('userInformation')
    )
    if (
      this.userInformation.globalCode &&
      this.userInformation.globalCode == '63'
    ) {
      this.contactNumber = this.userInformation.tel
    }
    await this.get_electricity_list()
    await this.OrderDetails()
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
    // exchangeAccount() {
    //   // let regAccount = /^(\d{1,10}|\d{1,9}\.\d{1}|\d{1,8}\.\d{2})$/
    //   let regAccount = /^(\d{1,10}|([0-9]+\.[0-9]+))$/
    //   if (this.orderAccount && regAccount.test(this.orderAccount)) {
    //     return this.OrderDetails(this.orderAccount)
    //     // return (parseFloat(this.orderAccount) * changeRate).toFixed(2)
    //   } else {
    //     return ''
    //   }
    // }
  },
  methods: {
    // go_page() {
    //   store.state.electricity_list = {
    //     accountNum: this.accountNum,
    //     billingNum: this.billingNum,
    //     orderAccount: this.orderAccount,
    //     deadline: this.deadline,
    //     exchangeAccount: this.exchangeAccount
    //   }
    //   this.$router.push('/electricity_example')
    // },
    openPicker() {
      this.$refs.picker_deadline.open()
    },
    handleConfirm() {
      this.deadline = this.select_deadline
        ? this.$formatDateTime(this.select_deadline, 'ymd')
        : ''
    },
    limit_word(value, maxlength) {
      if (this[value].length > maxlength) {
        this[value] = this[value].substring(0, maxlength)
      }
    },
    select_account(index, item) {
      this.selectedIndex = index
      this.rechargeAmount = item.lookupItemName
      this.exchangeAccount = item.moneyCNY
      this.extTag = item.lookupItemCode
      if (
        this.pay_method_params.pay_type == 'balancepay' &&
        this.rate_data.paymentList[this.active_index].accountBalance <
          this.rechargeAmount
      ) {
        if (this.active_index > 0) {
          this.active_index = 0
        } else {
          this.active_index = 1
        }
      }
      this.pay_method_params.paymentId = this.rate_data.paymentList[
        this.active_index
      ].id
      this.pay_method_params.pay_type = this.rate_data.paymentList[
        this.active_index
      ].pay_type
    },
    get_electricity_list() {
      this.$axios
        .post('/innerService/getElectricityList', {
          electricityLookup: 'electricity_configuration'
        })
        .then(res => {
          if (res.data.code == 1) {
            this.electricityList = res.data.data
            this.rechargeAmount = this.electricityList[0].lookupItemName
            this.exchangeAccount = this.electricityList[0].moneyCNY
            this.extTag = this.electricityList[0].lookupItemCode
          }
        })
    },
    // get_account() {
    //   this.limit_word('orderAccount', 10)
    //   let regAccount = /^(\d{1,10}|([0-9]+\.[0-9]{1,8}))$/
    //   if (this.orderAccount && regAccount.test(this.orderAccount)) {
    //     var x = String(this.orderAccount).indexOf('.') + 1
    //     var y = String(this.orderAccount).length - x
    //     if (x > 0 && y >= 2) {
    //       this.orderAccount = Math.round(this.orderAccount * 100) / 100
    //     }
    //     setTimeout(() => {
    //       this.OrderDetails(this.orderAccount)
    //     }, 500)

    //     // return (parseFloat(this.orderAccount) * changeRate).toFixed(2)
    //   } else {
    //     this.exchangeAccount = ''
    //   }
    // },
    pay_confirm() {
      let reg = /^[0][9][0-9]{9}$/
      if (!this.accountNum) {
        this.toast.error(this.living_payment.please_input_username)
        return
      }
      if (!reg.test(this.contactNumber)) {
        this.toast.error(this.living_payment.contact_number)
        return
      }
      let className = this.language == 'en' ? 'act' : ''
      let html = `<div class="confirm-order">
      <div class="confirm-order-title">${
        this.living_payment.please_check_order
      }</div>
      <div class="confirm-order-detail"><div class="confirm-order-row ${className}">${
        this.living_payment.account_recharge
      }：</div><div class="confirm-order-data">${this.accountNum}</div></div>

      <div class="confirm-order-detail"><div class="confirm-order-row ${className}">${
        this.living_payment.tel
      }：</div><div class="confirm-order-data">${this.contactNumber}</div></div>

      <div class="confirm-order-detail"><div class="confirm-order-row ${className}">${
        this.living_payment.pay_electricity_bill
      }：</div><div class="confirm-order-data">${
        this.rechargeAmount
      }P</div></div>
    </div>`
      MessageBox.confirm('', {
        message: html,
        title: '',
        confirmButtonText: this.living_payment.determine,
        cancelButtonText: this.living_payment.cancel,
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      })
        .then(action => {
          if (action == 'confirm') {
            this.pay_btn()
          }
        })
        .catch(err => {
          if (err == 'cancel') {
            //取消的回调
          }
        })
    },
    OrderDetails(orderMoney = '') {
      let param = {
        payPermission: 9
      }
      if (orderMoney) {
        param.orderMoney = orderMoney
      }
      this.$axios.post('/innerService/getPaymentList', param).then(res => {
        let data = res.data
        this.rate_data = data.data
        // 默认支付方式
        this.active_index = this.rate_data.paymentList.findIndex(
          item => item.pay_type == 'balancepay'
        )
        if (
          this.rate_data.paymentList[this.active_index].accountBalance <
          this.rechargeAmount
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
            this.$router.push('/electricity_charge_fee')
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
                if (action == 'confirm') {
                  this.$refs.pay.closeMotal()
                }
              })
              .catch(err => {
                if (err == 'cancel') {
                  this.$router.push({
                    path: '/set_payment',
                    query: {
                      num: this.userInformation.memberObj.paymentpwdFlag,
                      url: '/pay_electricity_charge'
                    }
                  })
                }
              })
          }
        })
    },
    pay_btn() {
      let openId = localStorage.getItem('openId')
      let params = {
        paymentId: this.pay_method_params.paymentId,
        payOrderType: 4,
        accountNumber: this.accountNum,
        phone: this.contactNumber,
        orderMoney: this.rechargeAmount,
        extTag: this.extTag,
        device: this.pay_method_params.pay_type == 'wx' ? 6 : 4
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
                    location.href =
                      'https://www.hzxindakeji.com/wechat/electricity_charge_fee'
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
                num: this.userInformation.memberObj.paymentpwdFlag,
                url: '/pay_electricity_charge'
              }
            })
          })
        } else {
          this.$axios.post('/innerService/addPayOrder', params).then(res => {
            console.log(res.data)
            if (res.data.code === 1) {
              this.payOrderNo = res.data.data
              this.$refs.pay.open()
            } else if (res.data.code === 1590) {
              this.toast.error(res.data.message)
            }
          })
        }
      }
    }
  }
  // watch: {
  //   accountNum(newValue, oldValue) {
  //     if (newValue > 16) {
  //       this.accountNum = newValue.substring(0, 16)
  //     }
  //   },
  //   billingNum(newValue, oldValue) {
  //     if (newValue > 26) {
  //       this.billingNum = newValue.substring(0, 26)
  //     }
  //   },
  //   orderAccount(newValue, oldValue) {
  //     if (newValue > 10) {
  //       this.orderAccount = newValue.substring(0, 10)
  //     }
  //   }
  // }
}
</script>
<style scoped lang="scss">
.pay-network {
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
    // border-bottom: 1px solid #dddddd;
  }
  .contain_content {
    padding-top: 45px;
    background: #fff;
    width: 100%;
    overflow-y: auto;
    .account-box {
      padding: 0 15px;
      .account-title {
        &.traffic {
          margin-top: -10px;
        }
        font-weight: 700;
        color: #333333;
        font-size: 18px;
        padding: 15px 0;
      }
      .account-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-left: -4%;
        // justify-content: space-between;
        li {
          // width: 31.33%;
          flex: 0 0 29.3333%;
          margin-left: 4%;
          text-align: center;
          color: #666666;
          font-size: 22px;
          border: 1px solid #ffb9ae;
          border-radius: 4px;
          padding: 7px 0;
          margin-bottom: 10px;
          &.traffic-li {
            font-size: 13px;
          }
          .discount {
            font-size: 11px;
            color: #999999;
          }
        }
        .act {
          background: #ff644d;
          color: #ffffff;
          .discount {
            color: #ffffff;
          }
        }
      }
    }
    .deadline {
      color: #333333;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #ededed;
    }
    .electricity-des {
      color: #999999;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      padding: 15px;
      border-bottom: 6px solid #ededed;
    }
    .electricity-bottom {
      color: #999999;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      padding: 0 15px 15px 15px;
    }
    .account-num,
    .billing-num,
    .account-tel,
    .account-money {
      color: #999999;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      padding: 15px;
      border-bottom: 1px solid #ededed;
      input {
        border: none;
        width: 80%;
      }
    }

    .pay-example {
      padding: 15px;
      border-bottom: 1px solid #ededed;
      color: #5ba6ff;
      font-size: 14px;
      text-align: right;
    }
    .need-account {
      color: #333333;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      padding: 15px;
      border-bottom: 1px solid #ededed;
      .act {
        color: #ff644d;
      }
    }
  }
}
.pay_method_select {
  background: white;
  margin: auto;
  border-top: 6px solid #ededed;
  padding: 14px 0 0 15px; // height: 50%;
}

.pay_method_select p {
  width: 100%;
  margin-bottom: 10px;
  // font-size: 16px;
  &.parities {
    color: #ff644d;
    font-size: 12px;
  }
}

.pay_btn {
  width: 92%;
  height: 44px;
  border-radius: 5px;
  background: #ff644d;
  color: white;
  text-align: center;
  line-height: 44px;
  margin: 15px auto;
}

.pay_method_list_body {
  width: 100%;
}

.pay_method_list_box {
  position: relative;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid #ededed;
}
.pay_method_list_box:last-child {
  border-bottom: 1px solid #ededed;
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
.pay_account {
  float: right;
  height: 100%;
  display: flex;
  align-items: center;
  color: #ff644d;
}
</style>
