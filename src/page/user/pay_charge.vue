<template>
	<div class="pay-network">
		<div class="header">
			<publicHeader :title="living_payment.tel_charges"></publicHeader>
		</div>
		<div class="contain_content">
			<div class="electricity-des" v-if="language=='zh'">目前仅支持菲律宾号码充值，如输入错误信息将会导致话费充值延期或失败。</div>
			<div class="electricity-des" v-if="language=='en'">only Philippine number recharge is supported. If the error message is entered, the credit recharge will be postponed or failed.</div>
			<div class="charge-box">
				<div class="charge-num">
					<input type="text" v-model="phone" :placeholder="living_payment.please_phone_number" @keyup="phone_format" :maxlength="11">
					<!-- <img src="../../assets/icons/tel.png" alt="" v-if="!phone"> -->
				</div>
				<div class="notice-msg" v-if="supplierFlag">
					{{living_payment.own_carrier}}:{{this.supplierId}}
				</div>
				<div class="notice-msg" :class="{act:notice_msg}" v-else>
					{{notice_msg?notice_msg:living_payment.digits_starting}}
				</div>
			</div>
			<!-- <div class="operator-box" @click="select_operator">
        <div>{{operator?operator:living_payment.own_carrier}}</div>
        <i class="el-icon-arrow-down"></i>
      </div> -->
			<div class="account-box">
				<div class="account-title">{{living_payment.recharge_fee}}</div>
				<ul class="account-list">
					<li :class="{'act':selectedAccount==index&&phoneType==1}" v-for="(item,index) in chargeList" @click="select_account(index,item)">
						{{item.display_name}}P
						<p class="discount">{{living_payment.price}}:{{item.discount_amount}}P</p>
					</li>
				</ul>
			</div>
			<div class="account-box">
				<div class="account-title traffic">{{living_payment.traffic}}</div>
				<ul class="account-list">
					<li class="traffic-li" :class="{'act':selectedAccount==index&&phoneType==2}" v-for="(item,index) in flowList" @click="select_account(index,item)">{{item.display_name}}
						<p class="discount">{{living_payment.price}}:{{item.discount_amount}}P</p>
					</li>
				</ul>
			</div>
			<!-- <div class="need-account">
        <div>{{living_payment.price}}</div>
        <div class="act">{{discount_price}}P</div>
      </div>
      <div class="need-account">
        <div>{{living_payment.amounts_payable}}</div>
        <div class="act">￥{{exchangeAccount}}</div>
      </div> -->
			<div class="pay_method_select">
				<p>{{select_pay_method.payment_method}}</p>
				<p class="parities">{{$t('select_pay_method').parities}}:1P={{rate_data.exchangeRate}}CNY</p>
				<div class="pay_method_list_body">
					<!-- 支付方式数据 -->
					<div class="pay_method_list_box" v-for="(item, index) in rate_data.paymentList" :key="index">
						<div class="no_pay_amount" v-if="item.pay_type=='balancepay'&&item.accountBalance<discount_price"></div>
						<div class="pay_method_list clearFloat" @click="check_pay_method(index)">
							<div class="pay_checkbox">
								<div class="check_bg" :class="{checked: active_index == index}"></div>
							</div>
							<div class="pay_amount" v-if="item.pay_type=='wx'||item.pay_type=='zfb'">￥{{exchangeAccount}}</div>
							<div class="pay_amount" v-else>{{discount_price}}P</div>
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
			<div class="pay_btn" :class="{'act':phone=='' || notice_msg}" @click="pay_confirm">
				{{living_payment.pay_immediately}}
			</div>
		</div>
		<balance-pay @passwordPay="pswPay" ref="pay"></balance-pay>
		<!-- <mt-popup v-model="popupVisible" position="bottom">
      <div class="operator-pop">
        <div class="operator-button">
          <div class="cancel" @click="operator_cancel">{{living_payment.cancel}}</div>
          <div class="comfirm" @click="operator_comfirm">{{living_payment.carry_out}}</div>
        </div>
        <mt-picker :slots="operatorList" @change="onValuesChange" valueKey="lookupItemName"></mt-picker>
      </div>
    </mt-popup> -->
	</div>
