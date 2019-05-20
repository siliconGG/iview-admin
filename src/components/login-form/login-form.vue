<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code">
      <Row>
        <Col :xs="16" :sm="16" :md="16" :lg="16">
          <Input type="text" v-model="form.code" placeholder="请输入验证码">
            <span slot="prepend">
              <Icon :size="16" type="md-key" />
            </span>
          </Input>
        </Col>
        <Col :xs="8" :sm="8" :md="8" :lg="8">
          <h2 id="verifyCode" @click="createCode()">{{verifyCode}}</h2>
        </Col>
      </Row>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>
        登录
      </Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    codeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      verifyCode: 'hello',
      form: {
        userName: '',
        password: '',
        code: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        code: this.codeRules
      }
    }
  },
  mounted () {
    this.createCode()
  },
  methods: {
    handleSubmit () {
      let that = this
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (that.verifyCode.toLowerCase() === that.form.code.toLowerCase()) {
            this.$emit('on-success-valid', {
              userName: this.form.userName,
              password: this.form.password
            })
          } else {
            that.$Message.error('请填写正确的验证码!')
          }
        }
      })
    },
    createCode () {
      var code = ''
      var codeLength = 4
      var random = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (var i = 0; i < codeLength; i++) {
        var index = Math.floor(Math.random() * 36)
        code += random[index]
      }
      this.verifyCode = code
    }
  }
}
</script>
