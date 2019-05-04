<template>
  <div>
    <Button @click="value1 = true" type="success">新增</Button>
    <Drawer
      :title="drawTitle"
      v-model="value1"
      width="720"
      :mask-closable="false"
      :styles="styles"
    >
      <Form ref="formData" :model="formData">
        <FormItem label="角色名称" label-position="top" prop="roleName">
          <Input v-model="formData.roleName" placeholder="请输入角色名称"/>
        </FormItem>
        <FormItem label="角色权限" label-position="top" prop="menuId">
          <tree-select
            v-model="formData.menuId"
            style="width: 400px;"
            check-strictly
            :expand-all="false"
            :data="MenuList"
          ></tree-select>
          <p>需要同时选择上级菜单，否则路由不能成功加载</p>
        </FormItem>
        <FormItem label="备注" label-position="top" prop="memo">
          <Input type="textarea" v-model="formData.memo" :rows="4" placeholder="请输入角色的备注"/>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="cancel('formData')">取消</Button>
        <Button type="primary" @click="postRole('formData')">提交</Button>
      </div>
    </Drawer>
    <br>
    <Table border :loading="loading" :height="500" :columns="columns" :data="dataList"></Table>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'
  import TreeSelect from '@/view/utils/tree-select/tree-select.vue'

  export default {
    components: {
      TreeSelect
    },
    data () {
      return {
        value1: false,
        drawTitle: '新增角色',
        update: false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        MenuList: [],
        formData: {
          roleId: '',
          roleName: '',
          menuId: [],
          memo: ''
        },
        columns: [
          {
            title: 'ID',
            key: 'roleId',
            align: 'center',
            width: 50
          },
          {
            title: '角色名称',
            key: 'roleName'
          },
          {
            title: '角色备注',
            key: 'memo'
          },
          {
            title: '创建时间',
            key: 'formatTime'
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
                      this.updateRole(params.index)
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
      }
    },
    created () {
      this.getDataList()
      this.getMenuList()
    },
    methods: {
      getDataList () {
        this.loading = true
        axios.request({
          url: 'role/list',
          method: 'get'
        }).then(res => {
          this.dataList = res.data.data
          this.loading = false
        })
      },
      getMenuList () {
        axios.request({
          url: 'menu/tree',
          method: 'get'
        }).then(res => {
          this.MenuList = res.data.data
        })
      },
      remove (index) {
        this.$Modal.confirm({
          title: '警告',
          content: '你确定要删除吗？',
          onOk: () => {
            this.loading = true
            axios.request({
              url: `role/info/${this.dataList[index].roleId}`,
              method: 'delete'
            }).then(res => {
              this.getDataList()
              if (res.data.code === 200) {
                this.$Message.success({
                  title: '成功',
                  content: '删除成功'
                })
              } else {
                this.$Message.error({
                  title: '错误',
                  content: res.data.errMsg
                })
              }
            })
          }
        })
      },
      updateRole (index) {
        axios.request({
          url: `role/info/${this.dataList[index].roleId}`,
          method: 'get'
        }).then(res => {
          this.formData.roleId=res.data.data.roleId
          this.formData.roleName=res.data.data.roleName
          this.formData.menuId=res.data.data.menuId
          this.formData.memo=res.data.data.memo
          this.drawTitle='更新角色'
          this.update=true
          this.value1=true
        })
      },
      cancel (name) {
        this.$refs[name].resetFields();
        this.value1=false
        this.drawTitle='新增角色'
        this.update=false
      },
      postRole (name) {
        axios.request({
          url: `role/info`,
          method: `${this.update ? 'put' : 'post'}`,
          data: this.formData
        }).then(res => {
          if (res.data.code === 200) {
            this.$Message.success({
              title: '成功',
              content: `${this.update ? '更新成功' : '新增成功'}`
            })
          } else {
            this.$Message.error({
              title: '错误',
              content: res.data.errMsg
            })
          }
          this.getDataList()
          this.cancel(name)
        })
      }
    }
  }
</script>

<style>
  .demo-drawer-footer {
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
