<template>
  <div class="subsidy_bg">
    <div class="subsidy_box" :class="{'act':lang=='en'}">
      <div class="rules_content" v-if="lang=='zh'">
        <div class="title_box">
          <div class="title_line_left"></div>
          <div class="title_line_right"></div>
          <div class="title">活动规则</div>
        </div>
        <div class="rules_content_body">
          <p>
            1.在活动期间内每成交1笔订单，商家即可获得最高P200 的平台补贴;
          </p>
          <p>
            2:已成功送达且未产生投诉及退款的订单视为已成交订单;
          </p>
          <p>
            3.已成交订单预计收入如 ≥P1000 则可获取P200的订单补贴;
          </p>
          <p>
            4. 已成交订单预计收入如未达到P1000则按1.2倍计算补贴金额，如预计收入为 P100,则可获得 P20 的订单补贴;
          </p>
          <p>
            5.此活动的所有补贴金额由龙外卖平台承担;
          </p>
          <p>
            6. 在参加活动过程中，如果出现作弊行为(如批量注册、恶意购买、虚假交易等)，龙外卖将取消您本次活动订单，并有权取消您后续参与龙外卖任意活动权利，情节严重者将依法追究法律责任;
          </p>
          <p>
            7.龙外卖有权在法律法规允许的范围内修改本活动规则(包括但不限于延迟或提前终止本活动等)，并于龙外卖消息或其他相关方式通知后生效，敬请留意。
          </p>
          <p>
            8.如有任何疑问，请与龙外卖官方客服联系;
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
            1. The merchant will get discount up to P200 from the platform for each successful order during this
            activity;
          </p>
          <p>
            2. Order is considered as successful when it is delivered to customer without complains or refund.
          </p>
          <p>
            3. Merchant will get P200 allowance for order ≥ P1K.
          </p>
          <p>
            4. Order less than P1k will get allowance for 20% of the order amount. For example, your order amount is
            P100 and you will get P20 allowance.
          </p>
          <p>
            5. All the allowance for this activity is from Loong Delivery platform;
          </p>
          <p>
            6. If any fraudulences and deceptions appeared such as bulk registrations, ill-intention purchases and
            bogus transactions, Loong Delivery reserve the right to forfeit your order and your right to enjoy any
            promos in your future order. Serious offenders shall be investigated for legal responsibility according to
            law.
          </p>
          <p>
            7. Loong Delivery has the right to modify the rules of this activity (including but not limited to delay or
            pre-termination) within the limits of the laws and regulations. And the modifications will take effect upon
            releasing on Loong Delivery notification or other kind of notifications.
          </p>
          <p>
            8. For other concerns, kindly contact our customer service;
          </p>
        </div>
      </div>
      <div class="qr_code">
        <img src="../../../../assets/images/subsidy_code.png" v-if="lang=='zh'">
        <img src="../../../../assets/images/subsidy_code_en.png" v-if="lang=='en'">
      </div>
      <div class="qr_code_content" v-if="lang=='zh'">
        关注龙外卖
      </div>
      <div class="qr_code_content" v-if="lang=='en'">
        Scan me with Facebook
      </div>
      <div class="qr_code_bottom" v-if="lang=='zh'">
        本活动的最终解释权归龙外卖所有
      </div>
      <div class="qr_code_bottom" v-if="lang=='en'">
        Loong Delivery reserves all rights for final explanation.
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getCookie
  } from '@/utils/cookies'
  export default {
    name: 'transaction_subsidy',
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

<style lang="scss" scoped>
  .subsidy_bg {
    background: #fa8e23;
    width: 100%;
    height: 100%;

    .subsidy_box {
      width: 100%;
      height: 100%;
      background: url('../../../../assets/images/subsidy_bg.png') no-repeat;
      background-size: 100% auto;
      position: relative;
      overflow: scroll;

      &.act {
        background: url('../../../../assets/images/subsidy_bg_en.png') no-repeat;
        background-size: 100% auto;
      }

      .rules_content {
        width: 92%;
        background: white;
        border-radius: 14px;
        padding: 2% 5.6% 3% 5.6%;
        margin: 106% auto 0 auto;
      }

      .rules_content p {
        line-height: 25px;
        font-size: 13px;
        color: #8b572a;
      }

      .title_line_left {
        position: absolute;
        width: 10%;
        height: 3px;
        left: 20%;
        background: #8b572a;
      }

      .title_line_right {
        position: absolute;
        width: 10%;
        height: 3px;
        right: 20%;
        background: #8b572a;
      }

      .title_box {
        width: 100%;
        display: flex;
        align-items: center;
        position: relative;
        padding-top: 20px;
        padding-bottom: 8%;
      }

      .title_box .title {
        width: 40%;
        text-align: center;
        align-items: center;
        position: absolute;
        left: 30%;
        font-size: 17px;
        top: 8px;
        color: #8b572a;
      }

      .qr_code {
        margin: 1.7% 0 0.5% 0;
        text-align: center;

        img {
          width: 24.3%;
        }
      }

      .qr_code_content {
        font-size: 14px;
        color: #ffffff;
        text-align: center;
      }

      .qr_code_bottom {
        color: #ffffff;
        text-align: center;
        font-size: 12px;
        padding: 2% 0;
      }
    }
  }

</style>
