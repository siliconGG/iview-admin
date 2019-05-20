<template>
  <div class="container">
    <Form ref="formInline" :model="formInline" inline>
      <Row>
        <Col span="3">
          <FormItem prop="actName" label="活动名：">
            <Input type="text" v-model="formInline.actName">
            </Input>
          </FormItem>
        </Col>


        <Col span="3">
          <FormItem prop="instSubName" label="发起分会：">
              <Cascader  v-model="formInline.ids"  trigger="hover" :data="cascaderData" change-on-select></Cascader>
          </FormItem>
        </Col>
        <Col span="3">
          <FormItem prop="publish" label="活动是否发布：">
            <Select v-model="formInline.publish" clearable style="width:150px">
              <Option v-for="item in publishList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="3">
          <FormItem prop="actStatusId" label="活动状态：">
            <Select v-model="formInline.actStatusId" clearable style="width:150px">
              <Option v-for="item in actStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="3">
          <FormItem prop="borrowRecord">
            <Button type="primary" @click="handleSubmit('formInline')">检索</Button>
          </FormItem>
        </Col>
      </Row>
      <Divider size="small">快速筛选</Divider>
      <Row>
        <RadioGroup type="button" @on-change="quickFilter">
          <Radio label="owner">我发起的</Radio>
          <Radio label="priority">优先级排序</Radio>
          <Radio label="stop">已停用的</Radio>
        </RadioGroup>
      </Row>
      <FormItem>
      </FormItem>
    </Form>
    <Table border :columns="columns" :data="activityData">
    </Table>
    <Page :total="total" :page-size="10" @on-change="changePage"></Page>
    <div>
      <Drawer title="分会信息" :closable="false" width="640" v-model="value1" >
        <div>
          <Collapse v-model="showPanel" accordion>
            <Panel v-for='(list, index) in lists'  v-bind:key='list.id' >
              {{list.instSubName}}
              <div slot="content">
                <h6>负责人：{{list.chargerName}} <Divider type="vertical" /> 负责人头衔：{{list.personTitleName}}</h6><Divider />
                <h6>分会简称：{{list.instSubShort}}<Divider type="vertical" /> 分会英文名：{{list.instSubEngName}}</h6><Divider />
                <h6>分会所在地：{{list.instSubAddress}}<Divider type="vertical" /> 分会介绍：{{list.instSubIntroduction}}</h6><Divider />
                <div style="display:inline"><h6>分会当前届：第{{list.instSubPeriodNo}}届<Divider type="vertical" /><Button type="primary" shape="circle" @click="test(list.id)">查看详情</Button></h6></div><Divider />
                <h6>分会开始时间：{{list.instSubPeriodFrom}}<Divider type="vertical" /> 分会结束时间：{{list.instSubPeriodTo}}</h6><Divider />
              </div>
            </Panel>
          </Collapse>
        </div>
      </Drawer>
    </div>
  </div>
