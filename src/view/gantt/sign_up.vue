<template>
  <div>
    <Form :model="dataForm">
      <Row>
        <Col span="6">
          <FormItem label="活动名称" prop="name">
            <Input v-model="dataForm.name" style="width:200px" placeholder="新闻标题" clearable />
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="活动行业分类" prop="industry">
            <Select v-model="dataForm.industry" style="width:200px">
              <Option v-for="item in industryList" :value="item.industryId" :key="item.industryId">{{item.indusName}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="不包含停用活动" prop="withoutStop">
            <i-switch v-model="dataForm.withoutStop"/>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem>
            <Button @click="getDataList()">查询</Button>
            <Button @click="actSignUp()" type="primary">发起活动报名</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Table stripe :columns="columns" :data="dataList" :loading="dataListLoading"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalUser" :current="pageIndex" show-sizer @on-change="changePage" @on-page-size-change="sizeChangeHandle"></Page>
      </div>
    </div>
    <Modal v-model="actSignUpDisplay" width="800">
      <p slot="header" style="text-align:center">
        <span>活动报名信息</span>
      </p>
      <div style="text-align:center">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" label-position="right">
          <Row>
            <Col span="8">
              <FormItem label="报名项目名称" prop="signName">
                <Input v-model="formValidate.signName" placeholder="请输入报名项目名称"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="报名项目简称" prop="signShort">
                <Input v-model="formValidate.signShort" placeholder="请输入报名项目简称"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="报名项目英文名" prop="signEngName">
                <Input v-model="formValidate.signEngName" placeholder="请输入报名项目英文名"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="活动行业分类" prop="industryId">
                <Select v-model="formValidate.industryId">
                  <Option v-for="item in industryList" :value="item.industryId" :key="item.industryId">{{item.indusName}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="活动名额" prop="actTotalNum">
                <InputNumber :max="500" :min="1" v-model="formValidate.actTotalNum"></InputNumber>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="使用APP签到">
                <i-switch v-model="formValidate.appCheck" @on-change="changeMap"></i-switch>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="开始时间" prop="formatSignDateFrom">
                <DatePicker type="date" placeholder="Select date" v-model="formValidate.formatSignDateFrom"></DatePicker>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="截止时间" prop="formatSignDateTo">
                <DatePicker type="date" placeholder="Select date" v-model="formValidate.formatSignDateTo"></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="报名通知" prop="signForm">
            <Input v-model="formValidate.signForm" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请填写报名对应的通知，会发送消息给全体用户。"></Input>
          </FormItem>
          <div id="container" :style="styles"></div>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleReset('formValidate')">重置</Button>
        <Button type="primary" @click="handleSubmit('formValidate')" style="margin-left: 8px">提交</Button>
      </div>
    </Modal>
    <Drawer :closable="false" width="640" v-model="signUpInfoDisplay">
      <p :style="pStyle">
        {{signUpInfo.signName}} <Tag color="error" v-if="signUpInfo.stop">停用</Tag><Tag color="primary" v-else>正常</Tag>
      </p>
      <p :style="pStyle">活动信息</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">
            报名项目简称: {{signUpInfo.signShort}}
          </Col>
          <Col span="12">
            报名项目英文名: {{signUpInfo.signEngName}}
          </Col>
        </Row>
        <Row>
          <Col span="12">
            活动行业分类: {{signUpInfo.industryName}}
          </Col>
          <Col span="12" v-if="signUpInfo.appCheck">
            APP签到: 使用
          </Col>
          <Col span="12" v-else>
            APP签到: 不使用
          </Col>
        </Row>
        <Row>
          <Col span="12">
            开始时间: {{signUpInfo.formatSignDateFrom}}
          </Col>
          <Col span="12">
            截止时间: {{signUpInfo.formatSignDateTo}}
          </Col>
        </Row>
        报名通知: {{signUpInfo.signForm}}
      </div>
      <Divider />
      <p :style="pStyle">活动报名信息</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">
            活动名额: {{signUpInfo.actTotalNum}}
          </Col>
          <Col span="12">
            活动报名人数: {{signUpInfo.signUpNum}}
          </Col>
        </Row>
      </div>
      <div v-if="signUpInfo.appCheck">
        <Divider />
        <p :style="pStyle">活动签到信息</p>
        <div class="demo-drawer-profile">
          <Row>
            <Col span="12">
              签到地点： [{{signUpInfo.lng}},{{signUpInfo.lat}}]
            </Col>
            <Col span="12">
              签到半径： {{signUpInfo.radius}}米
            </Col>
          </Row>
          <Row>
            <Col span="12" v-if="signUpInfo.startSignUp">
              签到状态： 可以签到
            </Col>
            <Col span="12" v-else>
              签到状态： 不能签到
            </Col>
            <Col span="12">
              签到人数: {{signUpInfo.checkInNum}}
            </Col>
          </Row>
        </div>
        <div class="demo-drawer-footer" v-if="!signUpInfo.stop">
          <Button v-if="signUpInfo.startSignUp" type="error" style="margin-right: 8px" @click="stopCheckIn(signUpInfo.signId)">停止签到</Button>
          <Button v-else type="primary" @click="startCheckIn(signUpInfo.signId)">开始签到</Button>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'
  import MapLoader from '@/libs/AMap';

  export default {
    data() {
      return {
        dataForm: {
          name: '',
          industry: '',
          withoutStop: false
        },
        industryList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalUser: 0,
        dataListLoading: false,
        columns: [
          {
            title: 'ID',
            key: 'signId',
            align: 'center',
            width: 50
          },
          {
            title: '报名项目名称',
            key: 'signName'
          },
          {
            title: '活动行业分类',
            key: 'industryName',
            align: 'center',
            width: 110
          },
          {
            title: '开始时间',
            key: 'formatSignDateFrom',
            align: 'center',
            width: 150
          },
          {
            title: '截止时间',
            key: 'formatSignDateTo',
            align: 'center',
            width: 150
          },
          {
            title: '活动名额',
            key: 'actTotalNum',
            align: 'center',
            width: 110
          },
          {
            title: '活动报名人数',
            key: 'checkInNum',
            align: 'center',
            width: 110
          },
          {
            title: 'APP签到',
            key: 'appCheck',
            align: 'center',
            width: 110,
            render: (h, params) => {
              function f () {
                if (params.row.appCheck){
                  return '使用'
                } else {
                  return '不使用'
                }
              }
              return h('div', [
                h('Tag', {
                  props: {

                  }
                },f())
              ])
            }
          },{
            title: '状态',
            key: 'stop',
            align: 'center',
            width: 100,
            render: (h, params) => {
              function f () {
                if (!params.row.stop) {
                  return '正常'
                } else {
                  return '停用'
                }
              }

              return h('div', [
                h('Tag', {
                  props: {}
                }, f())
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showSignUp(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.stopSignUp(params.index)
                    }
                  }
                }, '停用')
              ])
            }
          }
        ],
        actSignUpDisplay: false,
        formValidate: {
          signId: '',
          signName: '',
          signShort: '',
          signEngName: '',
          industryId: '',
          formatSignDateFrom: '',
          formatSignDateTo: '',
          signForm: '',
          actTotalNum: 0,
          appCheck: false,
          lat: '',
          lng: '',
          radius: '',
          signUpNum: 0,
          checkInNum: 0
        },
        ruleValidate: {
          signName: [
            { required: true, message: '报名项目名称不能为空', trigger: 'blur' }
          ],
          formatSignDateFrom: [
            { required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }
          ],
          formatSignDateTo: [
            { required: true, type: 'date', message: '请选择截止时间', trigger: 'change' }
          ],
          signForm: [
            { required: true, message: '请输入活动报名通知', trigger: 'blur' },
            { type: 'string', min: 20, message: '通知请至少输入20个字符', trigger: 'blur' }
          ]
        },
        styles: {
          height: '0',
          width: '750px'
        },
        stopMessage: '',
        signUpInfo: [],
        signUpInfoDisplay: false,
        pStyle: {
          fontSize: '16px',
          color: 'rgba(0,0,0,0.85)',
          lineHeight: '24px',
          display: 'block',
          marginBottom: '16px'
        }
      }
    },
    mounted () {
      this.getDataList()
      this.getIndustryList()
      this.loadmap();
    },
    methods: {
      changeMap() {
        if (this.formValidate.appCheck) {
          this.styles.height = '500px'
        } else {
          this.styles.height = '0'
        }
      },
      loadmap(){
        let that = this
        MapLoader().then(AMap => {
          console.log('地图加载成功')
          that.map = new AMap.Map('container', {
            center: [120.044263,30.230809],
            zoom: 14
          })
          let circle = new AMap.Circle({
            center: [120.044263,30.230809],
            radius: 1000, //半径
            borderWeight: 3,
            strokeColor: "#FF33FF",
            strokeOpacity: 1,
            strokeWeight: 6,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            strokeStyle: 'dashed',
            strokeDasharray: [10, 10],
            // 线样式还支持 'dashed'
            fillColor: '#1791fc',
            zIndex: 50,
          })
          circle.setMap(that.map)
          that.map.setFitView([ circle ])
          let circleEditor = new AMap.CircleEditor(that.map, circle)
          circleEditor.on('move', function(event) {
            that.formValidate.lng=circle.getCenter().lng
            that.formValidate.lat=circle.getCenter().lat
          })

          circleEditor.on('adjust', function(event) {
            that.formValidate.radius=circle.getRadius()
            console.log('半径' + that.formValidate.radius)
          })
          circleEditor.open()
        }, e => {
          console.log('地图加载失败' ,e)
        })
      },
      getDataList () {
        this.dataListLoading = true
        axios.request({
          url: `sign/starting?page=${this.pageIndex}&limit=${this.pageSize}&signName=${this.dataForm.name}&withoutStop=${this.dataForm.withoutStop}&industryId=${this.dataForm.industry}`,
          method: 'get'
        }).then(res => {
          if (res.data && res.data.code === 200) {
            this.dataList = res.data.data.list
            this.totalUser = res.data.data.totalCount
          } else {
            this.dataList = []
            this.totalUser = 0
          }
          this.dataListLoading = false
        })
      },
      getIndustryList () {
        axios.request({
          url: `common/getIndustryName`,
          method: 'get'
        }).then(res => {
          this.industryList = res.data.data
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      changePage (val) {
        this.pageIndex = val
        this.getDataList()
      },
      actSignUp () {
        this.actSignUpDisplay = true
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            axios.request({
              url: `sign/starting`,
              method: 'post',
              data: this.formValidate
            }).then(res => {
              if (res.data.code === 200) {
                this.$Message.success({
                  title: '成功',
                  content: '发起活动报名成功！'
                })
                this.handleReset(name)
                this.actSignUpDisplay = false
                this.getDataList()
              } else {
                this.$Message.error({
                  title: '错误',
                  content: res.data.errMsg
                })
              }
            })
          } else {
            this.$Message.error('新增失败，请修改!');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      stopSignUp (index) {
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: this.stopMessage,
                autofocus: true,
                placeholder: '请输入停止通知，告诉报名取消原因！'
              },
              on: {
                input: (val) => {
                  this.stopMessage = val;
                }
              }
            })
          },
          onOk: () => {
            axios.request({
              url: `sign/starting/${this.dataList[index].signId}/${this.stopMessage}`,
              method: 'delete'
            }).then(res => {
              this.$Message.info(res.data.data);
              this.getDataList()
            })
          }
        })
      },
      showSignUp (index) {
        axios.request({
          url: `sign/starting/${this.dataList[index].signId}`,
          method: 'get'
        }).then(res => {
          this.signUpInfo = res.data.data
          this.signUpInfoDisplay = true
        })
      },
      startCheckIn(signId) {
        axios.request({
          url: `sign/starting/check/${signId}`,
          method: 'put'
        }).then(res => {
          if (res.data.code === 200) {
            this.$Message.success({
              title: '成功',
              content: '恢复成功！'
            })
            axios.request({
              url: `sign/starting/${signId}`,
              method: 'get'
            }).then(res => {
              this.signUpInfo = res.data.data
            })
          } else {
            this.$Message.error({
              title: '错误',
              content: res.data.errMsg
            })
          }
        })
      },
      stopCheckIn(signId) {
        axios.request({
          url: `sign/starting/check/${signId}`,
          method: 'delete'
        }).then(res => {
          if (res.data.code === 200) {
            this.$Message.success({
              title: '成功',
              content: '停用成功！'
            })
            axios.request({
              url: `sign/starting/${signId}`,
              method: 'get'
            }).then(res => {
              this.signUpInfo = res.data.data
            })
          } else {
            this.$Message.error({
              title: '错误',
              content: res.data.errMsg
            })
          }
        })
      }
    }
  }
</script>

<style>
  .demo-drawer-profile{
    font-size: 14px;
  }
  .demo-drawer-profile .ivu-col{
    margin-bottom: 12px;
  }
  .demo-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }
</style>
