<template>
  <div class="review_contain">
    <div class="current_header">
      <publicHeader :title="refund_details_lang.title" />
    </div>

    <div class="review_body">
      <!-- 取消流程 -->
      <div class="review_flow">
        <div class="review_title">
          {{refund_details_lang.refund_process}}
        </div>
        <div class="review_step">
          <!-- 申請取消訂單 -->
          <div class="el-step is-vertical" style="flex-basis: 33.3333%;">
            <div class="el-step__head" :class="{'is-finish': review_status==1}">
              <!-- 竖直线 -->
              <div class="el-step__line" style="margin-right: 0px;">
                <i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; height: 0%;"></i>
              </div>
              <!-- 原形图标 -->
              <div class="el-step__icon is-text" :class="{'is-finish': review_status==1}">
              </div>
            </div>
            <div class="el-step__main">
              <div class="el-step__title" :class="{'is-finish': review_status==1}">{{refund_details_lang.refund_initiated}}</div>
              <div class="el-step__description" v-if="first_create_time ">{{$formatDateTime(first_create_time)}}</div>
            </div>
          </div>
          <!-- 商家处理 -->
          <div class="el-step is-vertical" style="flex-basis: 33.3333%;">
            <div class="el-step__head" :class="{'is-finish': review_status==2}">
              <div class="el-step__line" style="margin-right: 0px;">
                <i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; height: 0%;"></i>
              </div>
              <div class="el-step__icon is-text" :class="{'is-finish': review_status==2}">
              </div>
            </div>
            <div class="el-step__main">
              <div class="el-step__title" :class="{'is-finish': review_status==2}">{{review_details.merchant_handling}}</div>
              <div class="el-step__description">{{$formatDateTime(first_create_time)}}</div>
            </div>
          </div>
          <!-- 平台审核 -->
          <div class="el-step is-vertical" style="flex-basis: 33.3333%;">
            <div class="el-step__head" :class="{'is-finish': review_status==3}">
              <div class="el-step__line" style="margin-right: 0px;">
                <i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; height: 0%;"></i>
              </div>
              <div class="el-step__icon is-text" :class="{'is-finish': review_status==3}">
              </div>
            </div>
            <div class="el-step__main">
              <div class="el-step__title" :class="{'is-finish': review_status==3}">{{review_details.platform_audit}}</div>
              <div class="el-step__description" v-if="second_create_time">{{$formatDateTime(second_create_time)}}</div>
            </div>
          </div>
          <!-- 订单取消成功 -->
          <div class="el-step is-vertical" style="flex-basis: 33.3333%;">
            <div class="el-step__head">
              <div class="el-step__line" style="margin-right: 0px;">
                <i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; height: 0%;"></i>
              </div>
              <div class="el-step__icon is-text" :class="{'is-finish': review_status==4}">
              </div>
            </div>
            <div class="el-step__main last">
              <div class="el-step__title" :class="{'is-finish': review_status==4}">{{refund_details_lang.refund_finish}}</div>
              <div class="el-step__description last" v-if="third_create_time">{{$formatDateTime(third_create_time)}}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="order_info">
        <div class="review_title">
          {{refund_details_lang.orderInfo}}
        </div>
        <div class="order_details_box">
          <div class="label">{{refund_details_lang.refund_amount}}</div>
          <div class="content" style="color:#FF644C;">{{refund_details_data.orderMap.actualPrice}}P</div>
        </div>
        <div class="order_details_box">
          <div class="label">{{refund_details_lang.refund_method}}</div>
          <div class="content">
            <span>{{refund_details_lang.refund_method_msg}}</span>
          </div>
        </div>
        <div class="order_details_box">
          <div class="label">{{refund_details_lang.order_number}}</div>
          <div class="content">{{order_details.id}}</div>
        </div>
        <div class="order_details_box">
          <div class="label">{{refund_details_lang.amount_paid}}</div>
          <div class="content">{{order_details.actual_price}}P</div>
        </div>
      </div>

      <!-- 其它 -->
      <div class="other_info">
        <div class="review_title">
          {{refund_details_lang.review_others}}
        </div>
        <div class="review_cancel_reason">
          <div class="label">{{refund_details_lang.refund_eason}}</div>
          <div class="content">{{cancel_reason}}</div>
        </div>
        <div class="review_supplement">
          <div class="label"> {{review_details.review_supplement}}</div>
          <div class="content">{{supplement_content}}</div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import store from '../../store'
  import publicHeader from '../../components/opacity_header'
  export default {
    name: 'refund_details',
    data() {
      return {
        timer: null,
        first_create_time: '',
        second_create_time: '',
        third_create_time: '',
        review_status: 3, // 1：申请取消订单、 2：商家处理、 3：平台审核、 4：订单取消成功
        cancel_reason: '', //后台返回取消原因
        supplement_content: '' //补充说明的内容
      }
    },
    computed: {
      review_details() {
        let review_details = this.$t('review_details')
        return review_details
      },
      refund_details_lang() {
        let refund_details = this.$t('refund_details')
        return refund_details
      },
      order_details() {
        return store.state.order_details;
      },
      refund_details_data() {
        return store.state.refund_details;
      }
    },
    components: {
      publicHeader
    },
    created() {
      this.get_review_details();
      this.getOrderDetails();
    },
    methods: {
      // 订单详情
      getOrderDetails() {
        store.dispatch('orderDetails', {
          orderId: this.$route.query.id
        }).then(res => {
          console.log(res.data.data)
          Object.assign(store.state.order_details, res.data.data);
        })
      },
      // 退款详情
      get_review_details() {
        store
          .dispatch('get_refund_details', {
            orderId: this.$route.query.id
          })
          .then(res => {
            let data = res.data
            this.first_create_time = data.data.listStatus[0].createTime
            if (data.data.listStatus[1]) {
              this.second_create_time = data.data.listStatus[1].createTime
            }
            if (data.data.listStatus[2]) {
              this.third_create_time = data.data.listStatus[2].createTime
            }
            if (data.code == 1) {
              Object.assign(store.state.refund_details, data.data)
              if (data.data.orderMap.rerundWay == 1) {
                this.review_status = 2
              } else if (data.data.orderMap.rerundWay == 2) {
                // 商家拒绝退款
                this.review_status = 3
              } else if (data.data.orderMap.rerundWay == 3) {
                // 商家同意退款
                this.review_status = 3
              } else if (data.data.orderMap.rerundWay == 4) {
                this.review_status = 4
              }
            }
            this.cancel_reason = data.data.orderMap.remark
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  }
</script>

<style scoped>
  .review_contain {
    height: 100%;
  }

  .review_contain .phoneHeader {
    position: fixed;
    width: 100%;
    height: 7%;
    min-height: 45px;
    top: 0;
    z-index: 1;
  }

  .review_contain .current_header {
    position: fixed;
    min-height: 45px;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 15vh;
    background: url(../../assets/images/order_details_header_bg.png);
    background-size: 100% 100%;
  }

  .review_contain .header_box {
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
  }

  .review_contain .review_body {
    width: 100%;
    height: 93%;
    position: fixed;
    top: 7%;
    overflow: scroll;
  }

  .review_contain .refund_info {
    width: 100%;
    padding: 0.2rem 0.4rem;
  }

  .review_contain .refund_info div:first-child {
    float: left;
    color: #999999;
  }

  .review_contain .refund_info div:last-child {
    float: right;
    color: #666666;
  }

  .review_contain .refund_info span {
    color: #ff644c;
  }

  .review_contain .review_flow {
    width: 96%;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 6px;
    padding: 0.4rem;
    margin-bottom: 10px;
  }

  .review_contain .review_title {
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #ededed;
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10px;
    letter-spacing: 1px;
    margin-left: 0.1rem;
  }

  .review_contain .review_cancel_reason,
  .review_contain .review_supplement {
    height: 1.5rem;
    border-bottom: 1px solid #ededed;
    display: flex;
    justify-content: space-between;
    padding-right: 0.2rem;
  }

  .review_contain .review_cancel_reason .label,
  .review_contain .review_supplement .label {
    letter-spacing: 1px;
    margin-left: 0.1rem;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #333333;
    line-height: 1.5rem;
  }

  .review_contain .review_cancel_reason .content,
  .review_contain .review_supplement .content {
    letter-spacing: 1px;
    margin-left: 0.1rem;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
    line-height: 1.5rem;
  }

  .review_contain .review_cancel_reason {
    margin-top: -10px;
  }

  .review_contain .review_supplement {
    border-bottom: 0px solid #ededed;
  }

  .review_contain .other_info {
    background: #ffffff;
    padding: 0.4rem;
    width: 96%;
    border-radius: 2px;
    margin: 0 auto;
    margin-bottom: 10px;
  }

  /* 订单信息 */
  .order_info {
    background: #ffffff;
    padding: 0.4rem;
    width: 96%;
    border-radius: 2px;
    margin: 0 auto;
    margin-bottom: 10px;
  }

  .order_details_box {
    height: 1.5rem;
    border-bottom: 1px solid #ededed;
    display: flex;
    justify-content: space-between;
    padding-right: 0.2rem;
    line-height: 1.5rem;
  }

  .order_details_box:last-child {
    border-bottom: 0;
  }

  /* 流程图 */

  .el-step__main {
    padding-bottom: 0.8rem;
    display: flex;
    justify-content: space-between;
  }

  .el-step__main.last {
    padding-bottom: 0.3rem;
  }

  .el-step__title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #aeaeae;
    line-height: 14px;
    width: 50%;
  }

  .el-step__description {
    font-family: Helvetica;
    font-size: 12px;
    color: #999999;
    line-height: 37px;
    padding-right: 0.2rem;
    width: 50%;
    text-align: right;
  }

  .el-step__description.last {
    margin-right: 0.2rem;
  }

  .el-step__description.is-finish,
  .el-step__title.is-finish,
  .el-step__head.is-finish {
    color: #ff644c;
  }

  .el-step__icon.is-text {
    border: 2px solid #cdcdcd;
    background: #999999;
    width: 14px;
    height: 14px;
  }

  .el-step.is-vertical .el-step__head {
    width: 14px;
  }

  .el-step.is-vertical .el-step__line {
    left: 6px;
    top: 4px;
  }

  .el-step__icon.is-text.is-finish {
    border: 2px solid #ffbdb3;
    background: #ff644c;
  }
</style>
