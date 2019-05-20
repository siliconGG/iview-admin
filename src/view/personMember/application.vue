<template>
  <div>
    <Table border :loading="loading" stripe :columns="columns" :data="data"></Table>
    <Modal
      v-model="recordVisible">
      <application-record ref="applicationRecord"></application-record>
      <div slot="footer">
        <Button type="info" size="large" long @click="recordVisible = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'
  import applicationRecord from './applicationRecord'

  export default {
    components: {
      applicationRecord
    },
    data () {
      return {
        columns: [
          {
            title: '申请号',
            key: 'applicationId',
            align: 'center'
          },
          {
            title: '申请时间',
            key: 'applicationTime'
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              function f () {
                if (params.row.status === 0) {
                  return '待审核'
                } else if (params.row.status === 1) {
                  return '通过'
                } else if (params.row.status === 2) {
                  return '未通过'
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
            title: '最后修改时间',
            key: 'lastEditTime'
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
                    this.showRecord(params.index)
                  }
                }
              }, '查看详情')
            }
          }
        ],
        data: [],
        loading: false,
        recordVisible: false
      }
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        this.loading = true
        axios.request({
          url: 'authentication/guest/application',
          method: 'get'
        }).then(res => {
          this.data = res.data.data
          this.loading = false
        })
      },
      showRecord (index) {
        this.$nextTick(() => {
          this.$refs.applicationRecord.init(this.data[index].applicationId)
        })
        this.recordVisible = true
      }
    }
  }
</script>

<style scoped>

</style>
