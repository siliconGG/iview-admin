<template>
  <div>
    <Table border :loading="loading" stripe :columns="columns" :data="data"></Table>
    <Drawer
      title="审核入会申请"
      v-model="value1"
      width="720"
      :style="styles"
    >
      <div class="demo-drawer-profile">
        <Row>
          <Col span="8">
            姓名: {{application.name}}
          </Col>
          <Col span="8">
            性别: {{application.sex}}
          </Col>
          <Col span="8">
            生日: {{application.birthday}}
          </Col>
        </Row>
        <Row>
          <Col span="8">
            学历: {{application.educationId}}
          </Col>
          <Col span="8">
            民族: {{application.ethnic}}
          </Col>
          <Col span="8">
            党派: {{application.partisan}}
          </Col>
        </Row>
        <Row>
          <Col span="8">
            邮件: {{application.educationId}}
          </Col>
          <Col span="8">
            电话1: {{application.ethnic}}
          </Col>
          <Col span="8">
            电话2: {{application.partisan}}
          </Col>
        </Row>
        <Row>
          <Col span="8">
            QQ: {{application.educationId}}
          </Col>
          <Col span="8">
            微信: {{application.ethnic}}
          </Col>
          <Col span="8">
            其他联系方式: {{application.partisan}}
          </Col>
        </Row>
        <Row>
          社会任职情况：{{application.personPublicDuty}}
        </Row>
        <Row>
          获奖情况：{{application.personAwards}}
        </Row>
        <Row>
          备注：{{application.memo}}
        </Row>
      </div>
      <br>
      不通过请填写原因:<Input v-model="message" type="textarea" placeholder="请填写原因" />
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" type="error" @click="disagreeApplication(application.applicationId)">不同意</Button>
        <Button type="primary" @click="agreeApplication(application.applicationId)">同意</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'

  export default {
    data() {
      return {
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        columns: [
          {
            title: '申请号',
            key: 'applicationId',
            align: 'center'
          },
          {
            title: '申请人',
            key: 'personName'
          },
          {
            title: '申请时间',
            key: 'addTime'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showApplication(this.data[params.index].applicationId)
                  }
                }
              }, '查看详情')
            }
          }
        ],
        data: [],
        loading: false,
        value1: false,
        application: [],
        message: ''
      }
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        this.loading = true
        axios.request({
          url: 'authentication/review/application',
          method: 'get'
        }).then(res => {
          this.data = res.data.data
          this.loading = false
        })
      },
      showApplication (applicationId) {
        this.message = ''
        axios.request({
          url: `authentication/review/application/${applicationId}`,
          method: 'get'
        }).then(res => {
          this.application = res.data.data
          this.value1 = true
        })
      },
      agreeApplication (applicationId) {
        axios.request({
          url: `authentication/review/application/${applicationId}`,
          method: 'put'
        }).then(res => {
          this.getDataList()
          this.value1 = false
          this.$Message.success(res.data.data)
        })
      },
      disagreeApplication (applicationId) {
        if (this.message==='') {
          this.$Message.error("不通过请填写原因")
        } else {
          axios.request({
            url: `authentication/review/application/${applicationId}/${this.message}`,
            method: 'put'
          }).then(res => {
            this.getDataList()
            this.value1 = false
            this.$Message.success(res.data.data)
          })
        }
      }
    }
  }
</script>

<style scoped>
  .demo-drawer-profile{
    font-size: 14px;
  }
  .demo-drawer-profile{
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
