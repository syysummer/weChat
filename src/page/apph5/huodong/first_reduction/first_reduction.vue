<template>
	<div class="first_reduction_box">
		<div class="top_content" :class="{isEnglish: lang=='en'}">
			<img src="../../../../assets/images/first_reduction_zh@2x.png" v-if="lang=='zh'">
			<img src="../../../../assets/images/first_reduction_en@2x.png" v-if="lang=='en'">
		</div>

		<div class="rules_content" v-if="lang=='zh'">
			<div class="title_box">
				<div class="title_line_left"></div>
				<div class="title_line_right"></div>
				<div class="title">活动规则</div>
			</div>
			<div class="rules_content_body">
				<p>
					1. 在活动期间内新用户可享用首单立减P88优惠；
				</p>
				<p>
					2. 每人仅享受一次优惠，不与其他的优惠活动同享；
				</p>
				<p>
					3. 单笔订单商品价格大于P88可使用优惠，超出部分用户自行支付；
				</p>
				<p>
					4. 单笔订单商品价格不超过P88用户仅需支付P0.01，配送费用自行承担；
				</p>
				<p>
					5. 同一ID，同一手机号，设备号，银行卡均视为同一用户；
				</p>
				<p>
					6. 一经发现任何违规、套现行为，将追回相关金额或者封停账号，且依法追究法律责任；
				</p>
				<p>
					7. 关于本活动的任何问题，请联系龙外卖客服。
				</p>
			</div>
		</div>

		<div class="rules_content" v-if="lang=='en'">
			<div class="title_box">
				<div class="title_line_left"></div>
				<div class="title_line_right"></div>
				<div class="title">Promo rules</div>
			</div>
			<div class="rules_content_body">
				<p>
					1. New users can enjoy the first single offer of P88 during the event period.
				</p>
				<p>
					2. Each person shall enjoy the discount only once, and cannot avail the same promo with other promotional activities offered by the Company.
				</p>
				<p>
					3. User can avail the promo if the single purchase is over P88, orders that with an exceeding amount shall be shouldered by users themselves.
				</p>
				<p>
					4. If the price of a single purchase is less than P88, youhave to pay P0.01 only, and shall be responsible for the delivery charge.
				</p>
				<p>
					5. The same ID, mobile phone number and devices serial number are all regarded as one user.
				</p>
				<p>
					6. Users shall be liable, compensate for any beaches such as illegal Cash-Out which causing loses of the Company which act will result to blocking of your account as well.
				</p>
				<p>
					7. For any questions about this promo, please contact thecustomer service of Loong Delivery.
				</p>
			</div>
		</div>
		<div class="qr_code">
			<img src="../../../../assets/images/meal_supplement_qrcode.png" v-if="lang=='zh'">
			<img src="../../../../assets/images/meal_supplement_qrcode_en.png" v-if="lang=='en'">
		</div>
		<div class="qr_code_content" v-if="lang=='zh'">
			关注龙外卖
		</div>
		<div class="qr_code_content" v-if="lang=='en'">
			Scan me with Facebook
		</div>
		<div class="bottom_content" v-if="lang=='zh'">
			本活动的最终解释权归龙外卖所有
		</div>
		<div class="bottom_content" v-if="lang=='en'">
			Loong Delivery reserves all rights for final explanation
		</div>
	</div>
</template>

<script>
import { getCookie } from '@/utils/cookies'
export default {
  name: 'meal_supplement',
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
.first_reduction_box {
  width: 100%;
  height: 100%;
  background: url('../../../../assets/images/first_reduction_bg@2x.png');
  background-size: 100% 100%;
  position: relative;
  padding-top: 16%;
  overflow: scroll;
}

.first_reduction_box .top_content {
  width: 79.6%;
  margin: 20% auto 10% auto;
}
.first_reduction_box .top_content.isEnglish {
  margin: 30% auto 10% auto;
}

.first_reduction_box .middle_img {
  width: 60%;
  margin: auto;
}

.first_reduction_box .rules_content {
  width: 91.9%;
  background: white;
  opacity: 0.8;
  border-radius: 5px;
  margin: auto;
  margin-bottom: 20px;
  margin-top: 15%;
  padding: 0.4rem;
  padding-bottom: 0.6rem;
  position: relative;
  top: 0px;
  color: #fc593b;
}

.first_reduction_box .rules_content p {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 2px;
  text-align: justify;
  color: #333333;
}

.first_reduction_box .title_line_left {
  position: absolute;
  width: 10%;
  height: 3px;
  left: 20%;
  background: #fc593b;
}

.first_reduction_box .title_line_right {
  position: absolute;
  width: 10%;
  height: 3px;
  right: 20%;
  background: #fc593b;
}

.first_reduction_box .title_box {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  padding-top: 18px;
  padding-bottom: 25px;
}

.first_reduction_box .title_box .title {
  width: 40%;
  text-align: center;
  align-items: center;
  position: absolute;
  left: 30%;
  font-size: 18px;
  top: 8px;
}

.first_reduction_box .qr_code {
  width: 24%;
  margin: 9% auto;
  margin-bottom: 5px;
  position: relative;
}

.first_reduction_box .qr_code_content {
  width: 100%;
  position: relative;
  text-align: center;
  font-size: 12px;
  color: white;
}
.first_reduction_box .bottom_content {
  width: 100%;
  margin-top: 5%;
  margin-bottom: 7%;
  text-align: center;
  font-size: 12px;
  color: white;
}
.first_reduction_box img {
  width: 100%;
  height: 100%;
}
</style>
