<template>
  <div class="container">
    <Form inline>
      <Row>
      <FormItem inline>
        <Button type="primary" @click="modal1 = true">发起活动</Button>
        <Button>常用模板</Button>
      </FormItem>
      </Row>
      <Row>
        <FormItem label="请选择文档类型：">
        <Select v-model="select1" clearable  @on-change="selectSubEvent" style="width:200px">
          <Option v-for="item in catagoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </FormItem>
        <Upload action="//localhost:8081/upload/test"
                :data="{'taskExecId':taskExecId,'docCatagory':docCatagory}">
          <Button icon="ios-cloud-upload-outline">上传</Button>
        </Upload>
        <Button type="primary" @click="exportData()">导出</Button>
      </Row>
    </Form>
    <Modal
      v-model="modal1"
      title="新建活动"
      @on-ok="addActivity"
      @on-cancel="cancel"
      width="1000">
      <Form ref="activityData" :model="activityData" :rules="ruleValidate" :label-width="80" :label-height="100">
        <Row>
          <Col span="8">
            <FormItem label="活动名称：" prop="actName">
              <Input v-model="activityData.actName" value="formdata.actName"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="活动简称：" prop="actShort">
              <Input v-model="activityData.actShort" value="formdata.actShort"></Input>
            </FormItem>
          </Col>
          <Col span ="6">
            <FormItem label="活动英文名：" prop="actName">
              <Input v-model="activityData.actEngName" value="formdata.actName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="活动所属分会：" prop="personId">
              <Cascader  v-model="activityData.ids"  trigger="hover" :data="cascaderData" change-on-select></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="选择活动负责人：" prop="personId">
              <Select v-model="activityData.personId" filterable clearable>
                <Option v-for="item in personList" :value="item.personId" :key="item.personId">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="启动日期：" prop="date">
              <DatePicker type="date" confirm format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期" v-model="activityData.actDateFrom"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="预计截止日期：" prop="date">
              <DatePicker type="date" confirm format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期" v-model="activityData.actDateTo"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="活动行业分类：" prop="industryId">
              <Select v-model="activityData.industryId" filterable clearable>
                <Option v-for="item in industryList" :value="item.industryId" :key="item.industryId">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="活动地点：" prop="actAddress">
              <Input v-model="activityData.actAddress" value="activityData.actAddress"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <Poptip word-wrap width="200" trigger="hover" content="活动优先级:1-10(低-高)">
            <FormItem label="选择活动优先级：" prop="personId">
              <Select v-model="activityData.actPriority" filterable clearable>
                <Option v-for="item in priorityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Poptip>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="活动备注：" prop="actMemo">
              <Input type="textarea" :rows="4" v-model="activityData.actMemo" value="activityData.actMemo"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal
      v-model="modal2"
      title="新建子活动"
      @on-ok="addActSub"
      @on-cancel="cancel"
      width="1000">
      <Form ref="activitySubData" :model="activitySubData" :rules="ruleValidate" :label-width="80" :label-height="100">
        <Row>
          <Col span="8">
            <FormItem label="子活动名称：" prop="actSubName">
              <Input v-model="activitySubData.actSubName" value="formdata.actSubName"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="子活动简称：" prop="actSubShort">
              <Input v-model="activitySubData.actSubShort" value="formdata.actSubShort"></Input>
            </FormItem>
          </Col>
          <Col span ="6">
            <FormItem label="子活动英文名：" prop="actSubName">
              <Input v-model="activitySubData.actSubEngName" value="formdata.actSubName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="子活动所属分会：" prop="personId">
              <Cascader  v-model="activitySubData.ids"  trigger="hover" :data="cascaderData" change-on-select></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="选择活动负责人：" prop="personId">
              <Select v-model="activitySubData.personId" filterable clearable>
                <Option v-for="item in personList" :value="item.personId" :key="item.personId">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="启动日期：" prop="date">
              <DatePicker type="date" confirm format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期" v-model="activitySubData.actSubDateFrom"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="预计截止日期：" prop="date">
              <DatePicker type="date" confirm format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期" v-model="activitySubData.actSubDateTo"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="活动行业分类：" prop="industryId">
              <Select v-model="activitySubData.industryId" filterable clearable>
                <Option v-for="item in industryList" :value="item.industryId" :key="item.industryId">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="活动地点：" prop="actSubAddress">
              <Input v-model="activitySubData.actSubAddress" value="activityData.actSubAddress"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <Poptip word-wrap width="200" trigger="hover" content="活动优先级:1-10(低-高)">
              <FormItem label="选择活动优先级：" prop="personId">
                <Select v-model="activitySubData.actSubPriority" filterable clearable>
                  <Option v-for="item in priorityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Poptip>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="活动备注：" prop="actSubMemo">
              <Input type="textarea" :rows="4" v-model="activitySubData.actSubMemo" value="activityData.actMemo"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <div id="example">
      <ul class="switch-list">
        <li class="switch-item" v-for="item in propList">
          <span>{{ item.name }}: </span>
          <iSwitch v-model="props[item.value]"></iSwitch>
        </li>
      </ul>
      <zk-table
        ref="table"
        sum-text="sum"
        index-text="#"
        :data="data"
        :columns="columns"
        :border="props.border"
        :show-header="props.showHeader"
        :show-summary="props.showSummary"
        :show-row-hover="true"
        :show-index="props.showIndex"
        :tree-type="true"
        :selection-type="false"
        :is-fold="props.isFold"
        :expand-type="props.expandType"
        :empty-text="emptyText">
        <template slot="$expand" slot-scope="scope">
          {{ `活动名： ${scope.row.name},
          活动介绍： ${scope.row.introduction}.`
          }}
        </template>
        <template slot="operate" slot-scope="scope" v-if="scope.row.type !== '任务'">
          <Button @click="addActSub(scope.row.id)" >新增子活动</Button>
          <Button>新增任务</Button>
        </template>
      </zk-table>
    </div>
  </div>
