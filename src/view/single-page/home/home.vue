<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周学会会员活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '学会个数', icon: 'ios-people', count: 25, color: '#2d8cf0' },
        { title: '累计点击', icon: 'md-locate', count: 22, color: '#19be6b' },
        { title: '会员总数', icon: 'ios-man', count: 142, color: '#ff9900' },
        { title: '单位会员', icon: 'ios-school', count: 40, color: '#ed3f14' },
        { title: '新闻数量', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' }
      ],
      pieData: [
        {value: 335, name: '直接访问'},
        {value: 135, name: 'APP访问'},
        {value: 548, name: '搜索引擎'}
      ],
      barData: {
        Mon: 3253,
        Tue: 4235,
        Wed: 6321,
        Thu: 2340,
        Fri: 4643,
        Sat: 322,
        Sun: 324
      }
    }
  },
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
