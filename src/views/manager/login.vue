<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{common.systemForm.Name+ $t('login.title') }}</h3>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.tel"
          @input="onNameChange"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          @blur="onTelBlurHandler"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item prop="captcha" style="width: 60%;float: left;">
        <span class="svg-container">
          <svg-icon icon-class="captcha" />
        </span>
        <el-input
          ref="captcha"
          v-model="loginForm.captcha"
          :placeholder="$t('login.code')"
          name="captcha"
          type="text"
          tabindex="3"
          autocomplete="off"
          style=" width: 75%;"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <div class="login-code" style=" width: 38%;height: 48px;float: right;">
        <img style="height: 48px;width: 100%;" :src="codeUrl" @click="getCode" />
      </div>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >{{ $t('login.logIn') }}</el-button>
    </el-form>
 
  </div>
</template>

<script>
import LangSelect from "@/components/LangSelect";
import { getCodeImg } from "@/api/manager";
import common from "@/utils/common";
import crypto from "crypto";
export default {
  name: "Login",
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length !== 11) {
        callback(new Error("电话号码必须11位数"));
      } else {
        callback();
      }
      codeUrl: "";
    };

    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    const validateCaptha = (rule, value, callback) => {
      if (value.length != 4) {
        callback(new Error(this.$t("login.code")));
      } else {
        callback();
      }
    };
    return {
      common,
      codeUrl: "data:image/png;base64,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",
      loginForm: {
        tel: "",
        password: "",
        captcha: ""
      },
      loginRules: {
        tel: [{ required: true, trigger: "blur", validator: validateUsername }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        captcha: [
          { required: true, trigger: "blur", validator: validateCaptha }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // this.getCode();
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    // if (this.loginForm.tel === "") {
    this.$refs.username.focus();
    // } else if (this.loginForm.password === "") {
    //   this.$refs.password.focus();
    // }else if (this.loginForm.captcha === "") {
    //   this.$refs.captcha.focus();
    // }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getCode() {
      getCodeImg(this.loginForm.tel).then(res => {
        this.codeUrl = res.data;
      });
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    onNameChange() { 
      this.loginForm.tel = this.loginForm.tel.trim(); 
    },
    onTelBlurHandler() {
      if (this.loginForm.tel.length != 11) {
        return;
      }
      this.getCode();
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const submitData = {};
          Object.assign(submitData, this.loginForm);
          // 加密
          const md5 = crypto.createHash("md5");
          md5.update(submitData.password);
          submitData.password = md5.digest("hex");
          submitData.captcha = this.loginForm.captcha;
          this.$store
            .dispatch("manager/login", submitData)
            .then(() => {
              this.$store.dispatch("app/getPlatformList").then(() => {});
              this.$store
                .dispatch("app/getCollegeWithCourseKind")
                .then(() => {});

              // this.$store.dispatch("app/getAllCourseKind").then(() => {});

              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery
              });
            })
            .catch(err => {
              return false;
            });
        } else {
          return false;
        }
        this.loading = false;
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://gitee.com/luonannet/EduAdmin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {

 

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    background-image: linear-gradient(to top, #30cfd0 0%, #330867 100%);
    border-radius: 10px;
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 20px 35px 0;
    margin: 150px auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
