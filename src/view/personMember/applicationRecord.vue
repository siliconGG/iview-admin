<template>
  <Timeline>
    <TimelineItem v-for="record in records">
      <p class="time">{{record.editTime}}</p>
      <p class="content">{{record.message}}</p>
    </TimelineItem>
  </Timeline>
</template>

<script>
  import axios from '@/libs/api.request'

  export default {
    data() {
      return {
        records: []
      }
    },
    methods: {
      init(applicationId) {
        axios.request({
          url: `authentication/guest/application/record/${applicationId}`,
          method: 'get'
        }).then(res => {
          this.records = res.data.data
        })
      }
    }
  }
</script>

<style scoped>
  .time{
    font-size: 14px;
    font-weight: bold;
  }
  .content{
    padding-left: 5px;
  }
</style>
