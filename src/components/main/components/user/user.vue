<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="personInfo">个人信息</DropdownItem>
        <DropdownItem name="passwordModified">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        window.location = '/login'
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    personInfo () {
      this.$router.push({
        name: 'personInfo'
      })
    },
    passwordModified () {
      this.$router.push({
        name: 'passwordModified'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
        case 'personInfo': this.personInfo()
          break
        case 'passwordModified': this.passwordModified()
          break
      }
    }
  }
}
</script>
