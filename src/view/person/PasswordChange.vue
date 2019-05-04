<template>
  <div class="container">
    <Form ref="formInline" inline>
      <FormItem prop="account">
        <h1>密码修改</h1>
      </FormItem>
    </Form>
    <Form ref="formdata" :model="formdata" :label-width="110" :rules="ruleValidate" :label-height="100">
      <FormItem label="请输入原密码：" prop="passwd">
        <Input type="password" v-model="formdata.passwd"></Input>
      </FormItem>
      <FormItem label="请输入新密码：" prop="newpasswd" >
        <Input type="password" v-model="formdata.newpasswd"></Input>
      </FormItem>
      <FormItem label="请再次输入密码：" prop="passwdCheck">
        <Input type="password" v-model="formdata.passwdCheck"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="change('formdata')">确定</Button>
        <Button @click="handleReset('formdata')" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formdata.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formdata.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formdata.newpasswd) {
        callback(new Error('两次密码不匹配!'))
      } else {
        callback()
      }
    }
    return {
      show: false,
      ruleValidate: {
        passwd: [
          {
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          }
        ],
        newpasswd: [
          { validator: validatePass, trigger: 'blur' }, {
            type: 'string',
            min: 3,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }
        ],
        passwdCheck: [
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      },
      formdata: {
        passwd: '',
        newpasswd: '',
        passwdCheck: ''
      }
    }
  },
  methods: {
    change (name) {
      let that = this
      this.$refs[name].validate((valid) => {
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })
        if (valid) {
          instance.post(that.GLOBAL.serverPath + '/member/passwordChange', {
            password: that.formdata.passwd,
            newPassword: that.formdata.newpasswd
          })
            .then(function (response) {
              if (response.data.success) {
                that.formdata.passwd = ''
                that.formdata.newpasswd = ''
                that.formdata.passwdCheck = ''
                alert('修改成功,请记住您的密码并重新登录～')
                that.$router.replace({path: '/'})
              } else {
                alert('修改失败：' + response.data.errMsg)
              }
            })
            .catch(function (error) {
              alert('服务器开小差啦～～ \n' + error.message)
            })
        } else {
          that.$Message.error('修改失败，请检查!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
