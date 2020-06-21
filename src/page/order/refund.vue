<template>
	<div class="contain">
		<div class="phoneHeader">
			<publicHeader style="height: 100%;" :title='apply_refund.apply_for_a_refund'></publicHeader>
		</div>

		<div class="refund_body_box">
			<div class="bg_box"></div>
			<div class="zhanwei_box"></div>
			<div class="refund_body">
				<div class="refund_shop">
					{{apply_refund.refund_goods}}
				</div>
				<div class="refund_contain">
					<!-- 退款商品 -->
					<div class="refund_item" v-for="(item, index) in order_details.Goods" :key="index">
						<div class="item_img">
							<img :src="item.goodsPhoto" alt="">
						</div>
						<div class="item_detail">
							<p class="item_title">{{item.goodsName}}</p>
							<p class="item_spec">{{item.goodsSpecifications}} &emsp;</p>
							<div class="item_count">
								<div>x{{item.num}}</div>
								<div>
									<span class="discount_price" v-show="item.presentPrice != item.totalPrice">{{item.presentPrice}}P</span>
									<span class="origin_price">{{item.totalPrice}}P</span>
								</div>
							</div>
						</div>
					</div>
					<!-- 配送费 -->
					<div v-show="order_details.logistics != 0" class="logistics_fee fee_contain">
						<span>{{apply_refund.shipping_fee}}</span>
						<span>{{order_details.logistics}}P</span>
					</div>
					<!-- 餐盒费 -->
					<div v-show="order_details.total_lunchbox_price != 0" class="lunchboxPrice fee_contain">
						<span>{{apply_refund.meals_fee}}</span>
						<span>{{order_details.total_lunchbox_price}}P</span>
					</div>
					<!-- 满减活动 -->
					<div v-show="order_details.discount_money != 0" class="active_fee fee_contain">
						<span>{{apply_refund.reduced_activity}}</span>
						<span>{{order_details.discount_money}}P</span>
					</div>
				</div>
			</div>
			<div class="refund_reason">
				<div class="reason_title" @click="model_visibel = true">
					<div class="choose_reason">
						<span>{{apply_refund.supplementary}} *</span>
					</div>
					<img src="../../assets/icons/icon_right_arrow.png" alt="">
				</div>
				<div class="reason_detail">
					<textarea class="text_area" :placeholder="apply_refund.fill_reason"></textarea>
				</div>
			</div>
		</div>

		<!-- 底部 -->
		<div class="footer_box clearFloat">
			<div class="refund_money_box">
				<p class="refund_money">{{apply_refund.refund_amount}}: {{order_details.actual_price}}P</p>
				<p>({{apply_refund.refund_amount}})</p>
			</div>
			<div @click="toApplyForARefund" class="refund_btn">
				{{apply_refund.apply_for_a_refund}}
			</div>
		</div>

		<!-- 退款原因 -->
		<div v-show="model_visibel" @click="model_visibel = false" class="refund_reason_model">
			<div class="reason_contain">
				<div class="reason_title">
					{{apply_refund.refund_reason}}
					<img @click="model_visibel = false" src="../../assets/icons/close_X.png" alt="">
				</div>
				<ul class="reason_detail">
					<li @click.stop="check_resion(index)" :class="{selected_reason: item.is_checked}" v-for="(item, index) in refund_resion_list" :key="index" class="reason_items">
						{{item.resion}}
					</li>
				</ul>
			</div>
		</div>
		<!-- <div class="refund_body" :style="{top: header_height}" :class="{foucus_target: foucus_target==0}">
      <div class="refund_box">
        <div class="order_info clearFloat">
          <div>
            {{apply_refund.order_number}}
          </div>
          <div>
            {{order_details.id}}
          </div>
        </div>
        <div class="order_info clearFloat">
          <div>
            {{apply_refund.shop_name}}
          </div>
          <div>
            {{order_details.seller_name}}
          </div>
        </div>
        <div class="order_info clearFloat">
          <div>
            {{apply_refund.refund_amount}}
          </div>
          <div>
            <span>
              {{order_details.actual_price}}P
            </span>
          </div>
        </div>
        <div class="order_info clearFloat">
          <div>
            {{apply_refund.refund_method}}
          </div>
          <div>
            {{apply_refund.return_account_balance}}
          </div>
        </div>

        <div class="refund_resion_box">
          <div class="refund_resion_title">
            {{apply_refund.refund_reason}}
            <span>*</span>
          </div>
          <div class="refund_resion_list clearFloat" v-for="(item, index) in refund_resion_list" :key="index">
            <div>
              {{item.resion}}
            </div>
            <div @click="check_resion(index)">
              <img src="../../assets/icons/oval_empty.png" v-show="!item.is_checked" />
              <img src="../../assets/icons/oval_checked.png" v-show="item.is_checked" />
            </div>
          </div>
        </div>

        <div class="remarks" v-show="notes">
          <div>
            {{apply_refund.supplementary_notes}}
          </div>
          <div>
            <textarea ref="textarea" v-model="remarks_content" @focus="focus_fn" @blur="on_blur" maxlength="50" resize="none"
              :placeholder="apply_refund.supplementary"></textarea>
          </div>
        </div>
      </div>

      <div class="refund_btn" @click="to_refund">
        {{apply_refund.apply_for_a_refund}}
      </div>
    </div> -->
	</div>
