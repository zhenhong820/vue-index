<template>
  <div class="login">
    <div class="form-wrap">
      <div class="header">
        <img src="./img/login_logo.png" alt />
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
              <el-button>获取验证码</el-button>
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
          <el-button type="primary" class="login-btn" @click="submitForm('loginForm')">登录</el-button>
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
      loginForm: {
        mobile: "",
        code: "",
        agree: false
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
    submitForm(formName) {
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
              // this.$message({
              //   message: "登录成功！",
              //   type: "success"
              // });
              this.$message.success('登录成功！')
              this.$router.push("/home");
            })
            .catch(error => {
             
              this.$message.error('账号或密码错误！')
            });
        } else {
          // 只要有一个不匹配就进到else里面
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background: url("./img/login_bg.jpg") no-repeat center / cover;

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