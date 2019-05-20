<template>
  <div>
    <Button @click="industryInfo(false)" type="success">新增</Button>
    <Table stripe border :loading="loading" :height="500" :columns="columns" :data="dataList"></Table>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'

  export default {
    data () {
      return {
        columns: [
          {
            title: 'ID',
            key: 'industryId',
            align: 'center',
            width: 50
          },
          {
            title: '学会分类名称',
            key: 'indusName'
          },
          {
            title: '学会分类简称',
            key: 'indusShort'
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
                      this.updateIndustry(params.index)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeIndustry(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        dataList: [],
        loading: false,
        industry: {
          indusName: '',
          indusShort: '',
          industryId: 0
        }
      }
    },
    created () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        this.loading = true
        axios.request({
          url: 'societies/industries',
          method: 'get'
        }).then(res => {
          this.dataList = res.data.data
          this.loading = false
        })
      },
      industryInfo (isUpdate) {
        this.$Modal.confirm({
          render: (h) => {
            return h('div', [
              h('h2', {
                props: {
                }
              },'学会行业分类信息'),
              h('p', {
                props: {}
              },'学会行业分类名称:'),
              h('Input', {
                props: {
                  value: this.industry.indusName,
                  autofocus: true,
                  placeholder: '请输入学会行业分类名称'
                },
                on: {
                  input: (val) => {
                    this.industry.indusName = val
                  }
                }
              }),
              h('p', {
                props: {}
              },'学会行业分类简称:'),
              h('Input', {
                props: {
                  value: this.industry.indusShort,
                  autofocus: true,
                  placeholder: '请输入学会行业分类简称'
                },
                on: {
                  input: (val) => {
                    this.industry.indusShort = val
                  }
                }
              })

            ])
          },
          onOk: () => {
            axios.request({
              url: 'societies/industries',
              method: `${isUpdate ? 'put' : 'post'}`,
              data: this.industry
            }).then(res => {
              if (res.data.code === 200) {
                this.$Message.success({
                  title: '成功',
                  content: `${isUpdate ? '更新成功' : '添加成功'}`
                })
              } else {
                this.$Message.error({
                  title: '错误',
                  content: res.data.errMsg
                })
              }
              this.industry.indusName = ''
              this.industry.indusShort = ''
              this.industry.industryId = 0
              this.getDataList()
            }).catch(function (error) {
              this.$Message.error({
                title: '错误',
                content: error.message
              })
            })
          },
          onCancel: () => {
            this.industry.indusName = ''
            this.industry.indusShort = ''
            this.industry.industryId = 0
          }
        })
      },
      updateIndustry (index) {
        this.industry.indusName = this.dataList[index].indusName
        this.industry.indusShort = this.dataList[index].indusShort
        this.industry.industryId = this.dataList[index].industryId
        this.industryInfo(true)
      },
      removeIndustry (index) {
        this.$Modal.confirm({
          title: '警告',
          content: '你确定要删除吗？',
          onOk: () => {
            this.loading = true
            axios.request({
              url: `societies/industries/${this.dataList[index].industryId}`,
              method: 'delete'
            }).then(
              this.getDataList
            )
          }
        })

      }
    }
  }
</script>

<style scoped>

</style>