</template>

<script>
import store from '../../store'
import publicHeader from '../../components/opacity_header.vue'
export default {
  name: 'refund',
  data() {
    return {
      model_visibel: false,
      refund_resion_list: [
        {
          resion: this.$t('apply_refund.wrong_dish'),
          is_checked: false
        },
        {
          resion: this.$t('apply_refund.change_plan'),
          is_checked: false
        },
        {
          resion: this.$t('apply_refund.no_promise_discount'),
          is_checked: false
        },
        {
          resion: this.$t('apply_refund.consignee_information'),
          is_checked: false
        },
        {
          resion: this.$t('apply_refund.slow_delivery_rate'),
          is_checked: false
        },
        {
          resion: this.$t('apply_refund.other'),
          is_checked: false
        }
      ],
      checked_resion: '',
      remarks_content: '',
      remarks: '',
      notes: false,
      is_active: false,
      header_height: '7%',
      foucus_target: 1
    }
  },
  components: {
    publicHeader
  },
  computed: {
    apply_refund() {
      let apply_refund = this.$t('apply_refund')
      return apply_refund
    },
    order_details() {
      return store.state.order_details
    }
  },
  created() {
    this.orderDetails()
  },
  watch: {
    remarks_content: function() {
      this.remarks = this.remarks_content
    }
  },
  methods: {
    focus_fn() {
      this.header_height =
        document.querySelector('.phoneHeader').offsetHeight + 'px'
      this.foucus_target = 0
      this.$refs.textarea.style.height = '30vh'
    },
    on_blur() {
      this.$refs.textarea.style.height = ''
      this.foucus_target = 1
    },
    to_refund() {
      if (this.remarks == '') {
        this.toast.warning(this.apply_refund.supplementary)
      } else {
        this.toApplyForARefund()
      }
    },
    check_resion(index) {
      if (index == this.refund_resion_list.length - 1) {
        this.checked_resion = this.refund_resion_list[index].resion
        this.remarks = this.checked_resion
        this.notes = true
      } else {
        this.notes = false
        this.checked_resion = this.refund_resion_list[index].resion
        this.remarks = this.checked_resion
      }
      this.refund_resion_list.forEach(item => {
        item.is_checked = false
      })
      this.refund_resion_list[index].is_checked = true
      this.checked_resion = this.refund_resion_list[index].resion
      this.model_visibel = false
    },
    // 申请退款
    toApplyForARefund() {
      if (!this.remarks) {
        this.toast.warning(this.apply_refund.supplementary)
        return
      }
      store
        .dispatch('toApplyForARefund', {
          orderId: this.$route.query.id,
          remark: this.remarks
        })
        .then(res => {
          if (res.data.code == 1) {
            this.toast.warning(this.apply_refund.success)
            this.$router.push({
              path: '/order_details',
              query: {
                id: this.$route.query.id
              }
            })
            sessionStorage.setItem('refund_details_back', true)
          } else if (res.data.code == 9999) {
            this.toast.error(res.data.message)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 退款详情
    orderDetails() {
      store
        .dispatch('orderDetails', {
          orderId: this.$route.query.id
        })
        .then(res => {
          let data = res.data
          console.log(data)
          if (data.code == 1) {
            Object.assign(store.state.order_details, data.data)
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped type="css/text">
.contain {
  height: 100%;
}

.phoneHeader {
  position: absolute;
  width: 100%;
  height: 7%;
  top: 0;
  z-index: 1;
}

.refund_body_box {
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding-bottom: 55px;
}

.bg_box {
  width: 100%;
  height: 15vh;
  background: url(../../assets/images/order_details_header_bg.png);
  background-size: 100% 100%;
  position: absolute;
  z-index: -1;
}

.zhanwei_box {
  width: 100%;
  height: 50px;
}

.refund_body {
  // width: 100%;
  margin: 0 0.4rem 0.4rem 0.4rem;
  background: white;
  border-radius: 5px;
}
.refund_shop {
  // width: 100%;
  padding: 0.4rem;
}
.refund_contain {
  padding: 0 0.4rem;
  .refund_item {
    padding: 0.4rem 0;
    border-top: 1px solid #ededed;
    display: flex;
    flex-flow: row;
    .item_img {
      flex-grow: 0;
      font-size: 0;
      img {
        width: 1.9rem;
        height: 1.9rem;
      }
    }
    .item_detail {
      padding-left: 0.2rem;
      flex-grow: 1;
      p {
        width: 8rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      p.item_spec {
        font-size: 12px;
        color: #bbbbbb;
        width: 5rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .item_count {
        display: flex;
        justify-content: space-between;
        div {
          font-size: 12px;
          span {
            font-size: 12px;
            &.discount_price {
              color: #bbb;
              text-decoration: line-through;
            }
          }
        }
      }
    }
  }
  .fee_contain {
    padding: 0.4rem 0;
    border-top: 1px solid #ededed;
    display: flex;
    justify-content: space-between;
  }
  .active_fee {
    padding-bottom: 0;
  }
}
.refund_reason {
  margin: 0 0.4rem 0.4rem 0.4rem;
  background: white;
  border-radius: 5px;
  padding: 0.4rem;
  .reason_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.4rem;
    .choose_reason {
      span {
        font-size: 12px;
      }
    }
    img {
      width: auto;
      height: 0.5rem;
      vertical-align: middle;
    }
  }
  .reason_detail {
    padding: 0.4rem 0;
    border-top: 1px solid #ededed;
    .text_area {
      padding: 0.2rem;
      height: 2rem;
      width: 100%;
      outline: none;
      border: 0;
      resize: none;
      font-size: 12px;
    }
  }
}
/* .foucus_target {
    position: relative;
  }

  .refund_box {
    width: 100%;
    background: #ffffff;
  }

  .order_info {
    width: 100%;
    padding: 0.4rem;
    border-bottom: 1px solid #ededed;
  }

  .order_info div:first-child {
    float: left;
    color: #666666;
  }

  .order_info div:last-child {
    float: right;
  }

  .order_info span {
    color: #ff644c;
  }

  .refund_resion_box {
    padding: 0.4rem;
  }

  .refund_resion_title {
    padding-bottom: 0.4rem;
    border-bottom: 2px solid #ededed;
    color: #666666;
  }

  .refund_resion_title span {
    color: #ff644c;
  }

  .refund_resion_list {
    width: 100%;
    padding-top: 0.4rem;
  }

  .refund_resion_list div:first-child {
    float: left;
  }

  .refund_resion_list div:last-child {
    float: right;
    width: 20px;
    display: flex;
    align-items: center;
  }

  .refund_resion_list div:last-child img {
    width: 100%;
  }

  .remarks {
    width: 100%;
    padding: 0.4rem;
    border-top: 1px solid #ededed;
  }

  .remarks div {
    color: #666666;
  }

  .remarks div:first-child {
    margin-bottom: 0.4rem;
  }

  .remarks textarea {
    width: 100%;
    border: 1px solid #ededed;
    border-radius: 0;
    background: #fafafa;
    padding: 0.4rem;
    -webkit-appearance: none;
  }

  .refund_btn {
    width: 100%;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    margin-top: 10px;
    background: #ff644c;
    text-align: center;
    color: white;
    margin-bottom: 50px;
  } */

.footer_box {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
}

.refund_money_box {
  width: 67%;
  height: 100%;
  float: left;
  background: #665c5c;
  display: flex;
  padding-left: 0.6rem;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  p {
    font-size: 12px;
  }
  p.refund_money {
    font-size: 14px;
  }
}

.refund_btn {
  width: 33%;
  height: 100%;
  float: right;
  background: #ff644d;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
}
.refund_reason_model {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  .reason_contain {
    width: 100%;
    z-index: 1;
    height: 8.5rem;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    .reason_title {
      padding: 0.4rem 0;
      text-align: center;
      position: relative;
      font-weight: bold;
      img {
        position: absolute;
        right: 0.4rem;
        width: 0.6rem;
        height: 0.6rem;
      }
    }
    .reason_detail {
      .reason_items {
        padding: 0.2rem;
        text-align: center;
      }
    }
  }
  .selected_reason {
    color: #ff6f59;
  }
}
</style>
