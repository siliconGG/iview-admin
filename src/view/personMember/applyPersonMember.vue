<template>
  <Form ref="formdata" :model="formdata" :rules="ruleValidate" :label-width="80">
    <h1 style="align-content: center">填写学会申请信息</h1>
    <Row>
      <Col span="6">
        <FormItem label="姓名：" prop="name">
          <Input v-model="formdata.name" placeholder="填入您的姓名"></Input>
        </FormItem>
      </Col>
      <Col span="4">
        <FormItem label="性别：" prop="sex">
              <RadioGroup v-model="formdata.sex">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
              </RadioGroup>
        </FormItem>
      </Col>
      <Col span="6">
        <FormItem label="生日：">
          <FormItem prop="formatBirthday">
            <DatePicker type="date" confirm format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择您的生日" v-model="formdata.formatBirthday"></DatePicker>
          </FormItem>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="民族：">
          <Input v-model="formdata.ethnic" placeholder="填入您的民族（可选）"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <FormItem label="学会：" prop="instId">
          <Select v-model="formdata.instId" placeholder="填入您加入的学会">
            <Option v-for="item in instList" :value="item.instId" :key="item.instId">{{item.instName}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="党派：">
          <Input v-model="formdata.partisan" placeholder="填入您的党派（可选）"></Input>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="学历：">
          <Select v-model="formdata.educationId" placeholder="请选择学历">
            <Option value="0">初中</Option>
            <Option value="1">高中</Option>
            <Option value="2">大专</Option>
            <Option value="3">本科</Option>
            <Option value="4">硕士</Option>
            <Option value="5">博士</Option>
            <Option value="6">博士后</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <FormItem label="邮箱：" prop="mail">
          <Input v-model="formdata.mail" placeholder="填入您的邮箱"></Input>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="qq：">
          <Input v-model="formdata.qq" placeholder="填入您的qq（可选）"></Input>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="微信：">
          <Input v-model="formdata.wechat" placeholder="填入您的微信（可选）"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <FormItem label="电话：" prop="phone1">
          <Input v-model="formdata.phone1" placeholder="填入您的电话"></Input>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="备用电话：" prop="phone2">
          <Input v-model="formdata.phone2" placeholder="填入您的备用电话（可选）"></Input>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="其他联系方式：">
          <Input v-model="formdata.others" placeholder="其他联系方式（可选）"></Input>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="社会任职情况：">
      <Input v-model="formdata.personPublicDuty" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="社会任职情况（可选）"></Input>
    </FormItem>
    <FormItem label="获奖情况：">
      <Input v-model="formdata.personAwards" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="获奖情况（可选）"></Input>
    </FormItem>
    <FormItem label="备注" prop="memo">
      <Input v-model="formdata.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="随便说点什么呗"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('formdata')">申请</Button>
      <Button @click="handleReset('formdata')" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>
<script>
  import axios from '@/libs/api.request'

  export default {
    data () {
      return {
        formdata: {
          msg: '',
          name: '',
          mail: '',
          phone1: '',
          phone2: '',
          qq: '',
          wechat: '',
          others: '',
          instId: '',
          educationId: '',
          personPublicDuty: '',
          personAwards: '',
          sex: '',
          ethnic: '',
          partisan: '',
          formatBirthday: '',
          time: '',
          memo: ''
        },
        ruleValidate: {
          name: [
            { required: true, message: '名字不能为空！', trigger: 'blur' }
          ],
          mail: [
            { required: true, message: '邮箱不能为空！', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确！请检查！', trigger: 'blur' }
          ],
          phone1: [
            { required: true, message: '电话不能为空！', trigger: 'blur' },
            { type: 'string', min: 11, max: 11, message: '电话号码为11位！请校验', trigger: 'blur' }
          ],
          instId: [
            { required: true, message: '请选择您参加的学会！', trigger: 'change' }
          ],
          sex: [
            { required: true, message: '请选择你的性别！', trigger: 'change' }
          ],
          formatBirthday: [
            { required: true, type: 'date', message: '请选择生日！', trigger: 'change' }
          ]
        },
        instList: []
      }
    },
    mounted() {
      this.getInstList()
    },
    methods: {
      // 该方法用来等待操作
      sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time))
      },
      getInstList() {
        axios.request({
          url: 'societies/institutes/list',
          method: 'get'
        }).then(res => {
          this.instList = res.data.data
        })
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          let that = this
          if (valid) {
            axios.request({
              url: 'authentication/guest/application',
              method: 'post',
              data: this.formdata
            }).then(res => {
              if (res.data.success) {
                that.$Message.success('申请成功!')
                this.$router.push({
                  name: 'application'
                })
              } else {
                alert(res.data.errMsg)
              }
            }).catch(function (error) {
              that.$Message.error(error.code)
            })

          } else {
            that.$Message.error('申请失败，请检查!')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      }
    }
  }
</script>

