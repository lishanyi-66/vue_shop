<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 左边框 -->
      <div class="left_box">
        <img src="../assets/logo.png" alt="" />
        <div class="welcome">Welcome to our system</div>
        <div class="description">
          整个系统的后端管理，按功能划分为九大模块，包括商品组织管理、订单处理、内容发布管理等模块。
        </div>
      </div>
      <!-- 右边框 -->
      <div class="right_box">
        <!-- <div>还没有账号/<a href="#">去注册</a></div> -->
        <h1>LOGIN</h1>
        <!-- 登录表单区域 -->
        <el-form
          label-width="0px"
          class="login_form"
          :model="formInput"
          :rules="loginFormRules"
          ref="loginFormRef"
        >
          <!-- 用户名区域 -->
          <el-form-item label="" prop="username">
            <el-input
              v-model="formInput.username"
              prefix-icon="iconfont icon-yonghu"
            ></el-input>
          </el-form-item>
          <!-- 密码区域 -->
          <el-form-item label="" prop="password">
            <el-input
              v-model="formInput.password"
              type="password"
              prefix-icon="iconfont icon-mima"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <el-row class="login_button">
          <el-button type="primary" @click="loginForm">登录</el-button>
          <el-button type="info" @click="resetForm('loginFormRef')"
            >重置</el-button
          >
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formInput: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetForm () {
      //   console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    // 表单登录验证
    loginForm () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.formInput)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token','res.data.token')
        this.$router.push('/home')

      })
    }
  }
}
</script>>
<style lang="scss" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 700px;
    height: 450px;
    background-color: #fff;
    border-color: 3px;
    .left_box {
      float: left;
      width: 40%;
      height: 100%;
      background-color: #d44e4e;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      img {
        width: 80px;
        height: 80px;
      }
      .welcome {
        margin-top: 20px;
        text-align: center;
        font-size: 16px;
        color: white;
        font-weight: 500;
      }
      .description {
        color: #fff;
        font-size: 6px;
        width: 230px;
        margin-top: 90px;
      }
    }
    .right_box {
      float: right;
      width: 60%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      h1 {
        text-align: center;
        color: #d44e4e;
        margin-bottom: 40px;
      }
      .login_form {
        // padding: 0 40px;
        box-sizing: border-box;
        width: 85%;
        // background-color: yellow;
      }
      .login_button {
        margin-top: 40px;
        // display: flex;
        // justify-content: flex-end;
        // margin-right: 40px;
      }
    }
  }
}
</style>
