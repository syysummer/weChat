<template>
  <div class="orderList">
    <div class="contain" id="scrollWrap">
      <!-- <div class="header_contain">
      <publicHeader :title="get_en.title"></publicHeader>
    </div> -->
      <div class="tab_list">
        <div :class="{hover: select_order_status==1, iphone5: isIphone5, iphoneX: isIphoneX}" @click="get_order_list(1)">{{get_en.all_order}}</div>
        <div :class="{hover: select_order_status==2, iphone5: isIphone5, iphoneX: isIphoneX}" @click="get_order_list(2)">{{get_en.to_evaluated}}</div>
        <div :class="{hover: select_order_status==3, iphone5: isIphone5, iphoneX: isIphoneX}" @click="get_order_list(3)">{{get_en.refund_orm}}</div>
      </div>

      <!-- 未登录状态 -->
      <div class="empty_order" v-if="not_logged">
        <img src="../../assets/images/img_empty_order.png" />
        <p>{{get_en.not_logged}}</p>
        <router-link :to="{ path: '/login',query:{from_path: this.$route.name}}">
          {{get_en.go_to_login}}
        </router-link>
      </div>

      <!-- 订单列表为空 -->
      <div class="empty_order_list" v-if="empty_order_list && !not_logged">
        <img src="../../assets/images/img_empty_order.png" />
        <p>{{get_en.no_order}}</p>
        <router-link to="/home">
          {{get_en.go_and_look}}
        </router-link>
      </div>

      <div class="order_list" :class="{iphone5: isIphone5, iphone6: isIphone6, iphoneP: isIphoneP, iphoneX: isIphoneX}" v-if="!not_logged">

        <div class="order_item" v-for="(item, index) in order_list" :key="index">
          <div class="order_section">
            <div class="shop_img">
              <img :src="item.seller_picture" />
            </div>
            <div class="order_details">
              <div class="content_header">
                <span class="shop_name" @click="to_seller_home(item.seller_id)">{{item.seller_name}}</span>
                <img @click="to_seller_home(item.seller_id)" class="shop_arrow" src="../../assets/icons/icon_arrow_right.png" />
                <span class="order_status" @click="to_order_details(item.id)">
                  <!-- 商家待接单 -->
                  <span class="order_status" v-if="item.rerund_status==0 && (item.order_status==1)">{{get_en.status.hasPay}}</span>
                  <!-- 订单待付款 -->
                  <span class="order_status" v-if="item.rerund_status==0 && item.order_status==0">{{get_en.status.sub}}</span>
                  <!-- 制作配送中 -->
                  <span class="order_status" v-if="item.rerund_status==0 && item.order_status==2">{{get_en.status.distribution}}</span>
                  <!-- 制作配送中 -->
                  <span class="order_status" v-if="item.rerund_status==0 && item.order_status==4">{{get_en.status.distribution}}</span>
                  <!-- 制作配送中 -->
                  <span class="order_status" v-if="item.rerund_status==0 && item.order_status==9">{{get_en.status.distribution}}</span>
                  <!-- 制作配送中 -->
                  <span class="order_status" v-if="item.rerund_status==0 && (item.order_status==3 || item.order_status==5)">{{get_en.status.distribution}}</span>
                  <!-- 订单待评价 -->
                  <span class="order_status" v-if="item.rerund_status==0 && item.order_status==6">{{get_en.status.isComment}}</span>
                  <!-- 订单退款中 -->
                  <span class="order_status" v-if="(item.rerund_status==1 || item.rerund_status==3) && item.is_order_payment!=2">{{get_en.status.refunding}}</span>
                  <!-- 审核处理中 -->
                  <span class="order_status" v-if="(item.rerund_status==1 || item.rerund_status==3) && item.is_order_payment==2">{{get_en.status.under_details}}</span>
                  <!-- 订单已退款 -->
                  <span class="order_status" v-if="item.rerund_status==4 && item.order_status==7 && item.is_order_payment==2">{{get_en.status.hasCancle}}</span>
                  <span class="order_status" v-if="item.rerund_status==4 && item.order_status==7 && item.getSellerOrderTime==null && item.is_order_payment!=2">{{get_en.status.hasCancle}}</span>
                  <span class="order_status" v-if="item.rerund_status==4 && item.order_status==7 && item.getSellerOrderTime!=null && item.is_order_payment!=2">{{get_en.status.refComplete}}</span>
                  <!-- 订单拒绝退款 -->
                  <span class="order_status" v-if="item.rerund_status==2">{{get_en.status.distribution}}</span>
                  <!-- 订单已取消 -->
                  <span class="order_status" v-if="item.rerund_status==0 && item.order_status==7 && item.getSellerOrderTime==null">{{get_en.status.hasCancle}}</span>
                  <span class="order_status" v-if="item.rerund_status==0 && item.order_status==7 && item.getSellerOrderTime!=null">{{get_en.status.refComplete}}</span>
                  <!-- 订单已完成 -->
                  <span class="order_status" v-if="item.rerund_status==0 && item.order_status==8">{{get_en.status.commented}}</span>
                </span>

              </div>
              <div class="content_middle" @click="to_order_details(item.id)">
                {{get_en.goods}}:
                <span>{{item.order_goods_num}}</span>&nbsp;&nbsp;|&nbsp;&nbsp;{{get_en.payment}}:
                <span>{{item.actual_price}}P</span>
              </div>
              <div class="content_footer" @click="to_order_details(item.id)">
                <span class="single_hide order_name_box" v-show="lang=='zh'">
                  {{arr_split(item.order_name)}}
                </span>
                <span style="font-size: 13px; color: black;" v-show="lang=='zh'" v-if="item.order_goods_num > 1">等
                  <span>{{item.order_goods_num}}</span> 件商品</span>

                <span style="font-size: 13px; color: black;" v-show="lang=='en'" v-if="item.order_goods_num > 1">
                  <span>{{item.order_goods_num}}</span> goods,such as&nbsp;</span>
                <span class="single_hide order_name_box" v-show="lang=='en'">
                  {{arr_split(item.order_name)}}
                </span>
              </div>
            </div>
          </div>
          <div class="btn_area">
            <!-- 需求变更——该文字不再显示 -->
            <!-- <span style="color: #5BA6FF; font-size: 14px; border: 1px solid white; position: absolute; left: 0;" v-if="item.rerund_status==2">
              {{$t('order.status.refRefuse')}}
            </span> -->
            <!-- 再来一单 modify-->
            <a class="details" @click="to_seller_home(item.seller_id,item.id)" v-if="item.order_status == 6 || item.order_status == 7 || item.order_status == 8">
              {{get_en.single_again}}
            </a>
            <!-- 去支付 -->
            <router-link :to="'/selectPayMethod?id='+item.id" class="pay" v-if="item.rerund_status==0 && item.order_status==0">
              {{get_en.list.toPay}}
            </router-link>
            <!-- 审核详情 -->
            <router-link :to="'/review_details?id='+item.id" class="details" v-if="item.is_order_payment==2 && item.rerund_status!=0 && item.rerund_status!=2 && item.rerund_status!=4">
              {{get_en.list.reviewDetail}}
            </router-link>
            <!-- 退款详情 -->
            <router-link :to="'/refund_details?id='+item.id" class="details" v-if="(item.rerund_status==1 || item.rerund_status==3) && item.is_order_payment!=2">
              {{get_en.list.toRefundDetail}}
            </router-link>
            <!-- 退款详情 -->
            <router-link :to="'/refund_details?id='+item.id" class="details" v-if="item.rerund_status==4 && item.order_status==7 && item.getSellerOrderTime!=null && item.is_order_payment!=2">
              {{get_en.list.toRefundDetail}}
            </router-link>
            <!-- 去评价 -->
            <router-link :to="'/evaluate?id='+item.id" class="details" v-if="item.rerund_status==0 && item.order_status==6">
              {{get_en.list.toEvaluate}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==2 && item.order_status==2">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==1 && item.order_status==3">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==2 && item.order_status==3">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==2 && item.order_status==4">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==1 && item.order_status==9">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==2 && item.order_status==9">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==0 && item.order_status==2">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==0 && item.order_status==3">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==0 && item.order_status==4">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==0 && item.order_status==9">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 配送详情 -->
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==3 || item.order_status==5 && item.rerund_status!=1">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <router-link :to="'/distribution_details?id='+item.id" class="details" v-if="item.rerund_status==1 && (item.order_status==2 || item.order_status==5)">
              {{get_en.list.toDeliveyDetail}}
            </router-link>
            <!-- 查看详情 -->
            <!-- <a href="javascript:;" class="details" v-if="item.rerund_status==0 && item.order_status==1">
              <div @click="to_order_details(item.id)">
                {{get_en.list.orderDetail}}
              </div>
            </a> -->
            <!-- 查看详情 -->
            <!-- <a href="javascript:;" class="details" v-if="item.rerund_status==0 && (item.order_status==7 || item.order_status==8)">
              <div @click="to_order_details(item.id)">
                {{get_en.list.orderDetail}}
              </div>
            </a> -->
            <!-- 查看详情 -->
            <!-- <a href="javascript:;" class="details" v-if="item.rerund_status==4 && item.order_status==7 && item.getSellerOrderTime==null">
              <div @click="to_order_details(item.id)">
                {{get_en.list.orderDetail}}
              </div>
            </a> -->

          </div>
        </div>

        <!-- 加载更多 -->
        <div class="load_more" v-if="loading&&!empty_order_list">
          <img src="../../assets/icons/is_loading.gif" />
        </div>
        <!-- <div class="load_more" v-if="!loading&&!empty_order_list">
        {{$t('seller_list_card.list_over')}}
      </div> -->

      </div>
    </div>
  </div>
</template>

<script>
  import store from '../../store'
import publicHeader from '@/components/public_header.vue'
import { getCookie } from '../../utils/cookies'
export default {
  name: 'order',
  data() {
    return {
      not_logged: false,
      select_order_status: 1,
      currentPage: 1,
      order_name: '',
      order_length: '',
      isIphoneX: false,
      isIphoneP: false,
      isIphone6: false,
      isIphone5: false,
      isLogin: false,
      lang: '',
      empty_order_list: false
    }
  },
  components: {
    publicHeader
  },
  computed: {
    get_en() {
      return this.$t('order')
    },
    order_list() {
      return store.state.order_list.orderCommentList
    },
    loading() {
      return store.state.order_loading
    }
  },
  beforeCreate() {
    store.state.order_loading = false
  },
  created() {
    this.checkLogin()
    store.state.order_list.currentPage = 1
    this.lang = getCookie('lang')
    this.isLogin = localStorage.getItem('hasLog')
    if (!this.isLogin || this.isLogin == 0) {
      this.not_logged = true
    } else {
      if (sessionStorage.getItem('select_order_status')) {
        this.select_order_status = sessionStorage.getItem('select_order_status')
        this.get_order_list_fn()
        return
      } else {
        sessionStorage.setItem('select_order_status', 1)
        this.select_order_status = sessionStorage.getItem('select_order_status')
        this.get_order_list_fn()
      }
    }

    let ALL_HEIGHT = document.body.clientHeight
    let is_iOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if (is_iOS) {
      if (ALL_HEIGHT > 630 && ALL_HEIGHT < 640) {
        this.isIphoneX = true
      } else if (ALL_HEIGHT > 545 && ALL_HEIGHT < 560) {
        this.isIphone6 = true
      } else if (ALL_HEIGHT > 610 && ALL_HEIGHT < 630) {
        this.isIphoneP = true
      } else if (ALL_HEIGHT > 450 && ALL_HEIGHT < 470) {
        this.isIphone5 = true
      }
    }
  },
  mounted() {
    store.state.order_list.currentPage = 1
    window.scroll(0, 0)
    // 加载更多
    if (this.isLogin == 1) {
      window.addEventListener('scroll', this.scrollList)
    }
  },
  methods: {
    checkLogin() {
      store
        .dispatch('userInfoApi')
        .then(res => {
          if (res.data.code == 1) {
            store.state.is_login = res.data.code == 1 && true
            localStorage.setItem('hasLog', 1)
          } else if (res.data.code == 9999) {
            this.toast.error(res.data.message)
            localStorage.setItem('hasLog', 0)
          }
        })
        .catch(err => {
          store.state.is_login = err.status == 401 || false
          localStorage.setItem('hasLog', 0)
          let code = sessionStorage.getItem('wechatCode')
          let openId = ''
          if (code && localStorage.getItem('hasLog') != 1) {
            store.state.wechatCode = code
            console.log('openId', localStorage.getItem('openId'))
            if (!localStorage.getItem('openId')) {
              store.dispatch('getOpenId').then(res => {
                console.log(res)
                let openId = res.data.data.openid
                localStorage.setItem('openId', openId)
                store
                  .dispatch('loginApi', {
                    loginType: 5,
                    clientType: 2,
                    vCodeId: sessionStorage.getItem('vCodeId'),
                    authorizeToken: openId
                  })
                  .then(res => {
                    console.log(res)
                    if (res.data.data.authorizeToken) {
                      sessionStorage.setItem('flag', res.data.data.flag)
                    } else {
                      let userInformation = JSON.stringify(
                        res.data.data.userObj
                      )
                      localStorage.setItem('userInformation', userInformation)
                      this.toast.success(res.data.message)
                      localStorage.setItem('hasLog', 1)
                      store.state.is_login = res.data.code == 1 && true
                    }
                  })
              })
            } else if (localStorage.getItem('hasLog') != 1) {
              openId = localStorage.getItem('openId')
              store
                .dispatch('loginApi', {
                  loginType: 5,
                  clientType: 2,
                  vCodeId: sessionStorage.getItem('vCodeId'),
                  authorizeToken: openId
                })
                .then(res => {
                  console.log(res)
                  if (res.data.data.authorizeToken) {
                    sessionStorage.setItem('flag', res.data.data.flag)
                  } else {
                    let userInformation = JSON.stringify(res.data.data.userObj)
                    localStorage.setItem('userInformation', userInformation)
                    this.toast.success(res.data.message)
                    localStorage.setItem('hasLog', 1)
                    store.state.is_login = res.data.code == 1 && true
                  }
                })
            }
          }
        })
    },
    to_cancel(id) {
      store
        .dispatch('cancelTheOrder', {
          orderId: id
        })
        .then(res => {
          this.get_order_list_fn()
        })
        .catch(err => {
          console.error(err)
        })
    },
    arr_length(arr) {
      if (!arr) return
      let result = arr.split(',')
      return result.length
    },
    arr_split(arr) {
      if (!arr) return
      let result = arr.split(',')
      return result[0]
    },
    to_order_details(id) {
      localStorage.setItem('order_detail_id', id)
      this.$router.push({
        path: '/order_details',
        query: {
          id: id
        }
      })
    },
    // 进入商家首页 modify
    to_seller_home(id, orderId) {
      this.$router.push({
        path: '/business_shop',
        query: {
          id: id,
          order_again_id: orderId,
          pathName: this.$route.name
        }
      })
    },
    // 改变获取订单列表status
    get_order_list(type) {
      document.querySelector('.order_list').scrollTop = 0
      store.state.order_list.currentPage = 1
      sessionStorage.setItem('select_order_status', type)
      this.select_order_status = sessionStorage.getItem('select_order_status')
      this.get_order_list_fn()
    },
    // 获取订单列表
    get_order_list_fn() {
      store
        .dispatch('orderList', {
          status: this.select_order_status,
          currentPage: store.state.order_list.currentPage,
          showCount: 5
        })
        .then(res => {
          let data = res.data
          if (data.code == 1) {
            if (!data.data.orderCommentList) {
              store.state.order_list.orderCommentList = []
            } else {
              Object.assign(store.state.order_list, data.data)
              if (this.select_order_status == 3) {
                // for (let i = 0; i < data.data.orderCommentList.length; i++) {
                //   if (
                //     data.data.orderCommentList[i].getSellerOrderTime == null
                //   ) {
                //     store.state.order_list.orderCommentList.splice(i, 1)
                //   }
                // }
                // store.state.order_list.orderCommentList = new_arr
              }
            }
            if (store.state.order_list.orderCommentList.length == 0) {
              this.empty_order_list = true
            } else {
              this.empty_order_list = false
            }
          }
        })
        .catch(err => {
          console.error(err)
          if (err.status == 401) {
            this.not_logged = true
          }
        })
    },
    // 获取订单详情
    get_order_details(id) {
      store
        .dispatch('orderDetails', {
          orderId: id
        })
        .then(res => {})
        .catch(err => {
          console.error(err)
        })
    },
    mousemove() {
      // document.querySelector('.tab_list').style.position = 'absolute'
    },
    // 滚动加载
    scrollList() {
      store.state.loading_img = false

      if (store.state.is_loading) {
        return
      }
      if (
        store.state.order_list.currentPage >= store.state.order_list.totalPage
      ) {
        store.state.order_loading = false

        return
      } else {
        store.state.order_loading = true
      }
      var seller_list_top_box = document.documentElement.offsetHeight
      var scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop
      var clientHeight = document.documentElement.clientHeight
      var scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight - scrollHeight >= -350) {
        store.state.order_list.currentPage++
        store
          .dispatch('orderList', {
            status: this.select_order_status,
            currentPage: store.state.order_list.currentPage,
            showCount: 5
          })
          .then(res => {
            let data = res.data
            store.state.order_list.totalPage = data.data.totalPage
            store.state.order_list.orderCommentList = store.state.order_list.orderCommentList.concat(
              data.data.orderCommentList
            )

            store.state.loading_img = true
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        store.state.order_loading = false
      }
    }
  }
}
</script>

<style lang="scss" type="text/css" scoped>
  .orderList {
    // height: 100%;
    // width: 100%;
    // position: fixed;
    // left: 0;
    // top: 0;
  }

  .contain {
    height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    position: relative;

    .header_contain {
      position: fixed;
      width: 100%;
      height: 7%;
      top: 0;
      z-index: 1;
    }

    .tab_list {
      display: -webkit-box;
      height: 45px;
      position: fixed;
      z-index: 10;
      top: 0;
      width: 100%;

      div {
        width: 25%;
        background: #fafafa;
        border-top: 1px solid #dddddd;
        border-bottom: 1px solid #dddddd;
        text-align: center;
        padding: 0.4rem 0;
        -webkit-box-flex: 1;
        font-size: 14px;
        color: #666666;
        position: relative;

        &.hover {
          color: #ff644c;
          border-bottom: 2px solid #ff3633;
        }

        // &:hover::before,
        // &.hover::before {
        //   content: "";
        //   width: 80px;
        //   height: 2px;
        //   background-color: #ff3633;
        //   position: absolute;
        //   bottom: -1px;
        //   left: 50%;
        //   margin-left: -40px;
        // }
      }

      // div.iphone5 {
      //   // &:hover::before,
      //   // &.hover::before {
      //   //   content: "";
      //   //   width: 80px;
      //   //   height: 2px;
      //   //   background-color: #ff3633;
      //   //   position: absolute;
      //   //   bottom: -1px;
      //   //   left: 50%;
      //   //   margin-left: -40px;
      //   // }
      // }
      // div.iphoneX {
      //   &:hover::before,
      //   &.hover::before {
      //     content: "";
      //     width: 80px;
      //     height: 2px;
      //     background-color: #ff3633;
      //     position: absolute;
      //     bottom: -6px;
      //     left: 50%;
      //     margin-left: -40px;
      //   }
      // }
    }

    .order_list {
      /* height: 78%; */
      height: 85%;
      overflow-y: auto;
      /* position: absolute; */
      /* top: 14%; */
      /* top: 7%; */
      width: 100%;
      padding-top: 45px;

      .order_item {
        margin-bottom: 10px;
        background-color: #fff;

        .order_section {
          padding: 0.4rem;
          display: flex;
          flex-flow: row;

          .shop_img {
            flex-grow: 0;
            width: 2rem;
            height: 2rem;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border: 1px solid #ddd;
            }
          }

          .order_details {
            flex-grow: 1;
            display: flex;
            flex-flow: column;
            padding-left: 0.4rem;

            .content_header {
              .shop_name {
                color: #333;
                font-size: 16px;
                display: block;
                float: left;
                max-width: 3.5rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .shop_arrow {
                margin-left: 0.1rem;
                width: 0.5rem;
                vertical-align: middle;
              }

              .order_status {
                font-size: 16px;
                color: #666;
                float: right;
                /* font-weight: bold; */
              }
            }

            .content_middle {
              font-size: 14px;
              color: #666;
              padding: 0.2rem 0;

              span {
                font-size: 14px;
                color: #333;
                /* font-weight: bold; */
              }
            }

            .content_footer {
              font-size: 12px;
              color: #999;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              display: flex;
              align-items: center;

              .order_name_box {
                max-width: 5rem;
                display: block;
                margin-right: 5px;
              }
            }
          }
        }

        .btn_area {
          font-size: 14px;
          border-top: 1px dotted #eee;
          margin: 0 0.4rem;
          padding: 0.4rem 0;
          text-align: right;
          line-height: 1rem;
          position: relative;

          a {
            display: inline-block;
            text-align: center;
            /* width: 3rem; */
            padding: 0 0.4rem;
            height: 1rem;
            line-height: 0.9rem;
            border: 1px solid #e65a45;
            border-radius: 4px;
            font-size: 12px;

            &.pay {
              color: #fff;
              background-color: #ff644c;
            }

            &.details {
              color: #ff644c;
              background-color: #ffefed;
            }

            div {
              font-size: 12px;
            }
          }
        }
      }
    }

    // .order_list.iphoneP {
    //   height: 67.5vh;
    // }
    // .order_list.iphone5 {
    //   height: 64.3vh;
    // }
    // .order_list.iphoneX {
    //   height: 63vh;
    // }
    // .order_list.iphone6 {
    //   height: 66vh;
    // }
    .empty_order {
      // height: 77vh;
      width: 100%;
      position: fixed;
      top: 20%;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;

      img {
        width: 5rem;
      }

      p {
        font-size: 13px;
        padding: 0 2rem;
        text-align: center;
        margin-top: 0.5rem;
        color: #666;
      }

      a {
        background-color: #ff644d;
        width: 3rem;
        height: 1rem;
        text-align: center;
        line-height: 1rem;
        color: #fff;
        font-size: 12px;
        border-radius: 8px;
        margin-top: 0.2rem;
      }
    }

    .empty_order_list {
      height: 77vh;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;

      img {
        width: 5rem;
      }

      p {
        font-size: 13px;
        padding: 0 2rem;
        text-align: center;
        margin-top: 0.5rem;
        color: #666;
      }

      a {
        background-color: #ff644d;
        // width: 3rem;
        padding: 0 0.4rem;
        height: 1rem;
        text-align: center;
        line-height: 1rem;
        color: #fff;
        font-size: 12px;
        border-radius: 8px;
        margin-top: 0.2rem;
      }
    }
  }

  @media screen and(max-width: 329px) {

    .contain .order_list .order_item .order_section .order_details .content_header .shop_name,
    .contain .order_list .order_item .order_section .order_details .content_header .order_status {
      font-size: 14px;
    }
  }
</style>
