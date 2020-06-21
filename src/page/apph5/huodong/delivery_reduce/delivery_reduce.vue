<template>
	<div class="body_wrap">
		<div class="body_box">
			<div class="top_content">
				<img src="../../../../assets/images/title_zh@2x.png" v-if="lang=='zh'">
				<img src="../../../../assets/images/title_en@2x.png" v-if="lang=='en'">
			</div>

			<div class="rules_content" v-if="lang=='zh'">
				<div class="title_box">
					<div class="title_line"></div>
					<div class="title">活动规则</div>
				</div>
				<div class="rules_content_body">
					<p>
						1.活动期间内每天前1000名用户下单即可享受配送费立减P50的优惠，此优惠仅适用于选择快鸟专送的店铺;
					</p>
					<p>
						2.每人每天( 0点到24点之间 )仅享受一次优惠，可与其它优惠同享;
					</p>
					<p>
						3.配送费需大于等于 P50方可使用，超出部分由用户自行承担;
					</p>
					<p>
						4.同一 ID，同一手机号，设备号，支付方式均视为同一用户;
					</p>
					<p>
						5. 在参加活动过程中，如果出现作弊行为 (如批量注册、恶意购买、虚假交易等)， 龙外卖将取消您本次活动订单，并有权取消您后续参与龙外卖任意活动权利，情节严重者将依法追究法律责任;
					</p>
					<p>
						6.龙外卖有权在法律法规允许的范围内修改本活动规则(包括但不限于延迟或提前 终止本活动等)，并于龙外卖消息或其他相关方式通知后生效，敬请留意;
					</p>
					<p>
						7.活动时间: 2018.09.22-2018.12.1
					</p>
					<p>
						8.如有任何疑问，请与龙外卖官方客服联系
					</p>
				</div>
			</div>

			<div class="rules_content" v-if="lang=='en'">
				<div class="title_box">
					<div class="title_line"></div>
					<div class="title">Promo rules</div>
				</div>
				<div class="rules_content_body en">
					<p>
						1.The first 1K users can have P50 off on the first order everyday. This is only available for shops selected Instabird for delivery;
					</p>
					<p>
						2.Each person can enjoy this promo once only per day(00:00-24:00). It can be availed with other promos;
					</p>
					<p>
						3.It is applicable when the delivery fee is ≥P50. The excessing amount is borne by user;
					</p>
					<p>
						4.You are considered as one user if the same ID, phone No, serial No, and payment method;
					</p>
					<p>
						5. If any fraudulences and deceptions appeared such as bulk registrations, ill-intention purchases and bogus transactions, Loong Delivery reserve the right to forfeit your order and your right to enjoy any promos in your future order. Serious offenders shall be investigated for legal responsibility according to law;
					</p>
					<p>
						6．Loong Delivery has the right to modify the rules of this activity (including but not limited to delay or pre-termination) within the limits of the laws and regulations. And the modifications will take effect upon releasing on Loong Delivery notification or other relative notifications;
					</p>
					<p>
						7.Validity: 2018.09.22-2018.12.1
					</p>
					<p>
						8.For other concerns, kindly contact our customer service;
					</p>
				</div>
			</div>
			<div class="qr_code">
				<img src="../../../../assets/images/wechat_code@2x.png" v-if="lang=='zh'">
				<img src="../../../../assets/images/Facebook@2x.png" v-if="lang=='en'">
			</div>
			<div class="qr_code_content" v-if="lang=='zh'">
				关注龙外卖
			</div>
			<div class="qr_code_content" v-if="lang=='en'">
				Scan me with Facebook
			</div>
			<div class="footer" v-if="lang=='zh'">
				本活动最终解释权归龙外卖所有
			</div>
			<div class="footer" v-if="lang=='en'">
				Loong Delivery reserves all rights for final explanation
			</div>
		</div>
	</div>
</template>

<script>
import { getCookie } from '@/utils/cookies'
export default {
  name: 'delivery_reduce',
  data() {
    return {
      lang: ''
    }
  },
  mounted() {
    this.lang = this.$route.query.language
  },
  methods: {}
}
</script>

<style scoped>
.body_wrap {
  width: 100%;
  height: 100%;
  /*background-image: linear-gradient(46deg, #FF8F66 0%, #FF4E33 100%);*/
  background-color: #ff8f66;
}

.body_wrap .body_box {
  width: 100%;
  height: 100%;
  background: url('../../../../assets/images/house_bg@2x.png');
  background-size: 100% 90%;
  background-repeat: no-repeat;
  background-position: bottom;
  position: relative;
  overflow: scroll;
  padding-top: 16px;
}

.body_wrap .top_content {
  width: 93%;
  text-align: center;
  position: relative;
  margin-left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.body_wrap .top_content img {
  width: 100%;
}

.body_wrap .rules_content {
  box-sizing: border-box;
  width: 92%;
  opacity: 0.7;
  background: #ffffff;
  border-radius: 5px;
  margin: 0 auto;
  position: relative;
  padding-bottom: 26px;
  top: -15px;
}

.body_wrap .rules_content .rules_content_body {
  width: 90%;
  margin: -5px auto;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #333333;
  letter-spacing: 0;
  line-height: 32px;
}

.body_wrap .rules_content .rules_content_body.en p {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  margin-top: 0.1rem;
  letter-spacing: 0;
  text-align: justify;
  line-height: 24px;
}

.body_wrap .title_box {
  width: 100%;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  position: relative;
}

.body_wrap .title_box .title_line {
  width: 60%;
  height: 0.04rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fc593b;
  z-index: 0;
}

.body_wrap .title_box .title {
  width: 40%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: PingFangSC-Semibold;
  font-size: 17px;
  color: #fc593b;
  letter-spacing: 0;
  background: #ffffff;
  z-index: 2;
}

.body_wrap .qr_code {
  width: 24%;
  margin: auto;
  position: relative;
  top: 0px;
}

.body_wrap .qr_code_content {
  width: 100%;
  position: relative;
  top: 5px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
}

.body_wrap .footer {
  width: 100%;
  line-height: 40px;
  margin: 12px auto 5px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0;
}

.body_wrap img {
  width: 100%;
  height: 100%;
}
</style>
