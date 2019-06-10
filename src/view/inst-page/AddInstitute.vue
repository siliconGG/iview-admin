<template>
  <div class="container">
    <Layout>
      <Content>
        <Form ref="formInline" inline>
          <FormItem prop="account">
            <h1>新增学会</h1>
          </FormItem>
        </Form>
        <Divider size="small" orientation="left">请填写基本信息</Divider>
        <Form ref="formdata" :model="formdata" :label-width="80" :label-height="100">

          <Row>
            <Col span="8">
              <FormItem label="学会名称：" prop="instName">
                <Input v-model="formdata.instName" value="formdata.instName"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="学会简称：" prop="instShort">
                <Input v-model="formdata.instShort" value="formdata.instShort"></Input>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem label="学会英文名：" prop="instEngName">
                <Input v-model="formdata.instEngName"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="活动行业分类：" prop="industryId">
                <Select v-model="formdata.industryId" filterable clearable>
                  <Option v-for="item in industryList" :value="item.industryId" :key="item.industryId">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>

            <Col span="7">
              <FormItem label="学会地址：" prop="instAddress">
                <Input v-model="formdata.instAddress"></Input>
              </FormItem>
            </Col>
          </Row>
          <Divider size="small" orientation="left">填写联系方式</Divider>
          <Row>
            <Col span="8">
              <FormItem label="学会网址：" prop="instWebsite">
                <Input v-model="formdata.instWebsite" ></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="学会微信：" prop="instWechat">
                <Input v-model="formdata.instWechat"></Input>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem label="学会QQ：" prop="instQq">
                <Input v-model="formdata.instQq"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="学会介绍：" prop="instIntroduction">
                <Input type="textarea" :rows="4" v-model="formdata.instIntroduction"></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="学会备注：" prop="instMemo">
                <Input type="textarea" :rows="4" v-model="formdata.instMemo"></Input>
              </FormItem>
            </Col>
          </Row>
          <Divider size="small" orientation="left">学会第一届信息</Divider>
          <Row>
            <Col span="8">
              <FormItem label="学会第一届负责人：" prop="personId">
                <Select v-model="formdata.personId" filterable clearable>
                  <Option v-for="item in personList" :value="item.key" :key="item.key">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem label="学会第一届备注：" prop="instMemo">
                <Input type="textarea" :rows="4" v-model="formdata.instPeriodMemo"></Input>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="学会第一届结束时间：" prop="instIntroduction">
                <DatePicker type="date" confirm format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择结束时间" v-model="formdata.instPeriodTo"></DatePicker>
              </FormItem>
            </Col>
          </Row>

          <FormItem>
            <Button type="primary" @click="addInstitute('formdata')">新增</Button>
          </FormItem>
        </Form>
      </Content>

    </Layout>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        value2: 1,
        personList: [],
        industryList: [],
        show: false,
        formdata: {
          instId: '',
          instName: '',
          instShort: '',
          instIntroduction: '',
          instAddress: '',
          instWebsite: '',
          memberCount: '',
          instEngName: '',
          personId: '',
          instMemo: '',
          industryId: '',
          instQq: '',
          instWechat: '',
          instPeriodMemo:'',
          instPeriodTo: ''
        }
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      dateFormat (timestamp, format) {
        var date = {
          'M+': timestamp.getMonth() + 1,
          'd+': timestamp.getDate(),
          'h+': timestamp.getHours(),
          'm+': timestamp.getMinutes(),
          's+': timestamp.getSeconds(),
          'q+': Math.floor((timestamp.getMonth() + 3) / 3),
          'S+': timestamp.getMilliseconds()
        }
        if (/(y+)/i.test(format)) {
          format = format.replace(RegExp.$1, (timestamp.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in date) {
          if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
          }
        }
        return format
      },

      fetchData () {
        var that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })
        instance.get(that.GLOBAL.serverPath + '/common/getMember')
          .then(function (response) {
            if (response.data.success) {
              let datas = response.data.data
              datas.forEach((data) => {
                let person = {}
                person.personId = data.personId
                person.key = data.personId
                person.value = data.name
                person.label = data.name
                that.personList.push(person)
              })
            } else {
              alert(response.data.errMsg)
            }
          })
          .catch(function (error) {
            console.log(error)
            alert('服务器开小差啦～～ \n' + error.message)
          })

        // 获取活动行业分类信息
        instance.get(that.GLOBAL.serverPath + '/common/getIndustryName')
          .then(function (response) {
            if (response.data.success) {
              let datas = response.data.data
              datas.forEach((data) => {
                let industry = {}
                industry.industryId = data.industryId
                industry.value = data.indusName
                industry.label = data.indusName
                that.industryList.push(industry)
              })
            } else {
              alert(response.data.errMsg)
            }
          })
          .catch(function (error) {
            console.log(error)
            alert('服务器开小差啦～～ \n' + error.message)
          })
      },

      addInstitute (name) {
        this.$refs[name].validate((valid) => {
          let that = this

          let instance = this.$ajax.create({
            // 用来将token放到header上
            headers: {'token': window.localStorage.getItem('token')}
          })
          if (valid) {
            instance.post(that.GLOBAL.serverPath + '/institute/instAdd', {
              instId: that.formdata.instId,
              instName: that.formdata.instName,
              instShort: that.formdata.instShort,
              instIntroduction: that.formdata.instIntroduction,
              instAddress: that.formdata.instAddress,
              instWebsite: that.formdata.instWebsite,
              instEngName: that.formdata.instEngName,
              instMemo: that.formdata.instMemo,
              instQq: that.formdata.instQq,
              instWechat: that.formdata.instWechat,
              industryId: that.formdata.industryId,
              personId: that.formdata.personId,
              instPeriodTo: that.formdata.instPeriodTo,
              instPeriodMemo: that.formdata.instPeriodMemo
            })
              .then(function (response) {
                if (response.data.success) {
                  alert('新增成功')
                } else {
                  alert('新增失败：' + response.data.errMsg)
                }
              })
              .catch(function (error) {
                alert('服务器开小差啦～～ \n' + error.message)
              })
          } else {
            that.$Message.error('新增失败，请检查!')
          }
        })
      },
    }
  }
</script>
<style>
  .card{
    height: 100%;
  }
</style>