</template>

<script>

import {dateFormat} from '@/libs/util'
export default {
  name: 'example',
  data () {
    return {
      select1: '',
      catagoryList: [{
        value: '通知',
        label: '通知'
      },
      {
        value: '策划方案',
        label: '策划方案'
      },
      {
        value: '报告',
        label: '报告'
      }
      ],
      docCatagory: '未选择',
      taskExecId: '1',

      cascaderData: [{
      }],
      activityData: {
        ids: [],
        actName: '',
        actShort: '',
        personId: '',
        actEngName: '',
        industryId: '',
        actDateFrom: '',
        actDateTo: '',
        actAddress: '',
        actPriority: '',
        actMemo: ''
      },
      activitySubData: {
        ids: [],
        actSubName: '',
        actSubShort: '',
        personId: '',
        actSubEngName: '',
        industryId: '',
        actSubDateFrom: '',
        actSubDateTo: '',
        actSubAddress: '',
        actSubPriority: '',
        actSubMemo: ''
      },
      personList: [],
      industryList: [],

      priorityList: [
        {
          value: '1',
          label: '低'
        }, {
          value: '5',
          label: '中'
        }, {
          value: '10',
          label: '高'
        }
      ],

      modal1: false,
      modal2: false,
      props: {
        border: false,
        showHeader: true,
        showSummary: false,
        showIndex: false,
        isFold: true,
        expandType: false
      },
      emptyText: '暂未发起活动',
      data: [
        // {
        //   name: '浙江工业大学运动会',
        //   charger: '陈进颖',
        //   likes: ['football', 'basketball'],
        //   startTime: 10,
        //   endTime: 10,
        //   introduction: "介绍",
        //   type: '活动',
        //   children: [
        //     {
        //       name: '计算机学院运动会',
        //       charger: '陈进颖',
        //       likes: ['football', 'basketball'],
        //       startTime: 20,
        //       endTime: 10,
        //       type: '子活动',
        //       children: [
        //         {
        //           name: '租借场地',
        //           charger: '郭威',
        //           likes: ['football', 'basketball'],
        //           startTime: 20,
        //           endTime: 10,
        //           type: '任务',
        //         },
        //         {
        //           name: '运动会项目筹划',
        //           charger: '郭威',
        //           likes: ['football', 'basketball'],
        //           startTime: 10,
        //           endTime: 10,
        //           type: '子活动',
        //           children: [
        //             {
        //               name: '拔河比赛',
        //               charger: '陈进颖',
        //               likes: ['football', 'basketball'],
        //               startTime: 20,
        //               type: '任务',
        //               endTime: 10,
        //             },
        //             {
        //               name: '田径赛事',
        //               charger: '郭威',
        //               likes: ['football', 'basketball'],
        //               startTime: 10,
        //               endTime: 10,
        //               type: '子活动',
        //               children: [
        //                 {
        //                   name: '跳高比赛',
        //                   charger: '体育老师1',
        //                   likes: ['football', 'basketball'],
        //                   startTime: 20,
        //                   type: '任务',
        //                   endTime: 10,
        //
        //                 },
        //                 {
        //                   name: '跳远比赛',
        //                   charger: '体育老师2',
        //                   likes: ['football', 'basketball'],
        //                   startTime: 10,
        //                   type: '任务',
        //                   endTime: 10,
        //
        //                 },
        //               ],
        //             },
        //           ],
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
      columns: [
        {
          label: '活动名',
          prop: 'name',
          width: '400px'
        },
        {
          label: '负责人',
          prop: 'charger',
          minWidth: '50px'
        },
        {
          label: '类型',
          prop: 'type'
        },
        {
          label: '开始时间',
          prop: 'startTime'
        },
        {
          label: '结束时间',
          prop: 'endTime'
        },
        {
          label: '操作',
          minWidth: '200px',
          type: 'template',
          template: 'operate'
        }
      ]
    }
  },
  computed: {
    propList () {
      return Object.keys(this.props).map(item => ({
        name: this.getName(item),
        value: item
      }))
    }
  },
  methods: {
    selectSubEvent: function (value) {
      this.docCatagory = value
    },
    exportData: function () {
      let url = `//localhost:8081/upload/download?taskExecId=${this.taskExecId}`
      window.open(url)
    },
    addActivity () {
      let that = this
      let instance = this.$ajax.create({
        // 用来将token放到header上
        headers: {'token': window.localStorage.getItem('token')}
      })
      instance.post(that.GLOBAL.serverPath + '/activity/addActivity', {
        actName: that.activityData.actName,
        actShort: that.activityData.actShort,
        personId: that.activityData.personId,
        actEngName: that.activityData.actEngName,
        actAddress: that.activityData.actAddress,
        actMemo: that.activityData.actMemo,
        actPriority: that.activityData.actPriority,
        actDateFrom: that.activityData.actDateFrom,
        actDateTo: that.activityData.actDateTo,
        industryId: that.activityData.industryId,
        ids: that.activityData.ids
      }).then(function (response) {
        if (response.data.success) {
          let obj = {}
          obj.name = that.activityData.actName
          that.personList.forEach((person) => {
            if (that.activityData.personId === person.personId) {
              obj.charger = person.label
            }
          })
          obj.id = response.data.data.actId
          obj.startTime = dateFormat(new Date(that.activityData.actDateFrom.getTime()), 'yyyy-MM-dd')
          obj.endTime = dateFormat(new Date(that.activityData.actDateTo.getTime()), 'yyyy-MM-dd')
          obj.introduction = '介绍'
          obj.type = '活动'
          that.data.push(obj)
        } else {
          alert(response.data.errMsg)
        }
      })
        .catch(function (error) {
          console.log(error)
          alert('服务器开小差啦～～ \n' + error.message)
        })
    },
    getName (item) {
      switch (item) {
        case 'border':
          return '展示边界'
        case 'isFold':
          return '是否展开'
        case 'showHeader':
          return '展示表头'
        case 'expandType':
          return '展示介绍'
        case 'showSummary':
          return '展示总和'
        case 'showIndex':
          return '展示序号'
        default :
          return '未设置'
      }
    },
    addActSub (id) {
      var that = this
      let instance = this.$ajax.create({
        // 用来将token放到header上
        headers: {'token': window.localStorage.getItem('token')}
      })
      // instance.post()
      this.modal2 = true
      alert(id)
    },
    change (status) {
      this.$Message.info('开关状态：' + status)
    },
    fetchData (personId) {
      var that = this
      let instance = this.$ajax.create({
        // 用来将token放到header上
        headers: {'token': window.localStorage.getItem('token')}
      })

      // 获取会员所属学会信息
      instance.get(that.GLOBAL.serverPath + '/common/getInstByPersonId?personId=' + personId)
        .then(function (response) {
          if (response.data.success) {
            let datas = response.data.data
            datas.forEach((data) => {
              let obj = {}
              obj.value = data.instId
              obj.label = data.instName
              obj.children = []
              let subInfoSimpleList = data.subInfoSimpleList
              subInfoSimpleList.forEach((subInfo) => {
                let childObj = {}
                childObj.value = subInfo.instSubId
                childObj.label = subInfo.instSubName
                obj.children.push(childObj)
              })
              that.cascaderData.push(obj)
            })
          } else {
            alert(response.data.errMsg)
          }
        })
        .catch(function (error) {
          console.log(error)
          alert('服务器开小差啦～～ \n' + error.message)
        })

        // 获取会员信息，用于指派分配任务
      instance.get(that.GLOBAL.serverPath + '/common/getMember')
        .then(function (response) {
          if (response.data.success) {
            let datas = response.data.data
            datas.forEach((data) => {
              let person = {}
              person.personId = data.personId
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
    }
  },
  created () {
    this.fetchData(window.localStorage.getItem('personId'))
  },
  mounted () {
    // window.onbeforeunload = function (e) {
    //   e = e || window.event;
    //   // 兼容IE8和Firefox 4之前的版本
    //   if (e) {
    //     e.returnValue = '关闭提示';
    //   }
    //   // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    //   return '关闭提示';
    // }
  },
  destroyed () {
    // window.onbeforeunload = null
  }
}
</script>

<style scoped>
  .switch-list {
    margin: 20px 0;
    list-style: none;
    overflow: hidden;
  }
  .switch-item {
    margin: 20px;
    float: left;
  }
</style>