</template>
<script>
import { MessageBox } from 'mint-ui'
import BalancePay from '@/components/balance-pay.vue'
import publicHeader from '../../components/public_header'
export default {
  data() {
    return {
      popupVisible: false,
      operator: '', //运营商名字
      supplierId: 'GLOBE', //运营商Id
      supplierFlag: false,
      phone: '0', //手机号码
      selectOperator: '',
      selectSupplierId: '',
      selectedAccount: 0, //默认选中值
      // operatorList: [
      //   {
      //     flex: 1,
      //     values: []
      //   }
      // ],
      accountList: [],
      chargeList: [], //话费充值列表
      flowList: [], //流量充值列表
      rate_data: {
        exchangeRate: '', //汇率金额
        orderTime: ''
      },
      active_index: 0, //默认支付选中值
      pay_method_params: {
        paymentId: '', //支付ID
        pay_type: '' //支付类型
      },
      notice_msg: '', //手机输入提示
      exchangeAccount: '', //金额￥
      discount_price: '', //优惠券
      rechargeAmount: '', //金额P
      phoneType: '', //1 话费充值 2流量充值
      ext_tag: '', //标识
      language: '',
      payOrderNo: '',
      userInformation: '',
      listFlag: false
    }
  },
  components: { publicHeader, BalancePay },
  async mounted() {
    this.language = getCookie('lang')
    this.userInformation = JSON.parse(
      window.localStorage.getItem('userInformation')
    )
    if (
      this.userInformation.globalCode &&
      this.userInformation.globalCode == '63'
    ) {
      if (this.userInformation.tel.substring(0, 1) == 0) {
        this.phone = this.userInformation.tel
      } else {
        this.phone = '0' + this.userInformation.tel
      }
      await this.get_phone()
    } else {
      await this.get_account_list()
    }
    // this.get_operator_list()
    setTimeout(() => {
      this.OrderDetails()
    }, 0)
    // this.$refs.pay.open()
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
  watch: {
    phone(newValue, oldValue) {
      if (newValue == '') {
        this.phone = 0
      }
    }
  },
  methods: {
    //选择运营商
    // onValuesChange(picker, values) {
    //   if (values[0]) {
    //     this.selectOperator = values[0].lookupItemName
    //     this.selectSupplierId = values[0].lookupItemCode
    //   }
    // },
    //获取话费，流量列表
    get_account_list() {
      this.$axios
        .post('/innerService/getRechargeAmountList', {
          supplier: this.supplierId
        })
        .then(res => {
          if (res.data.code == 1) {
            this.accountList = res.data.data
            this.selectedAccount = 0
            this.rechargeAmount = this.accountList[0].top_up_money
            this.discount_price = this.accountList[0].discount_amount
            this.exchangeAccount = this.accountList[0].moneyCNY
            this.ext_tag = this.accountList[0].ext_tag
            this.phoneType = this.accountList[0].type
            this.chargeList = this.accountList.filter(item => {
              return item.type == 1
            })
            this.flowList = this.accountList.filter(item => {
              return item.type == 2
            })
            if (this.listFlag) {
              if (
                this.pay_method_params.pay_type == 'balancepay' &&
                this.rate_data.paymentList[this.active_index].accountBalance <
                  this.discount_price
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
            }
          }
        })
    },
    //获取运营商
    get_operator_list() {
      // this.$axios
      //   .post('innerService/getTelcoList', {
      //     supplerLookup: 'configuration_phone'
      //   })
      //   .then(res => {
      //     if (res.data.code == 1) {
      //       // this.operatorList[0].values = res.data.data
      //       this.operator = res.data.data[0].lookupItemName
      //       this.supplierId = res.data.data[0].lookupItemCode
      //       this.get_account_list()
      //     }
      //   })
    },
    //限制长度
    limit_word(value, maxlength) {
      if (this[value].length > maxlength) {
        this[value] = this[value].substring(0, maxlength)
      }
    },
    //手机号码判断
    phone_format() {
      this.limit_word('phone', 11)
      let reg = /^[0][0-9]{10}$/
      if (this.phone.length != 11) {
        this.notice_msg = ''
        this.supplierFlag = false
        // this.notice_msg = this.living_payment.phone_incorrect
        return
      }
      // if (!reg.test(this.phone)) {
      //   this.notice_msg = this.living_payment.phone_supported
      //   return
      // }
      this.listFlag = true
      this.get_phone()
    },
    //验证电话号码
    async get_phone() {
      await this.$axios
        .post('innerService/checkPhone', {
          phone: this.phone
        })
        .then(res => {
          if (res.data.code == 1) {
            this.supplierFlag = res.data.data.list.length
            if (this.supplierFlag) {
              this.supplierId = res.data.data.supplier
              this.get_account_list()
            } else {
              this.notice_msg = this.living_payment.phone_supported
            }
          } else {
            this.toast.error(res.data.message)
          }
        })
    },
    //话费、流量金额切换
    select_account(index, item) {
      this.selectedAccount = index
      this.rechargeAmount = item.top_up_money
      this.discount_price = item.discount_amount
      this.exchangeAccount = item.moneyCNY
      this.ext_tag = item.ext_tag
      this.phoneType = item.type
      if (
        this.pay_method_params.pay_type == 'balancepay' &&
        this.rate_data.paymentList[this.active_index].accountBalance <
          this.discount_price
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
    // operator_cancel() {
    //   this.popupVisible = false
    // },
    // operator_comfirm() {
    //   this.popupVisible = false
    //   this.operator = this.selectOperator
    //   this.supplierId = this.selectSupplierId
    //   this.selectedAccount = 0
    //   this.get_account_list()
    // },
    // select_operator() {
    //   this.popupVisible = true
    // },
    //确认支付
    pay_confirm() {
      let reg = /^[0][0-9]{10}$/
      if (!this.phone) {
        this.toast.error(this.living_payment.mobile_empty)
        return
      }
      if (!reg.test(this.phone) || !this.supplierFlag) {
        this.toast.error(this.living_payment.phone_supported)
        return
      }
      if (!this.supplierId) {
        this.toast.error(this.living_payment.operator_empty)
        return
      }
      let className = this.language == 'en' ? 'act' : ''
      let chargeName =
        this.phoneType == 1
          ? this.living_payment.recharge_fee
          : this.living_payment.traffic
      let html = `<div class="confirm-order">
      <div class="confirm-order-title">${
        this.living_payment.please_check_order
      }</div>
      <div class="confirm-order-detail"><div class="confirm-order-row ${className}">${
        this.living_payment.cellphone_number
      }：</div><div class="confirm-order-data">${this.phone}</div></div>
      <div class="confirm-order-detail"><div class="confirm-order-row ${className}">${
        this.living_payment.operator
      }：</div><div class="confirm-order-data">${this.supplierId}</div></div>
      <div class="confirm-order-detail"><div class="confirm-order-row ${className}">${chargeName}：</div><div class="confirm-order-data">${
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
            //确认的回调
            //余额支付未设置支付密码
            // MessageBox.confirm('', {
            //   message:
            //     '您还未设置支付密码为了您的资金安全请设置支付密码后再进行余额支付',
            //   title: '',
            //   confirmButtonText: this.living_payment.determine,
            //   cancelButtonText: this.living_payment.cancel,
            //   confirmButtonClass: 'confirm-button',
            //   cancelButtonClass: 'cancel-button'
            // })
            //   .then(action => {
            //     if (action == 'confirm') {
            //     }
            //   })
            //   .catch(err => {
            //     if (err == 'cancel') {
            //       //取消的回调
            //     }
            //   })
            //支付
          }
        })
        .catch(err => {
          if (err == 'cancel') {
            //取消的回调
          }
        })
    },
    //获取支付方式
    OrderDetails() {
      this.$axios
        .post('/innerService/getPaymentList', {
          payPermission: 9
        })
        .then(res => {
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
    //切换支付方式
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
            this.$router.push('/charge_fee')
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
                      url: '/pay_charge'
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
        payOrderType: 3,
        phone: this.phone,
        supplierId: this.supplierId,
        extTag: this.ext_tag,
        orderMoney: this.rechargeAmount,
        preferentialPrice: this.discount_price,
        phoneType: this.phoneType,
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
        // location.href = `https://sit.loong.ph/waimai/innerService/wxPayOrder?paymentId=${
        //   this.pay_method_params.paymentId
        // }&payOrderType=3&phone=${params.phone}&supplierId=${
        //   params.supplierId
        // }&extTag=${params.extTag}&orderMoney=${
        //   params.orderMoney
        // }&preferentialPrice=${params.preferentialPrice}&device=5`
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
                      'https://www.hzxindakeji.com/wechat/charge_fee'
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
                url: '/pay_charge'
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
  .operator-pop {
    width: 100%;
    .operator-button {
      display: flex;
      justify-content: space-between;
      margin: 20px 20px 0 20px;
      color: #ff3633;
      font-size: 14px;
    }
    .operator-list {
      li {
        border-top: 1px solid #ededed;
        padding: 15px 0;
        text-align: center;
        color: #666666;
      }
      .active {
        color: #333333;
      }
    }
  }
  .contain_content {
    padding-top: 45px;
    overflow-y: auto;
    background: #fff;
    width: 100%;
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
    .charge-box {
      color: #999999;
      font-size: 14px;
      padding: 10px;
      border-bottom: 1px solid #ededed;
      .charge-num {
        display: flex;
        justify-content: space-between;
        align-items: center;
        input {
          border: none;
          font-size: 21px;
          // color: #dddddd;
          color: #333;
          width: 100%;
          &.act {
            color: #333;
          }
        }
        img {
          width: 40px;
          height: 41.6px;
        }
      }
      .notice-msg {
        font-size: 11px;
        color: #dddddd;
        margin-top: 3px;
      }
      .act {
        color: #ff3633;
      }
    }
    .operator-box {
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
  &.act {
    background: #dddddd;
  }
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
</style>
