<template>
  <div class="contain">
    <div class="phoneHeader">
      <publicHeader :title='order_details_lang.title'></publicHeader>
    </div>

    <div class="order_details_body">
      <div class="order_details_body_box">
        <div class="bg_box"></div>
        <div class="zhanwei_box"></div>
        <!-- 头部订单状态 -->
        <div class="order_details_header clearFloat">
          <div class="order_status_box">
            <!-- 待评价 -->
            <div class="order_status" v-if="order_status==1">
              <p>
                {{order_details_lang.to_be_evaluated}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p>{{order_details_lang.to_be_evaluated_content}}</p>
            </div>
            <!-- 退款中 -->
            <div class="order_status" v-if="order_status==2 && order_details.is_order_payment != 2">
              <p>
                {{order_details_lang.refund}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p>{{order_details_lang.refund_content}}</p>
            </div>
            <!-- 审核处理中 -->
            <div class="order_status" v-if="order_details.is_order_payment == 2 && order_details.rerund_status != 0 && order_details.rerund_status!=2 && order_details.rerund_status != 4">
              <p>
                {{order_details_lang.reviewing}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p>{{order_details_lang.review_content}}</p>
            </div>
            <!-- 订单已取消 -->
            <div class="order_status" v-if="order_details.rerund_status==4 && order_details.order_status==7 && order_details.is_order_payment == 2">
              <p>
                {{order_details_lang.canceled}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p>{{order_details_lang.cancel_hint}}</p>
            </div>
            <!-- 订单已取消 -->
            <div class="order_status" v-if="(order_status==3 || order_status==13) && order_details.is_order_payment != 2">
              <p>
                {{order_details_lang.canceled}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p v-if="cancel_status==1">{{order_details_lang.order_has_been_cancelled}}</p>
              <p v-if="cancel_status==2">{{order_details_lang.cancel_content}}</p>
            </div>
            <!-- 退款成功 -->
            <div class="order_status" v-if="order_status==4 && order_details.is_order_payment != 2">
              <p>
                {{order_details_lang.refund_succsss}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p>{{order_details_lang.cancel_content}}</p>
            </div>
            <!-- 订单已完成 -->
            <div class="order_status" v-if="order_status==5">
              <p>
                {{order_details_lang.over}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p>{{order_details_lang.forward}}</p>
            </div>
            <!-- 等待商家接单 -->
            <div class="order_status" v-if="order_status==6">
              <p>
                {{order_details_lang.not_receive}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p v-if="order_details.is_order_payment != 2">{{order_details_lang.bot_receive_content}}</p>
              <p v-if="order_details.is_order_payment == 2">{{order_details_lang.cash_bot_receive_content}}</p>
            </div>
            <!-- 订单已拒绝退款 -->
            <div class="order_status" v-if="order_status==7 && order_details.is_order_payment != 2">
              <p>
                {{order_details_lang.has_refused}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p>{{order_details_lang.order_refused}}</p>
            </div>
            <!-- 订单已拒绝退款 货到付款-->
            <div class="order_status" v-if="order_details.rerund_status==2 && (order_details.order_status == 5 || order_details.order_status == 9 || order_details.order_status == 7) && order_details.is_order_payment == 2">
              <p>
                {{order_details_lang.has_refused}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p>{{order_details_lang.reason_for_rejection}}</p>
            </div>
            <!-- 拒绝取消订单 货到付款-->
            <div class="order_status" v-if="order_details.rerund_status==2 && (order_details.order_status == 3 || order_details.order_status == 2) && order_details.is_order_payment == 2">
              <p>
                {{order_details_lang.reject_cancellation}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p>{{order_details_lang.reason_for_rejection}}</p>
            </div>
            <!-- 制作配送中 -->
            <div class="order_status" v-if="(order_status==8 || order_status==10 || order_status==11 || order_status==12)">
              <p>
                {{order_details_lang.process_delivery}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p>{{order_details_lang.process_delivery_content}}</p>
            </div>
            <!-- 待支付 -->
            <div class="order_status" v-if="order_status==9 && order_details.is_order_payment != 2">
              <p>
                {{order_details_lang.wait_pay}}
                <span class="track_order_btn" @click="show_track_box=true">
                  <img src="../../assets/icons/order_details/go_in.png" />
                </span>
              </p>
              <p v-if="lang=='zh'">
                剩余
                <span>{{min}}</span> 分
                <span>{{sec}}</span> 秒订单将自动关闭
              </p>
              <p v-if="lang=='en'">
                Left
                <span>{{min}}:{{sec}}</span>
                order will be automatically closed
              </p>
            </div>

            <!-- 原底部按钮 -->
            <div class="old_footer_btn_box">
              <div class="footer_btn clearFloat">
                <!-- 去支付 -->
                <div v-if="order_status==9" @click="toPay(order_id)">
                  {{order_details_lang.toPay}}
                </div>
                <!-- 配送详情 -->
                <div v-if="(order_status==8 || order_status==10 || order_status==11 || order_status==12) && order_details.is_order_payment!=2" @click="toDeliveyDetail(order_id)">
                  {{order_details_lang.toDeliveyDetail}}
                </div>
                <!-- 配送详情 -->
                <div v-if="order_status==7" @click="toDeliveyDetail(order_id)">
                  {{order_details_lang.toDeliveyDetail}}
                </div>
                <!-- 配送详情 -->
                <div v-if="order_details.rerund_status==1 && (order_details.order_status==3 || order_details.order_status==5 || order_details.order_status==2 || order_details.order_status==9)" @click="toDeliveyDetail(order_id)">
                  {{order_details_lang.toDeliveyDetail}}
                </div>
                <!-- 配送详情 -->
                <div v-if="order_details.rerund_status==0 && (order_details.order_status==2 || order_details.order_status==3 || order_details.order_status==9 ||  order_details.order_status==5) && order_details.is_order_payment==2" @click="toDeliveyDetail(order_id)">
                  {{order_details_lang.toDeliveyDetail}}
                </div>
                <!-- 配送详情 -->
                <div v-if="(order_details.rerund_status==3) && order_details.order_status==3" @click="toDeliveyDetail(order_id)">
                  {{order_details_lang.toDeliveyDetail}}
                </div>
                <!-- 审核详情 -->
                <div @click="toReviewDetail(order_id)" v-if="order_details.is_order_payment == 2 && order_details.rerund_status != 0 && order_details.rerund_status != 4 && order_status!=7">
                  {{order_details_lang.reviewDetail}}
                </div>
                <!-- 取消订单 -->
                <div class="empty_color" v-if="order_status==6 || order_status==9" @click="toCancel(order_id)">
                  {{order_details_lang.toCancel}}
                </div>
                <!-- 申请退款 -->
                <div class="empty_color" v-if="(order_status==8 || order_status==10 || order_status==11 || order_status==12) && order_details.is_order_payment!=2" @click="toRefund(order_id)">
                  {{order_details_lang.toRefund}}
                </div>
                <!-- 申请退款--货到付款取消订单 -->
                <div class="empty_color" v-if="(order_status==8 || order_status==10 || order_status==11 || order_status==12) && order_details.is_order_payment==2" @click="cancel_order=true">
                  {{order_details_lang.toCancel}}
                </div>
                <!-- 退款详情 -->
                <div v-if="order_status==2 && order_details.is_order_payment!=2" @click="toRefundDetail(order_id)">
                  {{order_details_lang.toRefundDetail}}
                </div>
                <!-- 退款详情 -->
                <div v-if="order_details.rerund_status == 4 && order_details.order_status == 7 && order_details.is_order_payment!=2" @click="toRefundDetail(order_id)">
                  {{order_details_lang.toRefundDetail}}
                </div>
                <!-- 去评价 -->
                <div v-if="order_status==1" @click="toEvaluate(order_id)">
                  {{order_details_lang.toEvaluate}}
                </div>
                <!-- 催单 -->
                <div class="empty_color" @click="reminder(order_details.reminderTime, order_id)" v-if="order_status == 8 && order_details.timeStatus == 1">
                  {{get_language.reminder_title}}
                </div>
                <!-- 再来一单 -->
                <div class="empty_color" @click="go_to_seller_home(order_details.seller_id,order_details.id)" v-if="order_details.order_status==6 || order_details.order_status==7 || order_details.order_status==8">
                  {{get_en.single_again}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="seller_info info_box">
        <!-- 商铺信息 -->
        <div class="seller_info_header clearFloat">
          <div class="seller_name clearFloat" @click="go_to_seller_home(order_details.seller_id,order_details.id, true)">
            <div class="single_hide">{{order_details.seller_name}}</div>
            <div class="go_to_seller_home_img">
              <img src="../../assets/icons/order_details/go_in.png" />
            </div>
          </div>

          <!-- 联系商家 -->
          <div class="seller_call">
            <span @click="show_tel=true">
              <img src="../../assets/icons/order_details/contact_the_merchant.png" />
            </span>
            <span @click="show_tel=true">
              {{order_details_lang.contact_merchant}}
            </span>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="orders_info_list_box">

          <!-- 默认列表——第一条商品 -->
          <div class="orders_info_list clearFloat" v-if="!open_all_list">
            <div class="orders_info_list_headers">
              <img :src="order_list_first.goodsPhoto" @error="imgError(index)" />
            </div>
            <div class="orders_info_list_content">
              <div class="order_name single_hide">
                {{order_list_first.goodsName}}
              </div>
              <div class="order_requirement single_hide" v-if="order_list_first.goodsSpecifications || order_list_first.goodsAttributeLabel">
                {{order_list_first.goodsSpecifications}}
                <span v-if="order_list_first.goodsSpecifications && order_list_first.goodsAttributeLabel">
                  / </span>
                {{order_list_first.goodsAttributeLabel}}
              </div>
              <div class="order_num">
                x{{order_list_first.num}}
              </div>
            </div>
            <div class="orders_info_list_price">
              <div>
                <p>
                  {{parseFloat((order_list_first.presentPrice * order_list_first.num).toFixed(2))}}P
                </p>
                <!-- 带优惠价 -->
                <p></p>
              </div>
            </div>
          </div>
          <!-- 默认列表——第二条商品 -->
          <div class="orders_info_list clearFloat" v-if="!open_all_list && order_details.Goods.length>=2">
            <div class="orders_info_list_headers">
              <img :src="order_list_second.goodsPhoto" @error="imgError(index)" />
            </div>
            <div class="orders_info_list_content">
              <div class="order_name single_hide">
                {{order_list_second.goodsName}}
              </div>
              <div class="order_requirement single_hide" v-if="order_list_second.goodsSpecifications || order_list_second.goodsAttributeLabel">
                {{order_list_second.goodsSpecifications}}
                <span v-if="order_list_second.goodsSpecifications && order_list_second.goodsAttributeLabel">
                  / </span>
                {{order_list_second.goodsAttributeLabel}}
              </div>
              <div class="order_num">
                x{{order_list_second.num}}
              </div>
            </div>
            <div class="orders_info_list_price">
              <div>
                <p>
                  {{(parseFloat(order_list_second.presentPrice * order_list_second.num).toFixed(2))}}P
                </p>
                <!-- 带优惠价 -->
                <p></p>
              </div>
            </div>
          </div>

          <!-- 全部列表 -->
          <div class="orders_info_list clearFloat" v-if="open_all_list && open_all_list_btn" v-for="(item, index) in order_details.Goods" :key="index">
            <div class="orders_info_list_headers">
              <img :src="item.goodsPhoto" @error="imgError(index)" />
            </div>
            <div class="orders_info_list_content">
              <div class="order_name single_hide">
                {{item.goodsName}}
              </div>
              <div class="order_requirement single_hide" v-if="item.goodsSpecifications || item.goodsAttributeLabel">
                {{item.goodsSpecifications}}
                <span v-if="item.goodsSpecifications && item.goodsAttributeLabel"> / </span>
                {{item.goodsAttributeLabel}}
              </div>
              <div class="order_num">
                x{{item.num}}
              </div>
            </div>
            <div class="orders_info_list_price">
              <div>
                <p>
                  {{parseFloat((item.presentPrice * item.num).toFixed(2))}}P
                </p>
                <!-- 带优惠价 -->
                <p></p>
              </div>
            </div>
          </div>

          <!-- 展开收起 -->
          <div class="o_i_l_open_btn_box">
            <span class="o_b_text" @click="open_all_btn_fn()" v-if="!open_all_list_btn && order_details.Goods.length>2">{{order_details_lang.expand}}</span>
            <span class="o_b_text" @click="close_all_btn_fn()" v-if="open_all_list_btn && order_details.Goods.length>2">{{order_details_lang.close}}</span>
            <span class="o_b_img">
              <img @click="open_all_btn_fn()" v-if="!open_all_list_btn && order_details.Goods.length>2" src="../../assets/icons/open_all.png" />
              <img @click="close_all_btn_fn()" v-if="open_all_list_btn && order_details.Goods.length>2" src="../../assets/icons/close_all.png" />
            </span>
          </div>

        </div>

        <div class="seller_information clearFloat" v-if="order_details.total_lunchbox_price!=0">
          <div>
            {{order_details_lang.total_lunchbox_price}}
          </div>
          <div class="distribution_fee">
            {{order_details.total_lunchbox_price}}P
          </div>
        </div>
        <div class="seller_information clearFloat">
          <div>
            {{order_details_lang.delivery_fee}}
          </div>
          <div class="distribution_fee">
            <span v-if="!order_details.subsidyMoney || parseFloat(order_details.subsidyMoney) == 0">{{order_details.logistics}}P</span>
            <span v-else>
              <span style='text-decoration: line-through;'>{{order_details.logistics}}P</span>
              <span style='color: #ff3633;'>{{order_details.userPayMoney}}P</span>
            </span>
          </div>
        </div>
        <div class="seller_information clearFloat" v-if="order_details.sellerVoucherInfo">

          <div v-if="lang=='zh'">
            <img src="../../assets/icons/满返代金券@2x.png" alt="" class="purchase">下单满{{order_details.sellerVoucherInfo.voucherCondition}}P返{{order_details.sellerVoucherInfo.voucherMoney}}P
          </div>
          <div v-else>
            <img src="../../assets/icons/满返代金券@2x.png" alt="" class="purchase">Get {{order_details.sellerVoucherInfo.voucherCondition}}P with purchase of {{order_details.sellerVoucherInfo.voucherMoney}}P
          </div>
          <div class="distribution_fee">
            <span v-if="lang=='zh'">返{{order_details.sellerVoucherInfo.voucherMoney}}P</span>
            <span v-else>{{order_details.sellerVoucherInfo.voucherMoney}}P reward</span>
          </div>
        </div>
        <div class="seller_information clearFloat" v-if="order_details.discount_money!=0">
          <div>
            {{order_details_lang.preferential_amount}}
          </div>
          <div class="preferential_amount">
            -{{order_details.discount_money}}P
          </div>
        </div>
        <div class="seller_information clearFloat real_payment_box">
          <div></div>
          <div>
            <span class="real_payment">{{order_details_lang.real_pay}}</span>
            <span class="real_payment_amount">{{order_details.actual_price}}P</span>
          </div>
        </div>
      </div>

      <!-- 配送信息 -->
      <div class="distribution_info info_box">
        <div class="public_title clearFloat">
          <div>
            {{order_details_lang.distribution_information}}
            <!-- 联系骑手 -->
            <div class="rider_call" v-if="order_details.order_status != 0 && order_details.order_status != 7">
              <span @click="show_rider_tel=true">
                <img src="../../assets/icons/order_details/contact_the_merchant.png" />
              </span>
              <span @click="show_rider_tel=true">
                {{order_details_lang.rider_call}}
              </span>
            </div>
          </div>
        </div>
        <div>
          <!-- 配送地址 -->
          <div class="distribution_info_box clearFloat">
            <div>
              {{order_details_lang.delivery_address}}
            </div>
            <div>
              <p>
                {{order_details.name}}
                <span v-if="order_details.sex==0">({{order_details_lang.mr}})</span>
                <span v-if="order_details.sex==1">({{order_details_lang.ms}})</span>
                {{order_details.phone}}
              </p>
              <p>
                {{order_details.house_number}}, {{order_details.address}}
              </p>
            </div>
          </div>
          <!-- 配送方式 -->
          <div class="distribution_info_box clearFloat">
            <div>
              {{order_details_lang.delivery}}
            </div>
            <div class="remarks_contetn">
              <span v-if="order_details.deliveryMode == 0">
                {{order_details_lang.platform_delivery}}
              </span>
              <span v-if="order_details.deliveryMode == 1">
                {{order_details_lang.merchant_delivery}}
              </span>
            </div>
          </div>
          <!-- 备注 -->
          <div class="distribution_info_box clearFloat" v-if="order_details.remark">
            <div>
              {{order_details_lang.note}}
            </div>
            <div class="remarks_contetn">
              {{order_details.remark}}
            </div>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="order_info info_box">
        <div class="public_title">
          {{order_details_lang.order_information}}
        </div>
        <div>
          <!-- 订单号 -->
          <div class="order_info_box clearFloat">
            <div>
              {{order_details_lang.order_number}}
            </div>
            <div>
              <span class="order_id_number">
                {{order_details.id}}
              </span>
              <span class="copy_order" @click="copy_order_fn()">{{order_details_lang.copy}}</span>
            </div>
          </div>
          <!-- 支付方式 -->
          <div class="order_info_box clearFloat" v-if="(order_details.payType == 0 || order_details.payType == 1 || order_details.payType == 2 )">
            <div>
              {{order_details_lang.pay_methods}}
            </div>
            <div>
              <span v-if="order_details.payType == 0">
                {{order_details_lang.others_pay}}
              </span>
              <span v-if="order_details.payType == 1">
                {{order_details_lang.balance_pay}}
              </span>
              <span v-if="order_details.payType == 2">
                {{order_details_lang.cash_on_delivery}}
              </span>
            </div>
          </div>
          <!-- 下单时间 -->
          <div class="order_info_box clearFloat">
            <div>
              {{order_details_lang.order_time}}
            </div>
            <div>
              {{$formatDateTime(order_details.create_time)}}
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 商家电话提示框 -->
    <div class="tel_popup" v-if="show_tel">
      <div class="tel_num">
        {{order_details.sellerPhonePre + ' ' + order_details.sellerPhone}}
      </div>
      <div class="tel_popup_btn clearFloat">
        <div @click="show_tel=false">
          {{order_details_lang.cancel}}
        </div>
        <div @click="show_tel=false">
          <a :href="'tel:'+(order_details.sellerPhonePre + order_details.sellerPhone)">
            {{order_details_lang.call}}
          </a>
        </div>
      </div>
    </div>

    <!-- 骑手电话提示框 -->
    <div class="tel_popup" v-if="show_rider_tel">
      <div class="tel_num">
        {{order_details.deliveryPre + ' ' + order_details.deliveryPhone}}
      </div>
      <div class="tel_popup_btn clearFloat">
        <div @click="show_rider_tel=false">
          {{order_details_lang.cancel}}
        </div>
        <div @click="show_rider_tel=false">
          <a :href="'tel:'+(order_details.deliveryPre + order_details.deliveryPhone)">
            {{order_details_lang.call}}
          </a>
        </div>
      </div>
    </div>

    <!-- 订单跟踪 -->
    <div class="track_order" v-if="show_track_box">
      <div class="track_order_title">
        {{order_details_lang.order_tracking_info}}
        <span class="close_btn" @click="show_track_box=false">
          <img src="../../assets/icons/Closex.png" />
        </span>
      </div>

      <div class="track_order_body">

        <!-- 订单跟踪（调接口） -->
        <div class="el-step is-vertical" v-for="(item, index) in order_details.orderInfo" :key="index">
          <div class="el-step__head">
            <div class="el-step__line" style="margin-right: 0px;"></div>
            <div class="el-step__icon is-text"></div>
          </div>
          <div class="el-step__main clearFloat">
            <div class="el_step__main_body">
              <div class="el-step__title clearFloat">
                <div class="left_box">

                  <!-- {{item.rerundStatus}} — {{item.orderStatus}} — {{item.getSellerOrderTime}} -->
                  <!-- 订单已提交 -->
                  <span v-if="item.rerundStatus==0 && item.orderStatus==0">{{order_details_lang.sub}}</span>
                  <!-- 等待商家接单 -->
                  <span v-if="item.rerundStatus==0 && item.orderStatus==1">{{order_details_lang.not_receive}}</span>
                  <!-- 商家已接单 -->
                  <span v-if="item.rerundStatus==0 && item.orderStatus==2">{{order_details_lang.take}}</span>
                  <!-- 制作配送中 -->
                  <span v-if="(item.rerundStatus==0 || item.rerundStatus==2 || item.rerundStatus==1) && (item.orderStatus==4)">{{order_details_lang.process_delivery}}</span>
                  <!-- 骑手已到店 -->
                  <span v-if="item.orderStatus==9">{{order_details_lang.rider_arrived}}</span>
                  <!-- 骑手已取货 -->
                  <span v-if="item.orderStatus==5">{{order_details_lang.ridera_fetched_order}}</span>
                  <!-- 订单待评价 -->
                  <span v-if="item.rerundStatus==0 && item.orderStatus==6">{{order_details_lang.isArrived}}</span>
                  <!-- 订单已完成 -->
                  <span v-if="item.rerundStatus==0 && item.orderStatus==8">{{order_details_lang.over}}</span>
                  <!-- 骑手已接单 -->
                  <span v-if="item.orderStatus==3">{{order_details_lang.rider_order}}</span>
                  <!-- 订单退款中 -->
                  <!-- <span v-if="item.rerundStatus==1 && item.orderStatus!=3">{{order_details_lang.refund}}</span> -->
                  <!-- 订单已拒绝退款 -->
                  <!-- <span v-if="item.rerundStatus==2 && item.orderStatus==7">{{order_details_lang.has_refused}}</span> -->
                  <!-- 退款成功 -->
                  <!-- <span v-if="item.rerundStatus==3 && item.orderStatus==7">{{order_details_lang.canceled}}</span> -->
                  <!-- 订单已取消 -->
                  <span v-if="item.rerundStatus==0 && item.orderStatus==7 && item.getSellerOrderTime==null">{{order_details_lang.canceled}}</span>
                  <!-- 订单已取消 -->
                  <span v-if="(item.rerundStatus==4 || item.rerundStatus==3) && item.orderStatus==7 && item.getSellerOrderTime==null">{{order_details_lang.canceled}}</span>
                  <!-- 退款成功 -->
                  <!-- <span v-if="item.rerundStatus==4 && item.orderStatus==7 && item.getSellerOrderTime!=null">{{order_details_lang.refund_succsss}}</span> -->

                </div>
                <div class="time_box">
                  {{$formatDateTime(item.createTime)}}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="cancel_order_pop" v-if="cancel_order">
      <div class="track_order_title">
        {{order_details_lang.toCancel}}
        <span class="close_btn" @click="cancel_order=false">
          <img src="../../assets/icons/Closex.png" />
        </span>
      </div>

      <div class="cancle_reason_list">
        <p v-for="(item, index) in cancel_order_list" :key="index" @click="toCancelOrder(item.resion)">
          {{item.resion}}
        </p>
      </div>
    </div>

    <!-- 遮罩 -->
    <div class="tel_task_box" v-if="show_tel || show_rider_tel || show_track_box || cancel_order"></div>
  </div>
</template>

<script>
  import store from '../../store'
  import publicHeader from '../../components/opacity_header.vue'
  export default {
    name: 'order_details',
    data() {
      return {
        timer: null,
        surplus_time: '',
        min: '',
        sec: '',
        lang: '',
        show_tel: false,
        show_rider_tel: false,
        cancel_status: 1,
        order_status: '', // 1：待评价、 2：退款中、 3：订单已取消、 4：退款成功、 5：订单已完成、6:等待商家接单、 7：订单已拒绝退款、 8：制作配送中、 9：待支付
        isReminder: false,
        open_all_list: false,
        open_all_list_btn: false,
        order_list_first: {},
        order_list_second: {},
        show_track_box: false,
        cancel_order: false,
        cancel_order_list: [
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
        }]
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
      },
      order_details_lang() {
        let order_details_lang = this.$t('order_details')
        return order_details_lang
      },
      get_language() {
        let txt = this.$t('main_comment')
        return txt
      },
      order_id() {
        return store.state.order_details.id
      },
      get_en() {
        return this.$t('order')
      }
    },
    beforeCreate() {
      store.state.order_details.subsidyMoney = 0
      store.state.order_details.payType = null
      this.order_status = ''
    },
    created() {
      this.lang = getCookie('lang')
      this.get_order_details()
    },
    methods: {
      toCancelOrder(remarks) {
        store
          .dispatch('toApplyForARefund', {
            orderId: this.$route.query.id,
            remark: remarks
          })
          .then(res => {
            if (res.data.code == 1) {
              this.toast(this.apply_refund.success)
              setTimeout(() => {
                history.go(0)
              }, 500)
            } else if (res.data.code == 9999) {
              this.toast.error(res.data.message)
            }
          })
      },
      copy_order_fn() {
        let order_id_number = document
          .getElementsByClassName('order_id_number')[0]
          .innerText.trim()
        let order_input = document.createElement('input')
        order_input.value = order_id_number
        document.body.appendChild(order_input)
        order_input.select()
        document.execCommand('Copy')
        order_input.style.display = 'none'
        let txt = this.$t('order_details.successful_copy')
        this.$toast(txt)
      },
      open_all_btn_fn() {
        this.open_all_list_btn = true
        this.open_all_list = true
      },
      close_all_btn_fn() {
        this.open_all_list_btn = false
        this.open_all_list = false
      },
      reminder(status, id) {
        if (status || this.isReminder) {
          let txt = this.$t('main_comment.remindered')
          this.toast(txt)
        } else {
          let _this = this
          this.$confirm({
            title: _this.get_language.reminderTitle,
            content: _this.get_language.reminderTxt,
            noText: _this.get_language.no,
            yesText: _this.get_language.yes
          }).then(() => {
            store
              .dispatch('reminderOrder', {
                orderId: id
              })
              .then(res => {
                if (res.data.code === 1) {
                  let txt = _this.get_language.success_undelivered
                  this.isReminder = true
                  this.toast(txt)
                } else {
                  let txt = _this.get_language.reminder_failed
                  this.toast(txt)
                }
              })
          })
        }
      },
      go_to_seller_home(id, orderId, isshop) {
        this.$router.push({
          path: '/business_shop',
          query: {
            id: id,
            order_again_id: orderId,
            pathName: this.$route.name,
            order_id: this.$route.query.id,
            is_order_detail_shop: isshop
          }
        })
      },
      imgError(index) {
        store.state.order_details.Goods[
          index
        ].goodsPhoto = require('../../assets/images/mo.png')
      },
      // 配送详情
      toDeliveyDetail(id) {
        this.$router.push({
          path: '/distribution_details',
          query: {
            id: this.$route.query.id
          }
        })
      },
      // 去支付
      toPay(id) {
        this.$router.push({
          path: '/selectPayMethod',
          query: {
            id: this.$route.query.id
          }
        })
      },
      // 取消订单
      toCancel(id) {
        store
          .dispatch('cancelTheOrder', {
            orderId: this.$route.query.id
          })
          .then(res => {
            this.get_order_details()
          })
          .catch(err => {
            console.error(err)
          })
      },
      // 审核详情
      toReviewDetail(id) {
        this.$router.push({
          path: '/review_details',
          query: {
            id: this.$route.query.id
          }
        })
      },
      // 退款详情
      toRefundDetail(id) {
        this.$router.push({
          path: '/refund_details',
          query: {
            id: this.$route.query.id
          }
        })
      },
      // 申请退款
      toRefund(id) {
        this.$router.push({
          path: '/refund',
          query: {
            id: this.$route.query.id
          }
        })
      },
      // 去评价
      toEvaluate(id) {
        this.$router.push({
          path: '/evaluate',
          query: {
            id: this.$route.query.id
          }
        })
      },
      // 计算订单状态
      order_status_calc() {
        // 订单状态
        let order_status = this.order_details.order_status
        // 退款状态
        let rerund_status = this.order_details.rerund_status
        // 订单取消/退款
        let getSellerOrderTime = this.order_details.getSellerOrderTime

        if (rerund_status == 0 && order_status == 6) {
          // 待评价
          this.order_status = 1
        } else if (rerund_status == 1 || rerund_status == 3) {
          // 退款中
          this.order_status = 2
        } else if (
          rerund_status == 0 &&
          order_status == 7 &&
          getSellerOrderTime == null
        ) {
          // 订单已取消
          this.order_status = 3
          this.cancel_status = 1
        } else if (
          rerund_status == 4 &&
          order_status == 7 &&
          getSellerOrderTime == null
        ) {
          // 订单已取消
          this.order_status = 13
          this.cancel_status = 2
        } else if (
          rerund_status == 4 &&
          order_status == 7 &&
          getSellerOrderTime != null
        ) {
          // 退款成功
          this.order_status = 4
        } else if (rerund_status == 0 && order_status == 8) {
          // 订单已完成
          this.order_status = 5
        } else if (rerund_status == 0 && order_status == 1) {
          // 等待商家接单
          this.order_status = 6
        } else if (rerund_status == 2 || order_status == 7) {
          // 订单已拒绝退款
          this.order_status = 7
        } else if (rerund_status == 0 && order_status == 2) {
          // 制作配送中——商家已接单
          this.order_status = 10
        } else if (rerund_status == 0 && order_status == 4) {
          // 制作配送中
          this.order_status = 8
        } else if (rerund_status == 0 && order_status == 9) {
          // 制作配送中——骑手已到店
          this.order_status = 11
        } else if (rerund_status == 0 && order_status == 5) {
          // 制作配送中——骑手已取货
          this.order_status = 12
        } else if (rerund_status == 2 && order_status == 9) {
          // 制作配送中——骑手已到店——拒绝退款后
          this.order_status = 7
        } else if (rerund_status == 2 && order_status == 5) {
          // 制作配送中——骑手已取货——拒绝退款后
          this.order_status = 7
        } else if (order_status == 3) {
          // 制作配送中
          this.order_status = 8
        } else if (rerund_status == 0 && order_status == 0) {
          // 待支付
          this.order_status = 9
        }
      },
      // 获取订单详情
      get_order_details() {
        store
          .dispatch('orderDetails', {
            orderId: localStorage.getItem('order_detail_id')
          })
          .then(res => {
            let data = res.data
            if (data.code == 1) {
              Object.assign(store.state.order_details, data.data)
              this.order_list_first = data.data.Goods[0]
              this.order_list_second = data.data.Goods[1]
              this.order_status_calc()

              // 剩余支付时间
              if (
                this.order_details.rerund_status == 0 &&
                this.order_details.order_status == 0
              ) {
                let over_time = store.state.order_details.create_time + 900000
                this.timer = setInterval(() => {
                  let current_time = new Date().getTime()
                  this.min = parseInt((over_time - current_time) / 1000 / 60)
                  this.sec = parseInt(((over_time - current_time) / 1000) % 60)
                  if (this.min <= 9) {
                    this.min = '0' + this.min
                  }
                  if (this.sec <= 9) {
                    this.sec = '0' + this.sec
                  }
                  if (current_time <= over_time) {
                    this.surplus_time = this.min + ':' + this.sec
                  } else {
                    this.surplus_time = '00:00'
                    clearInterval(this.timer)
                  }

                  if (this.surplus_time <= '00:00') {
                    // 取消订单
                    this.$axios
                      .post('innerService/CancelTheOrder', {
                        orderId: this.$route.query.id
                      })
                      .then(res => {})
                      .catch(err => {
                        console.error(err)
                      })
                    history.go(-1)
                  }
                }, 1000)
              }
            } else if (data.code == 9999) {
              this.toast.error(data.message)
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    beforeDestroy() {
      clearInterval(this.timer)
      this.timer = null
    }
  }
</script>

<style scoped>
  .contain {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
  }

  .tel_task_box {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 111;
    background: black;
    opacity: 0.3;
  }

  .track_order {
    width: 100%;
    padding: 0.4rem 0.6rem 0.4rem 0.4rem;
    background: white;
    position: fixed;
    bottom: 0;
    z-index: 9999;
  }

  .now_order_status {
    color: #ff6f59;
  }

  .track_order .el-step__icon {
    width: 1px;
    height: 1px;
    border: 3px solid #d9d9d9;
  }

  .track_order .el-step__icon.now_order_status {
    width: 1px;
    height: 1px;
    border: 3px solid #ff6f59;
  }

  .track_order .el-step.is-vertical {
    height: 35px;
  }

  .track_order .el-step.is-vertical .el-step__head {
    display: flex;
    justify-content: center;
  }

  .track_order .el-step.is-vertical .el-step__title {
    padding-bottom: 0;
    line-height: 25px;
  }

  .track_order .el-step.is-vertical .el-step__title .left_box {
    float: left;
    font-size: 14px;
  }

  .track_order .el-step.is-vertical .el-step__title .time_box {
    float: right;
    color: #999999;
    font-size: 12px;
  }

  .track_order .el_step__main_body {
    height: 25px;
    position: relative;
    top: -10px;
  }

  .track_order .el-step__line {
    height: 60%;
    top: 10px;
  }

  .track_order_btn {
    display: inline-block;
    width: 0.4rem;
    margin-left: 0.2rem;
  }

  .track_order_btn img {
    width: 65%;
  }

  .track_order_title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 0.4rem;
  }

  .track_order_title .close_btn {
    position: absolute;
    right: 0.6rem;
    width: 0.4rem;
  }

  .track_order_title .close_btn img {
    width: 100%;
  }

  .tel_popup {
    width: 60%;
    background: white;
    position: fixed;
    top: 40%;
    left: 20%;
    z-index: 222;
    border-radius: 10px;
  }

  .tel_num {
    text-align: center;
    padding: 0.4rem;
    border-bottom: 1px solid #ededed;
  }

  .tel_popup_btn {
    width: 100%;
    height: 50%;
  }

  .tel_popup_btn div {
    float: left;
    width: 50%;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    text-align: center;
    color: #1b79d6;
  }

  .tel_popup_btn div:last-child {
    border-left: 1px solid #ededed;
  }

  .tel_popup_btn div a {
    display: block;
    width: 100%;
    height: 100%;
    color: #1b79d6;
  }

  .tel_popup_btn a:hover {
    color: #1b79d6;
  }

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

  .no_wify {
    width: 100%;
    height: 93%;
    position: fixed;
    top: 7%;
  }

  .no_wify div {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .no_wify img {
    width: 50%;
    height: 50%;
    margin-top: 25%;
  }

  .no_wify p {
    width: 80%;
    text-align: center;
    color: #666666;
  }

  .no_wify span {
    display: block;
    padding: 0.2rem 0.4rem;
    background-color: #ff3633;
    border-radius: 5px;
    color: white;
  }

  .order_details_body {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  .order_details_body_box {
    width: 100%;
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

  .order_details_header {
    width: 100%;
    background-size: 100% 100%;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
  }

  .order_status_box {
    width: 11.2rem;
    background: white;
    border-radius: 5px;
    padding: 0.4rem;
    height: 100%;
    float: left;
  }

  .order_status p {
    font-size: 12px;
  }

  .order_status p:first-child {
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: bold;
  }

  .order_status p:last-child {
    color: #777777;
  }

  .order_status span {
    font-size: 12px;
    color: #ff3633;
  }

  .order_status_icon {
    width: 25%;
    height: 100%;
    float: right;
    display: flex;
    align-items: center;
  }

  .order_status_icon img {
    width: 80%;
  }

  .info_box {
    width: 11.2rem;
    background: white;
    padding: 0.4rem;
    margin: auto;
    margin-top: 10px;
  }

  .public_title {
    width: 100%;
    border-bottom: 1px solid #ededed;
    padding-bottom: 0.4rem;
    font-weight: bold;
  }

  .seller_info_header {
    width: 100%;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #ededed;
  }

  .seller_info_header div {
    height: 100%;
  }

  .seller_name {
    width: 6rem;
    float: left;
    display: flex;
    align-items: center;
    font-weight: bold;
  }

  .seller_name div {
    float: left;
  }

  .seller_name div:first-child {
    max-width: 5rem;
    float: left;
  }

  .go_to_seller_home_img {
    margin-left: 0.4rem;
    width: 0.4rem;
    display: flex;
    align-items: center;
  }

  .go_to_seller_home_img img {
    width: 65%;
  }

  .rider_call span {
    font-weight: normal;
  }

  .rider_call,
  .seller_call {
    float: right;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff644c;
  }

  .rider_call span:first-child,
  .seller_call span:first-child {
    display: inline-block;
    width: 18px;
    margin-right: 0.2rem;
    height: 25px;
    display: flex;
    align-items: center;
  }

  .rider_call span:first-child img,
  .seller_call span:first-child img {
    width: 100%;
  }

  .orders_info_list {
    width: 100%;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }

  .orders_info_list_headers {
    width: 2rem;
    height: 2rem;
    float: left;
    margin-right: 0.2rem;
  }

  .orders_info_list_headers img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .orders_info_list_content {
    float: left;
    width: 5.6rem;
    height: 2rem;
  }

  .order_requirement {
    color: #bbbbbb;
    font-size: 14px;
  }

  .order_num {
    font-size: 14px;
  }

  .orders_info_list_price {
    float: right;
    width: 2.4rem;
    height: 2rem;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }

  .orders_info_list_price p {
    font-size: 14px;
    text-align: right;
  }

  .orders_info_list_price p:last-child {
    color: #bbbbbb;
    text-decoration: line-through;
  }

  .o_i_l_open_btn_box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .o_i_l_open_btn_box span {
    font-size: 14px;
    color: #666666;
  }

  .o_b_text {
    margin-right: 0.2rem;
  }

  .o_b_img {
    width: 18px;
  }

  .o_b_img img {
    width: 100%;
  }

  .seller_information {
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }

  .seller_information .purchase {
    vertical-align: middle;
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }

  .seller_information:last-child {
    padding-bottom: 0;
  }

  .real_payment_box {
    border-top: 1px solid #ededed;
  }

  .real_payment_box div {
    display: flex;
    align-items: center;
  }

  .real_payment_box span:first-child {
    display: inline-block;
    margin-right: 0.2rem;
  }

  .seller_information div:first-child {
    float: left;
  }

  .seller_information div:last-child {
    float: right;
  }

  .distribution_fee {
    color: #999999;
  }

  .preferential_amount {
    color: #ff3633;
  }

  .real_payment {
    font-size: 14px;
  }

  .real_payment_amount {
    color: #ff3633;
    font-weight: bold;
    font-size: 18px;
  }

  .distribution_info_box {
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #ededed;
  }

  .distribution_info_box:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .distribution_info_box div {
    float: left;
  }

  .distribution_info_box div:first-child {
    width: 28%;
  }

  .distribution_info_box div:last-child {
    padding-left: 5px;
    width: 72%;
    color: #999999;
    text-align: right;
  }

  .remarks_contetn {
    color: #9c9c9c;
    text-align: right;
  }

  .order_info {
    margin-bottom: 0.4rem;
  }

  .order_info_box {
    width: 100%;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #ededed;
  }

  .order_info_box:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .order_info_box div:first-child {
    float: left;
  }

  .order_info_box div:last-child {
    float: right;
    color: #999999;
  }

  .copy_order {
    padding: 1px 0.2rem;
    border: 1px solid #9b9b9b;
    color: #333333;
  }

  .old_footer_btn_box {
    width: 100%;
    border-top: 1px solid #ededed;
    margin-top: 0.4rem;
    padding: 0.4rem 0 0 0;
  }

  .footer_btn {
    width: 100%;
  }

  .footer_btn div {
    float: left;
    text-align: center;
    padding: 0.2rem 0.4rem;
    margin-right: 15px;
    color: #ffffff;
    font-size: 14px;
    background: #ff5d48;
    border-radius: 1px;
    border: 1px solid #ff5d48;
  }

  .footer_btn div.empty_color {
    background: white;
    color: #ff5d48;
    border: 1px solid #ff5d48;
  }

  .cancel_order_pop {
    width: 100%;
    padding: 0.4rem 0.6rem 0.4rem 0.4rem;
    background: white;
    position: fixed;
    bottom: 0;
    z-index: 9999;
  }

  .cancle_reason_list p {
    width: 100%;
    text-align: center;
    line-height: 30px;
    color: #333333;
  }

  .cancle_reason_list p.active {
    color: #ff6f59;
  }
</style>
