<template>
  <div class="mod-menu">
    <p>
      <Button type="success" @click="addOrUpdateHandle">新增</Button>
    </p>
    <Table border :loading="loading" :height="500" :columns="columns" :data="dataList"></Table>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'
  import addOrUpdate from  '@/view/system/addOrUpdate'
  export default {
    name: 'menu',
    data() {
      return {
        columns: [
          {
            title: 'ID',
            key: 'menuId'
          },
          {
            title: '菜单名称',
            key: 'title'
          },
          {
            title: '缓存名称',
            key: 'name'
          },
          {
            title: '上级菜单',
            key: 'parentName'
          },
          {
            title: '图标',
            key: 'icon'
          },
          {
            title: '类型',
            key: 'type'
          },
          {
            title: '菜单URL',
            key: 'path'
          },
          {
            title: '菜单路由',
            key: 'component'
          },
          {
            title: '图标',
            key: 'icon'
          },
          {
            title: '是否在左侧显示',
            key: 'hideInMenu'
          },
          {
            title: '排序号',
            key: 'orderNum'
          },
          {
            title: '权限标识',
            key: 'perms'
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
                      this.addOrUpdateHandle(params.index)
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
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        dataList: [],
        loading: false
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        this.loading = true
        axios.request({
          url: 'menu/list',
          method: 'get'
        }).then(res => {
            this.dataList = res.data.data
            this.loading = false
        })
      },
      addOrUpdateHandle (index) {
        this.$Modal.confirm({
          render: (h) => {
            return h('addOrUpdate', {
              props: {
                value: this.dataList,
                autofocus: true,
                placeholder: 'Please enter your name...'
              },
              on: {
                input: (val) => {
                  this.dataList = val;
                }
              }
            })
          }
        })
      },
      remove (index) {
        this.$Modal.confirm({
          title: '警告',
          content: '你确定要删除吗？',
          onOk: () => {
            this.loading = true
            axios.request({
              url: `menu/info/${this.dataList[index].menuId}`,
              method: 'delete'
            }).then(res => {
              if (res.data.code === 200) {
                this.$Modal.success({
                  title: '成功',
                  content: "删除成功"
                })
              } else {
                this.$Modal.error({
                  title: '错误',
                  content: res.data.errMsg
                })
              }
              this.getDataList()
            })
          }
        })
      }
    }
  }
</script>
