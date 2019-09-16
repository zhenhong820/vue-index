<template>
  <div class="login">
    <div class="form-wrap">
      <div class="header">
        <img src="./images/login_logo.png" alt />
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
        <!-- 有几行就要有几个el-form-item -->
        <!-- prop代表指定这一行用哪一条规则 -->
        <!-- 规则的名字必须跟表单元素绑定的属性一致,规则名字不能乱写，要写它绑定的属性名 -->
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-row>
            <el-col :span="12">
              <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="getCode" :disabled="isDisabled">{{ codeBtnTitle }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item prop="agree">
          <el-checkbox v-model="loginForm.agree"></el-checkbox>
          <span>
            我已阅读并同意
            <a href="javascript:void(0)">用户协议</a>和
            <a href="javascript:void(0)">隐私条款</a>
          </span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="isLoading" class="login-btn" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入axios
import axios from "axios";

export default {
  name: "login",
  data() {
    return {

      // 默认不需要加载中状态
      isLoading:false,

      // 默认文字叫 获取验证码
      codeBtnTitle:'获取验证码',

      // 默认不禁用  13911111111  18801185985
      isDisabled:false,

      loginForm: {
        mobile: "18801185985",
        code: "246810",
        agree: true
      },

      // 规则对象
      rules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          // { len:11, message:"手机号必须11位", trigger:"blur" },
          {
            pattern: /0?(13|14|15|18)[0-9]{9}/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          { len: 6, message: "长度为6位", trigger: "blur" }
        ],

        agree: [
          { pattern: /true/, message: "必须勾选同意协议", trigger: "click" }
        ]
      }
    };
  },

  methods: {
    // 登录的点击事件
    submitForm(formName) {
      //按钮变加载中
      this.isLoading = true;

      //formName传过来 'loginForm' 这个字符串
      //this.$refs[formName]相当于写的就是this.$refs['loginForm']
      // 这其实就是获取到这个表单dom对象
      // 调用validate方法验证整个表单是否匹配
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 如果整个表单匹配会进到if里
          // 发请求
          axios
            .post(
              "http://ttapi.research.itcast.cn/mp/v1_0/authorizations",
              this.loginForm
            )
            .then(res => {
              
              // 跳转之前保存数据
              let jsonStr = JSON.stringify(res.data.data)
              window.localStorage.setItem('userInfo',jsonStr)

              this.$message.success('登录成功！')
              this.$router.push("/home");
            })
            .catch(error => {
              // 把加载状态关闭
              this.isLoading = false;
              this.$message.error('账号或密码错误！')
            });
        } else {
          // 只要有一个不匹配就进到else里面
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 获取验证码的点击事件
    getCode(){

      // 以前DOM写法先找到按钮，再设置disabled属性为true
      // Vue的写法：直接去行内写一个 :disabled = "数据" 数据为true就禁用，数据为false就启用
      this.isDisabled = true;

      this.codeBtnTitle = "还有60秒"
      let sec = 60;

      // 记住：这里要用箭头函数，因为我们不需要改this的指向
      // 如果你用普通function，那么里面的this是window
      let timerID = setInterval(() => {

          //开始计时
          sec--
          this.codeBtnTitle = `还有${sec}秒`

          // 这代表59秒时自动填验证码
          if(sec == 59){

            this.loginForm.code = '246810'
          }

          if(sec == 0){
              // 停止计时器
              clearInterval(timerID)
              // 文字复原
              this.codeBtnTitle = "获取验证码"
              // 不要禁用
              this.isDisabled = false;
          }

      }, 1000);

    }
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background: url("./images/login_bg.jpg") no-repeat center / cover;

  display: flex;
  // 主轴居中
  justify-content: center;
  // 副轴居中
  align-items: center;

  .form-wrap {
    width: 300px;
    height: 300px;
    padding: 40px;
    background-color: #fff;

    .header {
      text-align: center;
      margin-bottom: 20px;

      img {
        width: 150px;
      }
    }

    .login-btn {
      width: 100%;
    }
  }
}
</style>