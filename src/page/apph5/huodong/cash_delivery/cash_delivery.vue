<template>
  <div class="cash_bg">
    <div style="overflow-y:auto;">
      <div class="subsidy_box" :class="{'act':lang=='en'}">
        <div class="rules_content" v-if="lang=='zh'">
          <div class="title_box">
            <div class="title">货到付款说明</div>
          </div>
          <div class="rules_content_body">
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">1</span>
              </span>货到付款订单请与骑手线下结算，结算金额为订单应付金额。
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">2</span>
              </span>如有骑手索要小费，可拨打客服电话投诉。
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">3</span>
              </span>请核对配送信息并准备好零钱方便线下结算。
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">4</span>
              </span>当没有零钱进行支付时，可与配送员沟通将零钱存入余额。
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">5</span>
              </span>货到付款订单由快鸟进行配送，其它配送方式暂不支付货到付款。
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">6</span>
              </span>货到付款订单如因顾客原因恶意取消，平台有权冻结其账号。
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">7</span>
              </span>如有任何疑问，请与龙外卖官方客服联系。
            </p>
          </div>
        </div>
        <div class="rules_content" v-if="lang=='en'">
          <div class="title_box">
            <div class="title"> COD payment details</div>
          </div>
          <div class="rules_content_body">
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">1</span>
              </span>COD order shall be paid to the rider by the customer on the spot. And the payment amount will be the bill amount.
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">2</span>
              </span>IF the rider asks for tip, you can complain to our customer service.
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">3</span>
              </span>Please check delivery status and prepare your exact amount for your payment.
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">4</span>
              </span>On the case that you have no change available, you can talk to the rider and the rider will deposit your change into your account.
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">5</span>
              </span> COD payment order is only available for Instabird delivery. Other delivery is not available for COD payment.
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">6</span>
              </span>If customer cancelled the COD payment order for some bad intentions, our platform reserves the right to freeze his/her account.
            </p>
            <p>
              <span class="cash-icon">
                <span style="margin-left:5px;">7</span>
              </span>Any questions, please contact our Loong Delivery customer service.
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
  </div>
</template>

<script>
import { getCookie } from '@/utils/cookies'
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
.cash_bg {
  background: #fce460;
  width: 100%;
  height: 100vh;
  overflow: auto;
  .subsidy_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      width: 100%;
    }
    background: url('../../../../assets/images/cash_delivery_bg1.jpg') no-repeat;
    background-size: 100% auto;
    position: relative;
    &.act {
      background: url('../../../../assets/images/cash_delivery_bg_en1.jpg')
        no-repeat;
      background-size: 100% auto;
    }
    .rules_content {
      width: 92%;
      background: rgb(254, 245, 202);
      padding: 2% 5% 3% 5%;
      margin: 41% auto 0 auto;
    }
    .rules_content_body {
      padding-top: 20px;
    }
    .rules_content p {
      line-height: 22px;
      margin-bottom: 8px;
      font-size: 12px;
      color: rgb(68, 66, 53);
      .cash-icon {
        display: inline-block;
        background: url('../../../../assets/images/cash_icon.png') no-repeat;
        width: 20px;
        // height: 21px;
        line-height: 17px;
        background-size: 100% auto;
        color: #fff;

        margin-right: 3px;
        span {
          font-size: 12px;
        }
      }
    }

    .title_box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -25px;
    }

    .title_box .title {
      background: rgb(254, 77, 35);
      color: #fff;
      padding: 10px 25px;
      border-radius: 5px;
      font-size: 15px;
    }

    .qr_code {
      margin: 6% 0 0.5% 0;
      text-align: center;

      img {
        width: 24.3%;
      }
    }

    .qr_code_content {
      font-size: 12px;
      color: rgb(68, 66, 53);
      text-align: center;
    }

    .qr_code_bottom {
      color: rgb(68, 66, 53);
      text-align: center;
      font-size: 12px;
      padding: 2% 0;
    }
  }
}
</style>
