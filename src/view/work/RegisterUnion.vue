<template>
  <Form :model="union" :label-width="80">
    <h1>请填写学联体注册信息</h1>
    <FormItem label="名称">
      <Input v-model="union.name" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem label="简称">
      <Input v-model="union.short" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem label="英文名">
      <Input v-model="union.eng_name" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem label="地址">
      <Input v-model="union.address" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem label="网址">
      <Input v-model="union.website" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem label="微信公众号">
      <Input v-model="union.wechat" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem label="QQ群">
      <Input v-model="union.qq" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem label="其他联系方式">
      <Input v-model="union.others" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem label="成立时间">
      <Row>
        <Col span="11">
          <DatePicker type="date" placeholder="Select date" v-model="union.register_date"></DatePicker>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="简介">
      <Input v-model="union.introduction" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem label="备注">
      <Input v-model="union.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem>
      <Button type="primary">Submit</Button>
      <Button style="margin-left: 8px">Cancel</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'union',
  data () {
    return {
      union: {
        name: '',
        short: '',
        eng_name: '',
        address: '',
        website: '',
        wechat: '',
        qq: '',
        others: '',
        register_date: '',
        introduction: '',
        memo: ''
      }
    }
  }
}
</script>
