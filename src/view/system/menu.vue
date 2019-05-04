<template>
  <div class="mod-menu">
    <p>
      <Button type="success" @click="addOrUpdateHandle">新增</Button>
    </p>
    <br>
    <Table border :loading="loading" :height="500" :columns="columns" :data="dataList"></Table>
    <Modal
      v-model="addOrUpdateVisible"
      :closable="false">
      <add-or-update ref="addOrUpdate" @postMenu="postMenu" @cancel="close"></add-or-update>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'
  import AddOrUpdate from './addOrUpdate'

  export default {
    components: {
      AddOrUpdate
    },
    data () {
      return {
        columns: [
          {
            title: 'ID',
            key: 'menuId',
            align: 'center',
            width: 50
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
            key: 'icon',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: params.row.icon
                  }
                })
              ]);
            }
          },
          {
            title: '类型',
            key: 'type',
            align: 'center',
            render: (h, params) => {
              function f () {
                if (params.row.type===1){
                  return '菜单'
                } else if (params.row.type===2){
                  return '按钮'
                }
              }
              return h('div', [
                h('Tag', {
                  props: {

                  }
                },f())
              ])
            }
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
            title: '左侧隐藏',
            key: 'hideInMenu'
          },
          {
            title: '排序号',
            key: 'orderNum',
            align: 'center',
            width: 80
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
                      this.addOrUpdateHandle(params.index, true)
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
              ])
            }
          }
        ],
        dataList: [],
        loading: false,
        addOrUpdateVisible: false
      }
    },
    created () {
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
      addOrUpdateHandle (index, update) {
        this.addOrUpdateVisible = true
        if (update) {
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(this.dataList[index].menuId, update)
          })
        } else {
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init()
          })
        }
      },
      postMenu ({title, path, name, icon, component, orderNum, hideInMenu, parentId, perms, type, menuId, update}) {
        axios.request({
          url: `menu/info`,
          method: `${update ? 'put' : 'post'}`,
          data: {
            "component": component,
            "hideInMenu": hideInMenu,
            "icon": icon,
            "menuId": menuId,
            "name": name,
            "orderNum": orderNum,
            "parentId": parentId,
            "parentName": "",
            "path": path,
            "perms": perms,
            "title": title,
            "type": type
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.$Message.success({
              title: '成功',
              content: `${update ? '更新成功' : '新增成功'}`
            })
          } else {
            this.$Message.error({
              title: '错误',
              content: res.data.errMsg
            })
          }
          this.addOrUpdateVisible = false
          window.location.reload();
        })
      },
      close () {
        this.addOrUpdateVisible = false
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
                  content: '删除成功'
                })
              } else {
                this.$Modal.error({
                  title: '错误',
                  content: res.data.errMsg
                })
              }
              window.location.reload();
            })
          }
        })
      }
    }
  }
</script>
