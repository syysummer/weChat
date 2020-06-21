<template>
  <div class="balance_pay" v-if="balanceVisible">
    <div class="balance_content" v-loading="loading">
      <div class="title">
        <div class="close" @click="closeMotal">
          <img src="../assets/icons/Closex.png" alt="">
        </div>
        <div>{{living_payment.please_payment_password}}</div>
      </div>
      <div class="input">
        <input type="password" readonly v-for="(elem, index) in passList" :key="index" v-model="elem.value" />
      </div>
      <div class="forgetPass" @click="forgetPass">{{living_payment.forget_password}}</div>
      <div class="number_btn">
        <ul>
          <li v-for="(item, index) in numList" :class="{li_none: item=='null'}" :key="index" @touchstart="subNum(item)">
            <img src="../assets/icons/delete_close.png" alt="" v-if="item=='deletes'">
            <span v-else-if="item=='null'"></span>
            <span v-else>{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      balanceVisible: false,
      numList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'null', 0, 'deletes'],
      passList: [
        { value: null },
        { value: null },
        { value: null },
        { value: null },
        { value: null },
        { value: null }
      ],
      password: [],
      currentIndex: -1,
      loading: false,
      userInfo: ''
    }
  },
  watch: {
    currentIndex(newVal, oldVal) {
      if (newVal <= -1) {
        this.currentIndex = -1
      } else if (newVal >= 5) {
        this.$emit('passwordPay', this.password.join(',').replace(/,/g, ''))
        this.loading = true
      }
    }
  },
  computed: {
    living_payment() {
      let living_payment = this.$t('living_payment')
      return living_payment
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInformation'))
  },
  methods: {
    forgetPass() {
      this.$router.push({
        path: '/set_payment',
        query: {
          num: this.userInfo.memberObj.paymentpwdFlag,
          url: this.$route.fullPath
        }
      })
    },
    open() {
      this.balanceVisible = true
    },
    closeMotal() {
      this.loading = false
      this.passList = [
        { value: null },
        { value: null },
        { value: null },
        { value: null },
        { value: null },
        { value: null }
      ]
      this.password = []
      this.currentIndex = -1
      this.balanceVisible = false
    },
    reset() {
      this.loading = false
    },
    subNum(item) {
      switch (item) {
        case 'null':
          break
        case 'deletes':
          if (this.currentIndex > -1) {
            this.password.pop()
            this.passList[this.currentIndex].value = null
            this.currentIndex--
          }
          break
        default:
          if (this.currentIndex < 5) {
            this.password.push(item)
            this.currentIndex++
            this.passList[this.currentIndex].value = item
          }
          break
      }
    }
  }
}
</script>
<style scoped lang="scss">
.balance_pay {
  z-index: 1000;
  width: 100%;
  background: rgba($color: #000000, $alpha: 0.3);
  height: 100vh;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .balance_content {
    height: 60vh;
    background: #fff;
    position: fixed;
    bottom: 0;
    .title {
      display: flex;
      height: 8vh;
      line-height: 8vh;
      padding: 0 30px 0 20px;
      .close {
        width: 15px;
        img {
          width: 100%;
          margin-bottom: -3px;
        }
      }
      div {
        &:last-child {
          text-align: center;
          width: 97%;
          color: #333;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
    .input {
      width: 90%;
      margin: 2vh auto;
      height: 9vh;
      display: flex;
      input {
        border: 1px solid #dddddd;
        &:last-child {
          border-right: 1px solid #dddddd;
        }
        width: 15%;
        height: 8vh;
        flex: 1;
        font-size: 24px;
        text-align: center;
        border-right: none;
      }
    }
    .forgetPass {
      color: #4ea8f0;
      font-size: 12px;
      padding-right: 20px;
      height: 4vh;
      text-align: right;
    }
    .number_btn {
      background: rgba(210, 213, 219, 0.9);
      height: 35vh;
      ul {
        width: 96%;
        margin: auto;
        padding: 10px 0 0;
        overflow: hidden;
        // display: flex;
        li {
          &:last-child {
            background: none;
            margin-right: 0;
            box-shadow: none;
            img {
              width: 25px;
              margin-bottom: -6px;
            }
          }
          &:nth-child(3),
          &:nth-child(6),
          &:nth-child(9) {
            margin-right: 0;
          }
          float: left;
          width: 31.5%;
          height: 7vh;
          line-height: 7vh;
          margin-right: 8px;
          margin-bottom: 8px;
          text-align: center;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 1px 2px #848688;
        }
        .li_none {
          background: none;
          box-shadow: none;
        }
      }
    }
    .delete_btn {
      clear: both;
    }
  }
}
@media screen and(max-width: 329px) {
  .balance_pay {
    .balance_content {
      .title {
        div {
          &:last-child {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
