<template>
  <Tabs v-model="tab">
    <TabPane label="菜单" name="menu">
      <Form :model="menuItem" :label-width="80">
        <FormItem label="名称">
          <Input v-model="menuItem.title" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="菜单URL">
          <Input v-model="menuItem.path" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="缓存名称">
          <Input v-model="menuItem.name" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="页面路径">
          <Input v-model="menuItem.component" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="页面图标">
          <Input v-model="menuItem.icon" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="父菜单名称">
          <Select v-model="menuItem.parentId">
            <Option v-for="item in MenuList" :value="item.menuId" :key="item.menuId">{{item.menuName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="排序号">
          <InputNumber :max="100" :min="0" v-model="menuItem.orderNumber"></InputNumber>
        </FormItem>
        <FormItem label="是否在左侧菜单中隐藏">
          <i-switch v-model="menuItem.hideInMenu" size="large">
            <span slot="open">隐藏</span>
            <span slot="close">不隐藏</span>
          </i-switch>
        </FormItem>
        <FormItem label="授权">
          <Input v-model="menuItem.perms" placeholder="多个用逗号分隔，如：menu:add,menu:delete"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="postMenu">提交</Button>
          <Button style="margin-left: 8px" @click="cancel">取消</Button>
        </FormItem>
      </Form>
    </TabPane>
    <TabPane label="按钮" name="button">
      <Form :model="menuItem" :label-width="80">
        <FormItem label="名称">
          <Input v-model="menuItem.title" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="父菜单名称">
          <Select v-model="menuItem.parentId">
            <Option v-for="item in MenuList" :value="item.menuId" :key="item.menuId">{{item.menuName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="授权">
          <Input v-model="menuItem.perms" placeholder="多个用逗号分隔，如：menu:add,menu:delete"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="postMenu">提交</Button>
          <Button style="margin-left: 8px" @click="cancel">取消</Button>
        </FormItem>
      </Form>
    </TabPane>
  </Tabs>
</template>

<script>
  import axios from '@/libs/api.request'
  export default {
    name: 'AddOrUpdate',
    data () {
      return {
        tab: 'menu',
        update: false,
        menuItem: {
          menuId: '',
          title: '',
          path: '',
          name: '',
          icon: '',
          component: '',
          orderNumber: 0,
          hideInMenu: false,
          parentId: 0,
          parentName: '一级菜单',
          perms: '',
          type: 1
        },
        MenuList: []
      }
    },
    methods: {
      init(menuId,update) {
        Object.assign(this.$data,this.$options.data())
        if (update) {
          this.update = true
          axios.request({
            url: `menu/info/${menuId}`,
            method: 'get'
          }).then(res => {
            this.menuItem.menuId = res.data.data.menuId
            this.menuItem.title = res.data.data.title
            this.menuItem.path = res.data.data.path
            this.menuItem.name = res.data.data.name
            this.menuItem.icon = res.data.data.icon
            this.menuItem.component = res.data.data.component
            this.menuItem.orderNumber = res.data.data.orderNum
            this.menuItem.hideInMenu = res.data.data.hideInMenu
            this.menuItem.parentId = res.data.data.parentId
            this.menuItem.parentName = res.data.data.parentName
            this.menuItem.perms = res.data.data.perms
            this.menuItem.type = res.data.data.type
            if (this.menuItem.type === 1) {
              this.tab='menu'
            } else {
              this.tab='button'
            }
          })
        }
        this.parentMenuList();
      },
      parentMenuList () {
        axios.request({
          url: 'menu/select',
          method: 'get'
        }).then(res => {
          this.MenuList = res.data.data
        })
      },
      postMenu () {
        this.$emit('postMenu', {
          title: this.menuItem.title,
          path: this.menuItem.path,
          name: this.menuItem.name,
          icon: this.menuItem.icon,
          component: this.menuItem.component,
          orderNum: this.menuItem.orderNumber,
          hideInMenu: this.menuItem.hideInMenu,
          parentId: this.menuItem.parentId,
          perms: this.menuItem.perms,
          type: `${this.tab === 'menu' ? 1 : 2}`,
          menuId: this.menuItem.menuId,
          update: this.update
        })
      },
      cancel () {
        this.$emit('cancel', {
        })
      }
    }
  }
</script>

