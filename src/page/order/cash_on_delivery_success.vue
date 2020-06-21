<template>
  <div class="select_pay_method">
    <div class="phoneHeader">
      <publicHeader :title="select_pay_method.order_success"></publicHeader>
    </div>

    <div class="pay_container_body">
      <div class="pay_container">
        <div class="bg_box"></div>
        <div class="zhanwei_box"></div>

        <div class="success_body">
          <div class="success_box">
            <div class="success_icon_box">
              <img src="../../assets/icons/order_success_icon.png" />
            </div>
            <div class="order_success_title">
              {{select_pay_method.order_success}}
            </div>
            <p>
              {{select_pay_method.paymethod}}：{{select_pay_method.cod}}
            </p>
            <p>
              {{select_pay_method.amount}}：<span>{{actual_price}}P</span>
            </p>

            <div class="order_success_btn_box">
              <div class="back_home" @click="back_home">
                {{select_pay_method.back_home}}
              </div>
              <div class="look_order" @click="look_order">
                {{select_pay_method.look_order}}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import publicHeader from '@/components/opacity_header.vue'
  import store from '../../store'
  import {
    getCookie
  } from '../../utils/cookies'
  export default {
    name: 'cash_on_delivery_success',
    data() {
      return {

      }
    },
    components: {
      publicHeader
    },
    computed: {
      select_pay_method() {
        let select_pay_method = this.$t('select_pay_method')
        return select_pay_method
      },
      actual_price() {
        return store.state.pay_methods.actual_price
      }
    },
    created() {
      this.lang = getCookie('lang')
    },
    methods: {
      back_home() {
        this.$router.push('/home')
      },
      look_order() {
        localStorage.setItem('order_detail_id', this.$route.query.id)
        this.$router.push({
          path: '/order_details',
          query: {
            id: this.$route.query.id
          }
        });
      }
    }

  }

</script>

<style scoped>
  .select_pay_method {
    height: 100%;
  }

  .phoneHeader {
    position: absolute;
    width: 100%;
    height: 7%;
    top: 0;
    z-index: 1;
  }

  .bg_box {
    width: 100%;
    height: 15vh;
    background: url(../../assets/images/order_details_header_bg.png);
    position: absolute;
    z-index: -1;
  }

  .zhanwei_box {
    width: 100%;
    height: 50px;
  }

  .pay_container_body {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  .success_body {
    padding: 0.4rem;
  }

  .success_box {
    background: #ffffff;
    border-radius: 5px;
    padding: 1rem 0.4rem;
  }

  .success_icon_box {
    width: 2.5rem;
    height: 2.5rem;
    margin: auto;
  }

  .success_icon_box img {
    width: 100%;
    height: 100%;
  }

  .order_success_title {
    font-size: 16px;
    color: #333333;
    text-align: center;
    margin-bottom: 0.6rem;
  }

  .success_box p {
    color: #666666;
    text-align: center;
    line-height: 20px;
  }

  .success_box p span {
    font-size: 16px;
    font-weight: bold;
    color: #FF5D48;
  }

  .order_success_btn_box {
    width: 100%;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #ededed;
    display: flex;
    justify-content: center;
  }

  .back_home {
    float: right;
    background: #FF5D48;
    border: 1px solid #FF5D48;
    padding: 0.15rem 0.3rem;
    border-radius: 4px;
    color: #ffffff;
    margin-right: 0.4rem;
  }

  .look_order {
    float: right;
    border: 1px solid #FF5D48;
    padding: 0.15rem 0.3rem;
    border-radius: 4px;
    color: #FF5D48;
  }

</style>
