<template>
  <Tabs v-model="tab">
    <TabPane label="菜单" name="menu">
      <Form :model="menuItem" :label-width="80">
        <FormItem label="名称" style="width:400px">
          <Input v-model="menuItem.title" placeholder="左侧菜单显示名称"></Input>
        </FormItem>
        <FormItem label="菜单URL" style="width:400px">
          <Input v-model="menuItem.path" placeholder="网页url地址"></Input>
        </FormItem>
        <FormItem label="缓存名称" style="width:400px">
          <Input v-model="menuItem.name" placeholder="缓存名称"></Input>
        </FormItem>
        <FormItem label="页面路径" style="width:400px">
          <Input v-model="menuItem.component" placeholder="填写菜单页面所在位置"></Input>
          <p>一级目录填写components/main；二级及更多目录填写components/parentView</p>
        </FormItem>
        <FormItem label="页面图标">
          <Select v-model="menuItem.icon" style="width:250px">
            <Option v-for="item in iconList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Icon size="30" :type="menuItem.icon" />
        </FormItem>
        <FormItem label="父菜单名称">
          <Select v-model="menuItem.parentId" style="width:250px">
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
        <FormItem label="授权" style="width:400px">
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
        <FormItem label="名称" style="width:400px">
          <Input v-model="menuItem.title" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="父菜单名称" style="width:250px">
          <Select v-model="menuItem.parentId">
            <Option v-for="item in MenuList" :value="item.menuId" :key="item.menuId">{{item.menuName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="授权" style="width:400px">
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
        value1: false,
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
        MenuList: [],
        iconList: [
          {
            value: 'md-menu',
            label: '菜单'
          },
          {
            value: 'md-list',
            label: '列表'
          },
          {
            value: 'md-time',
            label: '时间'
          },
          {
            value: 'md-stats',
            label: 'stats'
          },
          {
            value: 'md-settings',
            label: '设置'
          },
          {
            value: 'md-search',
            label: '搜索'
          },
          {
            value: 'md-reorder',
            label: 'reorder'
          },
          {
            value: 'md-podium',
            label: 'podium'
          },
          {
            value: 'md-pie',
            label: '饼状'
          },
          {
            value: 'md-person',
            label: '人'
          },
          {
            value: 'md-person-add',
            label: '添加人'
          },
          {
            value: 'md-people',
            label: '多人'
          },
          {
            value: 'md-notifications',
            label: '通知'
          },
          {
            value: 'md-cloud-download',
            label: '下载'
          },
          {
            value: 'md-create',
            label: '新建'
          },
          {
            value: 'md-copy',
            label: '复制'
          },
          {
            value: 'md-folder',
            label: '文件'
          },
          {
            value: 'md-funnel',
            label: 'funnel'
          },
          {
            value: 'md-map',
            label: '地图'
          }
        ]
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

