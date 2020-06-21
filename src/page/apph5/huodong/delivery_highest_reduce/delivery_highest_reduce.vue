<template>
	<div class="height_reduce_body_wrap">
		<div class="body_box" :class="{isEnglish: lang=='en'}">
			<div class="rules_content" v-if="lang=='zh'">
				<div class="title_box">
					<!-- <div class="title_line"></div> -->
					<div class="title">活动规则</div>
				</div>
				<div class="rules_content_body">
					<p>
						1. 活动期间顾客在龙外卖下单可享受正价商品满 500p最高减30p配送费，满1000最高减80P配送费，满2000最高减150p配送费，每天可享受一次，此优惠仅适用于选择快鸟专送的店铺；
					</p>
					<p>
						2. 每人每天（0点到24点之间）仅能享受三个档次中的其中一种优惠，配送费超出部分由用户自行承担；
						<p>
							3. 同一ID，同一手机号，设备号，支付方式均视为同一用户；
						</p>
						<p>
							4. 在参加活动过程中，如果出现作弊行为（如批量注册、恶意购买、虚假交易等）， 龙外卖将取消您本次活动订单，并有权取消您后续参与龙外卖任意活动权利，情节严重者将依法追究法律责任；
						</p>
						<p>
							5．龙外卖有权在法律法规允许的范围内修改本活动规则（包括但不限于延迟或提前 终止本活动等），并于龙外卖消息或其他相关方式通知后生效，敬请留意；
						</p>
						<p>
							6. 活动时间：2018.11.03-2018.12.12；
						</p>
						<p>
							7.如有任何疑问，请与龙外卖官方客服联系。
						</p>
				</div>
			</div>

			<div class="rules_content" v-if="lang=='en'">
				<div class="title_box">
					<!-- <div class="title_line"></div> -->
					<div class="title">Promo rules</div>
				</div>
				<div class="rules_content_body en">
					<p>
						1. During the activity, customers can enjoy discount on regular price items: up to P30 off on delivery fee with a purchase of P500; P80 for P1000; P150 for P2000. You can have the promo only once a day. This offer is only applicable to the Instabird delivery.
					</p>
					<p>
						2. Each of you can only select one discount among the three options every day (0:00-24:00).Customer should pay for the rest delivery fee except the deducted amount by themselves;
					</p>
					<p>
						3. You are considered as one user if the same ID, phone No, serial No, and payment method.
					</p>
					<p>
						4. If any fraudulences and deceptions appeared such as bulk registrations, ill-intention purchases and bogus transactions, Loong Delivery reserve the right to forfeit your order and your right to enjoy any promos in your future order. Serious offenders shall be investigated for legal responsibility according to law.
					</p>
					<p>
						5．Loong Delivery has the right to modify the rules of this activity (including but not limited to delay or pre-termination) within the limits of the laws and regulations. And the modifications will take effect upon releasing on Loong Delivery notification or other relative notifications.
					</p>
					<p>
						6. Validity: 2018.11.03-2018.12.12.
					</p>
					<p>
						7. For other concerns, kindly contact our customer service.
					</p>
				</div>
			</div>
			<div class="bottom">
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
.height_reduce_body_wrap {
  width: 100%;
  height: 100%;
  background-color: #fab234;
  overflow: scroll;
}

.height_reduce_body_wrap .body_box {
  width: 100%;
  /* height: 100%; */
  background: url('../../../../assets/images/delivery_higest_reduce_zh.jpg');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top;
  padding-top: 6.5rem;
}
.height_reduce_body_wrap .body_box.isEnglish {
  width: 100%;
  background: url('../../../../assets/images/delivery_higest_reduce_en.jpg');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top;
  padding-top: 6.5rem;
}

.height_reduce_body_wrap .rules_content {
  box-sizing: border-box;
  width: 95%;
  opacity: 0.7;
  background: #ffffff;
  border-radius: 5px;
  position: relative;
  margin: 0 auto;
  padding-bottom: 26px;
}

.height_reduce_body_wrap .rules_content .rules_content_body {
  width: 90%;
  margin: -5px auto;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #c37300;
  letter-spacing: 0;
  line-height: 24px;
}

.height_reduce_body_wrap .rules_content .rules_content_body.en p {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #c37300;
  margin-top: 0.1rem;
  letter-spacing: 0;
  text-align: justify;
  line-height: 24px;
}

.height_reduce_body_wrap .title_box {
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: relative;
}

.height_reduce_body_wrap .title_box .title {
  height: 50px;
  line-height: 50px;
  text-align: left;
  margin-left: 5%;
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #bf7900;
  letter-spacing: 0;
  background: #ffffff;
  z-index: 2;
}
.height_reduce_body_wrap .bottom {
  width: 100%;
  padding-top: 0.6rem;
}
.height_reduce_body_wrap .qr_code {
  width: 24%;
  margin: auto;
  position: relative;
  top: 0rem;
}

.height_reduce_body_wrap .qr_code_content {
  width: 100%;
  position: relative;
  top: 5px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
}

.height_reduce_body_wrap .footer {
  width: 100%;
  line-height: 40px;
  margin: 12px auto 5px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0;
}

.height_reduce_body_wrap img {
  width: 100%;
  height: 100%;
}
</style>
