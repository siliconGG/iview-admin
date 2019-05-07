<template>
  <div class="container">
    <Form ref="formInline" :model="formInline" inline>
      <FormItem prop="borrowRecord">
        <Input type="text" v-model="formInline.instName" placeholder="学会名称">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">查找</Button>
      </FormItem>
    </Form>
    <Table border :columns="columns" :data="instituteData">
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

export default {
  name: 'AllInstitute',
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
      formInline: {
        instName: ''
      },
      columns: [
        {
          title: '学会编号',
          key: 'instId'
          // render: (h, params) => {
          //   return h('div', [
          //     h('Icon', {
          //       props: {
          //         type: 'document-text'
          //       }
          //     }),
          //     h('strong', params.row.instId)
          //   ]);
          // }
        },
        {
          title: '学会全称',
          key: 'instName'
        },
        {
          title: '学会简称',
          key: 'instShort'
        },
        {
          title: '学会领域',
          key: 'industryName'
        },
        {
          title: '学会所在地',
          key: 'instAddress'
        },
        {
          title: '学会成立时间',
          key: 'instRegisterDate'
        },
        {
          title: '学会介绍',
          key: 'instIntroduction'
        },
        {
          title: '学会分会',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.getSubs(params.index)
                  }
                }
              }, '分会信息')
            ])
          }
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
              }, '详情'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.edit(params.index)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      instituteData: [],
      dataFromInterface: []
    }
  },
  mounted () {
    this.request(1)
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
        format = format.replace(RegExp.$1, (timestamp.getFullYear() + '').substr(4 - RegExp.$1.length))
      }

      for (var k in date) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
        }
      }

      return format
    },
    handleSubmit (account) {
      this.request(1)
    },
    test (key) {
      alert(key)
    },
    show (index) {
      this.$Modal.info({
        title: '学会信息',
        content: `<h3>学会名称:${this.instituteData[index].instName}</h3><br>
                    <h3>学会英文名:      ${this.instituteData[index].instEngName}</h3><br>
                    <h3>学会当前第几届:   第${this.instituteData[index].instPeriods.length === 0 ? '0' : this.instituteData[index].instPeriods[0].instPeriodNo}届</h3><br>
                    <h3>学会本届负责人:   <a href="http://www.baidu.com" target="_blank">${this.instituteData[index].instPeriods.length === 0 ? '' : this.instituteData[index].instPeriods[0].personChargers[0].personMember.name}</a></h3><br>
                    <h3>负责人头衔:      ${this.instituteData[index].instPeriods.length === 0 ? '' : this.instituteData[index].instPeriods[0].personChargers[0].personTitleName}</h3><br>
                    <h3>学会本届开始时间: ${this.instituteData[index].instPeriods.length === 0 ? '' : this.instituteData[index].instPeriods[0].instPeriodFrom}</h3><br>
                    <h3>学会本届结束时间: ${this.instituteData[index].instPeriods.length === 0 ? '' : this.instituteData[index].instPeriods[0].instPeriodTo}</h3><br>
                    <h3>学会网址:        ${this.instituteData[index].instWebsite}</h3><br>
                    <h3>学会备注:        ${this.instituteData[index].instMemo}</h3>`,
        width: 700,
        onOk: () => {
          this.$Message.info('Clicked ok')
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    },
    getSubs (index) {
      this.lists = []
      let that = this

      let instance = this.$ajax.create({
        // 用来将token放到header上
        headers: {'token': window.localStorage.getItem('token')}
      })

      instance.get(that.GLOBAL.serverPath + '/institute/getInstSubs?instId=' + that.instituteData[index].instId
      ).then(function (res) {
        if (res.data.success) {
          let results = res.data.data
          results.forEach((result) => {
            let obj = {}
            obj.id = result.instSubId
            obj.instSubEngName = result.instSubEngName
            obj.instSubName = result.instSubName
            obj.chargerName = result.chargerName
            obj.personTitleName = result.personTitleName
            obj.instSubShort = result.instSubShort
            obj.industryName = result.industryName
            obj.instSubIntroduction = result.instSubIntroduction
            obj.instSubPeriodNo = result.instSubPeriodNo
            obj.instSubPeriodFrom = result.instSubPeriodFrom
            obj.instSubPeriodTo = result.instSubPeriodTo
            obj.instSubAddress = result.instSubAddress
            that.lists.push(obj)
          })
          that.showPanel = '' // 把showPanel原来的值去掉
          setTimeout(() => {
            this.showPanel = '1' // 如果上面没有把showPanel的值改掉，此处取值和原来的showPanel一样，那么也不会生效。
          }, 0)
          if (that.lists.length === 0) {
            that.value1 = false
            that.$Message.info('该学会下暂无分会')
          } else {
            that.value1 = true
          }
        } else {
          that.$Message.error('服务器出小差了')
        }
      }).catch(function (error) {
        that.$Message.status('操作失败')
      })
    },
    edit (index) {
      this.$router.push({
        name: 'instInfo'
      })
    },
    request (currentPage) {
      var that = this

      axios.request({
        url: '/institute/getAllInstitute',
        method: 'post',
        data: {
          instName: that.formInline.instName != '' ? that.formInline.instName : null,
          page: currentPage
        }
      }).then(function (res) {
        if (res.data.success) {
          that.total = res.data.data.total
          that.dataFromInterface = res.data.data.items
          that.instituteData = []
          that.dataFromInterface.forEach((data) => {
            let obj = {}
            obj.instId = data.instId
            obj.instName = data.instName
            obj.instShort = data.instShort
            obj.industryName = data.industryName
            obj.industryId = data.industryId
            obj.instIntroduction = data.instIntroduction
            obj.instEngName = data.instEngName
            obj.instAddress = data.instAddress
            obj.instWebsite = data.instWebsite
            obj.instWechat = data.instWechat
            obj.instMemo = data.instMemo
            obj.instRegisterDate = that.dateFormat(new Date(data.instRegisterDate * 1000), 'yyyy-MM-dd')
            obj.instPeriods = data.instPeriods
            that.instituteData.push(obj)
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