</template>
<script>
  import axios from '@/libs/api.request'
  import Role from "../system/role";

  export default {
    name: 'AllInstitute',
    components: {Role},
    data () {
      return {
        value1: false,
        value2: false,
        showPanel: '0',
        lists: [],
        pStyle: {
          fontSize: '16px',
          color: 'rgba(0,0,0,0.85)',
          lineHeight: '24px',
          display: 'block',
          marginBottom: '16px'
        },
        modal1: false,
        total: '',
        condi: '',
        currIndex: 0, // 最近被点击添加编号副本的图书编号

        publishList: [
          {
            value: 1,
            label: '已发布'
          },
          {
            value: 0,
            label: '未发布'
          }
          ],
        actStatusList:[
          {
            value: '1',
            label: '筹备中'
          },
          {
            value: '2',
            label: '启动'
          },{
            value: '3',
            label: '前期'
          },{
            value: '4',
            label: '过半'
          },{
            value: '5',
            label: '后期'
          },{
            value: '6',
            label: '扫尾'
          },{
            value: '7',
            label: '结项'
          },{
            value: '8',
            label: '完成'
          },{
            value: '9',
            label: '关闭'
          },{
            value: '10',
            label: '重启'
          }
        ],
        formInline: {
          actName: '',
          ids: [],
          publish: '',
          actStatusId: ''
        },
        cascaderData: [],
        columns: [
          {
            title: '活动代号',
            key: 'actId'
          },
          {
            title: '活动全称',
            key: 'actName'
          },
          {
            title: '活动领域',
            key: 'industryName'
          },
          {
            title: '活动发起学会',
            key: 'instName'
          },
          {
            title: '活动发起分会',
            key: 'instSubName'
          },
          {
            title: '活动发起人',
            key: 'personName'
          },
          {
            title: '活动地点',
            key: 'actAddress'
          },
          {
            title: '活动发起日期',
            key: 'actDate'
          },
          {
            title: '活动结束日期',
            key: 'actDateTo'
          },
          {
            title: '活动当前状态',
            key: 'actStatusName'
          },{
            title: '活动发布情况',
            key: 'publish'
          },
          {
            title: '活动优先级',
            key: 'actPriority'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        activityData: [],
        dataFromInterface: []
      }
    },
    mounted () {
      this.request(1)
      this.fetchList();
    },
    methods: {
      ok () {
        this.$Message.info('Clicked ok')
      },
      cancel () {
        this.$Message.info('Clicked cancel')
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
          format = format.rplace(RegExp.$1, (timestamp.getFullYear() + '').substr(4 - RegExp.$1.length))
        }

        for (var k in date) {
          if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
          }
        }

        return format
      },
      quickFilter(name) {
        switch (name) {
          case "owner":
            this.request(1, window.localStorage.getItem('personId'))
            break;
          case "priority":
            this.request(1, null, true)
            break;
          case "stop":
            this.request(1, null, null, true)
            break;
        }
      },
      handleSubmit (account) {
        this.request(1)
      },
      test (key) {
        alert(key)
      },
      show (index) {
        this.$router.push({
          name: 'new-show',
          params: {actId: this.activityData[index].actId}
        })
      },

      fetchList() {
        var that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })

        // 获取会员所属学会信息
        instance.get(that.GLOBAL.serverPath + '/common/getInstByPersonId?personId=' + window.localStorage.getItem('personId'))
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
      },
      request (currentPage, personId, sortByPriority, stop) {
        var that = this

        axios.request({
          url: '/activity/queryActivity',
          method: 'post',
          data: {
            actName: that.formInline.actName != '' ? that.formInline.actName : null,
            publish: that.formInline.publish,
            actStatusId: that.formInline.actStatusId != '' ? that.formInline.actStatusId : null,
            sortByPriority: sortByPriority,
            personId: personId,
            stop: stop,
            ids: that.formInline.ids,
            page: currentPage
          }
        }).then(function (res) {
          if (res.data.success) {
            that.total = res.data.data.total
            that.dataFromInterface = res.data.data.items
            that.activityData = []
            that.dataFromInterface.forEach((data) => {
              let obj = {}
              obj.actId = data.actId
              obj.instId = data.instId
              obj.instSubId = data.instSubId
              obj.personId = data.personId
              obj.actName = data.actName
              obj.actShort = data.actShort
              obj.actEngName = data.actEngName
              obj.industryId = data.industryId
              obj.actAddress = data.actAddress
              obj.actPriority = data.actPriority == 1? '低' : data.actPriority == 5 ? '中' : '高'
              obj.actStatusId = data.actStatusId
              obj.actMemo = data.actMemo
              obj.stop = data.stop
              obj.instName = data.instName
              obj.instSubName = data.instSubName
              obj.personName = data.personName
              obj.industryName = data.industryName
              obj.actDate = data.actDate
              obj.actDateFrom = data.actDateFrom
              obj.actDateTo = data.actDateTo
              obj.actStatusName = data.actStatusName
              obj.publish = data.publish === true? '已发布' : '未发布'
              that.activityData.push(obj)
            })
          } else {
            alert(response.data.errMsg)
          }
        }).catch(function (error) {
          that.$Message.error('服务器出小差了')
        })
      },
      changePage: function (page) {
        this.request(page)
      }
    }
  }
</script>

<style>
  .container {
    height: 600px;
    width: 100%;
  }
  .demo-drawer-profile{
    font-size: 14px;
  }
  .demo-drawer-profile .ivu-col{
    margin-bottom: 12px;
  }
</style>
