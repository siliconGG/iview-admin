<template>
  <div class="container">
    <Layout>
      <Content>
        <Form ref="formInline" inline>
          <FormItem prop="account">
            <h1>学会详情</h1>
          </FormItem>
        </Form>
        <Divider size="small">基本信息</Divider>
        <Form ref="formdata" :model="formdata" :rules="ruleValidate" :label-width="80" :label-height="100">

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
            <Col span="5">
              <FormItem label="学会注册时间：" prop="instRegisterDate">
                    <Input v-model="formdata.instRegisterDate" ></Input>
              </FormItem>
            </Col >
          </Row>

          <Row>
            <Col span="5">
              <FormItem label="学会当前届：" prop="currentPeriod">
                <Input v-model="formdata.currentPeriod" ></Input>
              </FormItem>
            </Col>
            <Col span="3">
              <Button @click="showPeriods()">历史届</Button>
            </Col>
            <Col span="8">
              <FormItem label="学会会员总数：" prop="memberCount">
                <Input v-model="formdata.memberCount" ></Input>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem label="学会单位会员总数：" prop="compCount">
                <Input v-model="formdata.compCount" ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="学会所属行业分类：" prop="industryName">
                <Input v-model="formdata.industryName" ></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="学会地址：" prop="instAddress">
                <Input v-model="formdata.instAddress"></Input>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem label="学会英文名：" prop="instEngName">
                <Input v-model="formdata.instEngName"></Input>
              </FormItem>
            </Col>
          </Row>
          <Divider size="small">会员信息</Divider>
          <Form>
            <Row>
              <Col span="12" style="padding-right:10px">
                <FormItem label="个人会员：">
                  <Select v-model="selectMembers" clearable filterable @on-change="selectMemberEvent">
                    <Option v-for="item in memberList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12" style="padding-right:10px">
                <FormItem label="单位会员：">
                  <Select v-model="selectComps" clearable filterable @on-change="selectCompEvent">
                    <Option v-for="item in compList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="分会信息：" prop="memberInfo">
                  <Card style="height: 120px;">
                    <div slot="title" inline>{{memberInfo.title}}<Button type="text" @click="goSub(memberInfo.id)">详情</Button></div>
                    <p>{{memberInfo.content}}</p>
                  </Card>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="分会信息：" prop="compInfo">
                  <Card style="height: 120px;">
                    <div slot="title" inline>{{compInfo.title}}<Button type="text" @click="goSub(compInfo.id)">详情</Button></div>
                    <p>{{compInfo.content}}</p>
                  </Card>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Divider size="small">联系方式</Divider>
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

          <FormItem>
            <Button type="primary" @click="infoModified('formdata')">修改</Button>
            <Button @click="handleReset('formdata')" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </Content>
      <!--<Divider type="vertical"></Divider>-->

      <Sider width="500">
        <div class="card">
          <Card style="width:500px;background:#eee;padding: 20px">
            <Form ref="formInline" inline>
              <FormItem prop="account">
                <h2>分会信息</h2>
              </FormItem>
            </Form>
            <Form>
              <Row>
                <Col span="22" style="padding-right:10px">
                  <FormItem label="请选择分会：" prop="phone">
                    <Select v-model="selectSubs" clearable filterable @on-change="selectSubEvent">
                      <Option v-for="item in subList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="22">
                  <FormItem label="分会信息：" prop="subInfo">
                    <Card>
                      <div slot="title" inline>{{subInfo.title}}
                        <Button type="text" @click="goSub(subInfo.id)">详情</Button>
                      </div>
                      <p>{{subInfo.content}}</p>
                    </Card>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </Sider>
    </Layout>
    <Modal v-model="showPeriod" title="学会历届">
      <Collapse v-model="showPanel" accordion>
        <Panel v-for='(list, index) in periodList'  v-bind:key='list.instPeriodId' >
          第{{list.instPeriodNo}}届
          <div slot="content">
            <h6>负责人：{{list.personChargers[0].personMember.name}} <Divider type="vertical" /> 负责人头衔：{{list.personChargers[0].personTitleName}}</h6><Divider />
            <h6>联系方式：{{list.personChargers[0].personMember.phone1}}<Divider type="vertical" /> 分会介绍：{{list.instMemo}}</h6><Divider />
            <h6>分会开始时间：{{list.instPeriodFrom}}<Divider type="vertical" /> 分会结束时间：{{list.instPeriodTo}}</h6><Divider />
          </div>
        </Panel>
      </Collapse>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value2: 1,
      selectSubs: '',
      selectMembers: '',
      selectComps: '',
      subList: [
      ],
      memberList: [],
      compList: [],
      periodList: [],
      showPeriod: false,
      showPanel: '0',
      subInfo: {
        // 分会instSubId
        id: 0,
        title: '未选择',
        content: ''
      },
      memberInfo: {
        id: 0,
        title: '未选择',
        content: ''
      },
      compInfo: {
        id: 0,
        title: '未选择',
        content: ''
      },
      show: false,
      ruleValidate: {
        mail: [
          { type: 'email', message: '邮箱格式不正确！请检查！', trigger: 'blur' }
        ],
        phone: [
          { type: 'string', min: 11, max: 11, message: '电话号码为11位！请校验', trigger: 'blur' }
        ]
      },
      formdata: {
        instId: '',
        instName: '',
        instShort: '',
        currentPeriod: '',
        instIntroduction: '',
        instAddress: '',
        phone: '',
        instWebsite: '',
        memberCount: '',
        instRegisterDate: '',
        instEngName: '',
        instMemo: '',
        compCount: '',
        industryName: '',
        instQq: '暂无',
        instWechat: '暂无'
      }
    }
  },
  created () {
    this.fetchData(1)
  },
  methods: {
    showPeriods () {
      var that = this
      let instance = this.$ajax.create({
        // 用来将token放到header上
        headers: {'token': window.localStorage.getItem('token')}
      })
      if (that.formdata.instId.length === 0) {
        alert('暂无数据！')
      } else {
        instance.get(that.GLOBAL.serverPath + '/institute/getPeriodByInstId?instId=' + that.formdata.instId, {})
          .then(function (response) {
            if (response.data.success) {
              that.periodList = response.data.data
              that.showPeriod = true
            } else {
              alert(response.data.errMsg)
            }
          })
          .catch(function (error) {
            console.log(error)
            alert('服务器开小差啦～～ \n' + error.message)
          })
      }
    },
    // 详情接口
    goSub (id) {
      if (id === 0) {
        alert('您还未选择分会！')
      } else {
        alert(id)
      }
    },
    selectSubEvent: function (value) {
      let content = ''
      let id = ''
      this.subList.forEach((sub) => {
        if (sub.value === value) {
          content = sub.content
          id = sub.id
        }
      })
      this.subInfo = {
        title: value,
        content: content.length === 0 ? '暂无介绍' : content,
        id: id
      }
    },
    selectMemberEvent: function (value) {
      let content = ''
      let id = ''
      this.memberList.forEach((member) => {
        if (member.value === value) {
          content = member.content
          id = member.id
        }
      })
      this.memberInfo = {
        title: value,
        content: content.length === 0 ? '暂无介绍' : content,
        id: id
      }
    },
    selectCompEvent: function (value) {
      let content = ''
      let id = ''
      this.compList.forEach((comp) => {
        if (comp.value === value) {
          content = comp.content
          id = comp.id
        }
      })
      this.compInfo = {
        title: value,
        content: content.length === 0 ? '暂无介绍' : content,
        id: id
      }
    },

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

    fetchData (instId) {
      // todo 从何处获取到instId?
      var that = this
      let instance = this.$ajax.create({
        // 用来将token放到header上
        headers: {'token': window.localStorage.getItem('token')}
      })
      instance.get(that.GLOBAL.serverPath + '/institute/getInstituteByInstId?instId=' + instId)
        .then(function (response) {
          if (response.data.success) {
            that.formdata = response.data.data
            that.formdata.instRegisterDate = that.dateFormat(new Date(that.formdata.instRegisterDate * 1000), 'yyyy-MM-dd')
            if (!that.formdata.instQq) {
              that.formdata.instQq = '暂无'
            } if (!that.formdata.instWechat) {
              that.formdata.instWechat = '暂无'
            }
          } else {
            alert(response.data.errMsg)
          }
        })
        .catch(function (error) {
          console.log(error)
          alert('服务器开小差啦～～ \n' + error.message)
        })
      instance.get(that.GLOBAL.serverPath + '/institute/getInfoList?instId=' + instId)
        .then(function (response) {
          if (response.data.success) {
            that.subList = response.data.data.subList
            that.memberList = response.data.data.memberList
            that.compList = response.data.data.compList
          } else {
            alert(response.data.errMsg)
          }
        })
        .catch(function (error) {
          console.log(error)
          alert('服务器开小差啦～～ \n' + error.message)
        })
    },

    infoModified (name) {
      this.$refs[name].validate((valid) => {
        let that = this

        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })
        if (valid) {
          instance.post(that.GLOBAL.serverPath + '/member/infoModified', {
            name: that.formdata.name,
            sex: that.formdata.sex,
            birthday: that.formdata.birthday,
            ethnic: that.formdata.ethnic,
            partisan: that.formdata.partisan,
            mail: that.formdata.mail,
            phone1: that.formdata.phone,
            instQq: that.formdata.qq,
            wechat: that.formdata.wechat,
            memo: that.formdata.memo
          })
            .then(function (response) {
              if (response.data.success) {
                console.log(response.data)
                alert('修改成功')
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
    // 该方法用来等待操作
    handleSubmit (name) {
      alert(window.localStorage.getItem('type'))
      this.show = true
    },
    enableEdit (name) {
      this.show = true
    },
    handleReset (name) {
      this.show = false
    }
  }
}
</script>
<style>
  .card{
    height: 100%;
  }
</style>
