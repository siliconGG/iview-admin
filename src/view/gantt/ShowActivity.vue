
<template>
  <div class="container">
    <RadioGroup v-model="button1" type="button" @on-change="radioSelected">
      <Radio name="1" label="日视图"></Radio>
      <Radio name="2" label="周视图"></Radio>
      <Radio name="3" label="月视图"></Radio>
    </RadioGroup>
    <!--<Button type="primary" @click="btn()">点我新增</Button>-->
    <div class="right-container">
      <div class="gantt-selected-info">
        <div v-if="selectedTask">
          <h2>{{selectedTask.text}}</h2>
          <span><b>ID: </b>{{selectedTask.id}}</span><br/>
          <span><b>完成度: </b>{{selectedTask.progress|toPercent}}%</span><br/>
          <span><b>开始时间: </b>{{selectedTask.start_date|niceDate}}</span><br/>
          <span><b>结束时间: </b>{{selectedTask.end_date|niceDate}}</span><br/>
          <span><b>负责人: </b>{{selectedTask.users}}</span><br/>
          <span><b>父节点: </b>{{selectedTask.parent}}</span><br/>

        </div>
        <div v-else class="select-task-prompt">
          <h2>任务信息</h2>
        </div>
      </div>
      <ul class="gantt-messages">
        <li class="gantt-message" v-for="message in messages">{{message}}</li>
      </ul>
    </div>
    <gantt ref="gantt" class="left-container" :tasks="tasks" @task-updated="logTaskUpdate" @link-updated="logLinkUpdate" @task-selected="selectTask"></gantt>
  </div>
</template>

<script>
  import Gantt from './Gantt.vue'

  export default {
    name: 'showActivity',
    components: {Gantt},
    data () {
      return {
        button1:'月视图',
        tasks: {
          data: [
            // {id: 1, text: 'Task #1', users: '陈进颖', person_id: '1',priority: '低', act_type: '活动' ,start_date: '2019-04-1', duration: 8, shepi: '1',
            //   act_short:'简称', act_eng_name: 'english', act_address: '浙江杭州', act_memo: '',act_status_id: '', milestone: '1'
            // },
            // {id: 3, text: 'Task #1', users: '陈进颖', priority: '低', act_type: '子活动', start_date: '2019-04-1', duration: 8, progress: 0.6, shepi: '2',milestone: '0'
            // },
            // {id: 5, text: 'Task #1', users: '陈进颖',priority: '低',act_type: '任务', start_date: '2019-04-1', duration: 8, progress: 0.6, shepi: '3',milestone: '1'
            // },
          ],
          links: [
            {id: 1, source: 1, target: 2, type: '0'}
          ],
          priorityList: [
            {
              key: '1',
              value: '1',
              label: '低'
            }, {
              key: '5',
              value: '5',
              label: '中'
            }, {
              key: '10',
              value: '10',
              label: '高'
            }
          ],
          ganttPersonList: []
        },
        industryList: [],
        cascaderData: [],
        selectedTask: null,
        messages: []
      }
    },
    // mounted: {
    //  // setScaleConfig('5')
    // },

    created () {
      this.fetchData()
    },
    filters: {
      toPercent (val) {
        if(!val) return '0'
        return Math.round((+val) * 100)
      },
      niceDate (obj){
        return `${obj.getFullYear()} / ${obj.getMonth() + 1} / ${obj.getDate()}`
      }
    },
    methods: {
      fetchData: function (personId) {
        var that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })

        instance.get( that.GLOBAL.serverPath + "/activity/getActivityById?actId=" + this.$route.params.actId).then(res => {
          if (res.data.success) {
            let activityData = res.data.data;
            let mainActivity = {};
            mainActivity.id = activityData.id
            mainActivity.text = activityData.actName
            mainActivity.users = activityData.personName
            mainActivity.act_type = '活动'
            mainActivity.person_id = activityData.person_id
            mainActivity.priority = activityData.actPriority
            mainActivity.act_short = activityData.actShort
            mainActivity.act_eng_name = activityData.actEngName
            mainActivity.act_address = activityData.actAddress
            mainActivity.act_memo = activityData.actMemo
            mainActivity.act_status_id = activityData.actStatusId
            mainActivity.act_status_name = activityData.actStatusName
            mainActivity.start_date = activityData.dateFrom
            mainActivity.duration = (activityData.actDateTo - activityData.actDateFrom) / 86400
            mainActivity.duty = activityData.duty
            let priorityName = ''
            that.tasks.priorityList.forEach((priority) => {
              if (priority.key == activityData.actPriority) {
                priorityName = priority.label
              }
            })
            mainActivity.priorityName = priorityName
            that.tasks.data.push(mainActivity)

            let taskList = [];
            let actTasks = activityData.tasks;
            actTasks.forEach( task => {
              let obj = {};
              obj.id = task.taskId
              obj.text = task.taskName
              obj.users = task.personName
              obj.act_type = "任务"
              obj.person_id = task.personId
              obj.priority = task.taskPriority
              obj.act_short = task.taskShort
              obj.act_eng_name = task.taskEngName
              obj.act_memo = task.taskMemo
              obj.parent = task.actId
              obj.start_date = task.taskDateFrom
              obj.duration = (new Date(task.taskDateTo).getTime() - new Date(task.taskDateFrom).getTime()) / 86400000
              obj.act_status_id = task.taskStatusId
              obj.act_status_name = task.taskStatusName
              obj.duty = task.duty

              let priorityName = ''
              that.tasks.priorityList.forEach((priority) => {
                if (priority.key == task.taskPriority) {
                  priorityName = priority.label
                }
              })
              obj.priorityName = priorityName
              taskList.push(obj)
            })

            var result = [];    // 存放结果
            (function traverse(node) {
              node.forEach(i => {
                let actSubTasks = i.tasks;
                actSubTasks.forEach( task => {
                  let obj = {};
                  obj.id = task.taskId
                  obj.text = task.taskName
                  obj.users = task.personName
                  obj.act_type = "任务"
                  obj.person_id = task.personId
                  obj.priority = task.taskPriority
                  obj.act_short = task.taskShort
                  obj.act_eng_name = task.taskEngName
                  obj.act_memo = task.taskMemo
                  obj.parent = task.actSubId
                  obj.start_date = task.taskDateFrom
                  obj.duration = (new Date(task.taskDateTo).getTime() - new Date(task.taskDateFrom).getTime()) / 86400000
                  obj.act_status_id = task.taskStatusId
                  obj.act_status_name = task.taskStatusName
                  obj.duty = task.duty
                  let priorityName = ''
                  that.tasks.priorityList.forEach((priority) => {
                    if (priority.key == task.taskPriority) {
                      priorityName = priority.label
                    }
                  })
                  obj.priorityName = priorityName
                  taskList.push(obj)
                })

                let priorityName = ''
                that.tasks.priorityList.forEach((priority) => {
                  if (priority.key == i.actPriority) {
                    priorityName = priority.label
                  }
                })
                result.push({
                  id: i.id,
                  parent: i.parentId,
                  text: i.actName,
                  act_type: "子活动",
                  users: i.personName,
                  priority: i.actPriority,
                  start_date: i.dateFrom,
                  duration: (i.actDateTo - i.actDateFrom) / 86400,
                  act_status_name: i.actStatusName,
                  act_memo: i.actMemo,
                  act_address: i.actAddress,
                  act_eng_name: i.actEngName,
                  act_short: i.actShort,
                  person_id: i.personId,
                  priorityName: priorityName,
                  duty: i.duty
                });
                // 有子数据的先遍历子数据
                i.children && traverse(i.children)
              })
            })(activityData.children);


            result.forEach( e => {
              that.tasks.data.push(e)
            })
            // 顺序不可变，先活动后任务
            that.tasks.data.forEach( activity => {
              that.$refs.gantt.addSubActivityTask(activity)
            })
            taskList.forEach( task => {
              that.$refs.gantt.addSubActivityTask(task)
            })
            console.log(that.tasks.data);
          } else {
            alert("服务器出小差拉～～")
          }
        }).catch( e => {
          alert(e);
        })




        // 获取会员所属学会信息
        instance.get(that.GLOBAL.serverPath + '/common/getInstByPersonId')
          .then(function (response) {
            if (response.data.success) {
              let datas = response.data.data
              datas.forEach((data) => {
                let obj = {}
                obj.value = data.instId
                obj.label = data.instName
                obj.children = []
                let subInfoSimpleList = data.subInfoSimpleList
                subInfoSimpleList.forEach((subInfo) => {
                  let childObj = {}
                  childObj.value = subInfo.instSubId
                  childObj.label = subInfo.instSubName
                  obj.children.push(childObj)
                })
                that.cascaderData.push(obj)
              })
            } else {
              alert(response.data.errMsg)
            }
          })
          .catch(function (error) {
            console.log(error)
            alert('服务器开小差啦～～ \n' + error.message)
          })

        // 获取会员信息，用于指派分配任务
        instance.get(that.GLOBAL.serverPath + '/common/getMember')
          .then(function (response) {
            if (response.data.success) {
              let datas = response.data.data
              datas.forEach((data) => {
                let person = {}
                person.personId = data.personId
                person.key = data.personId
                person.value = data.name
                person.label = data.name
                that.tasks.ganttPersonList.push(person)
              })
            } else {
              alert(response.data.errMsg)
            }
          })
          .catch(function (error) {
            console.log(error)
            alert('服务器开小差啦～～ \n' + error.message)
          })

        // 获取活动行业分类信息
        instance.get(that.GLOBAL.serverPath + '/common/getIndustryName')
          .then(function (response) {
            if (response.data.success) {
              let datas = response.data.data
              datas.forEach((data) => {
                let industry = {}
                industry.industryId = data.industryId
                industry.value = data.indusName
                industry.label = data.indusName
                that.industryList.push(industry)
              })
            } else {
              alert(response.data.errMsg)
            }
          })
          .catch(function (error) {
            console.log(error)
            alert('服务器开小差啦～～ \n' + error.message)
          })


      },





























      radioSelected: function(name){
        this.$refs.gantt.viewChanged(name);
      },

      selectTask (task) {
        this.selectedTask = task
      },

      addMessage (message) {
        this.messages.unshift(message)
        if(this.messages.length > 40) {
          this.messages.pop()
        }
      },

      // 记录对任务的修改记录
      logTaskUpdate (id, mode, task) {
        let operate = ''
        switch (mode) {
          case 'updated':
            operate = '更新';
            break;
          case 'deleted':
            operate = '删除';
            break
          case 'inserted':
            operate = '新增';
            break;
          default :
            operate = '更新'
        }
        let text = (task && task.text ? ` (${task.text})`: '')
        let message = `${operate}活动 :  ${text}`
        this.addMessage(message)
      },

      // 记录对连接箭头的修改记录
      logLinkUpdate (id, mode, link) {
        let message = `Link ${mode}: ${id}`
        if(link){
          message += ` ( source: ${link.source}, target: ${link.target} )`
        }
        this.addMessage(message)
      }
    }
  }
</script>

<style>
  html, body {
    height: 100%;
    padding: 0px;
    margin: 0px;
    /*overflow: auto;*/
  }


  .status_line {
    background-color: #0ca30a;
  }
  .container {
    height: 600px;
    width: 100%;
  }

  .left-container {
    overflow: hidden;
    position: relative;
    height: 100%;
  }
  .right-container {
    border-right: 1px solid #cecece;
    float: right;
    height: 300px;
    width: 200px;
    box-shadow: 0 0 5px 2px #aaa;
    position: relative;
    z-index:2;
  }

  .gantt-messages {
    list-style-type: none;
    height: 200px;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding-left: 5px;
  }

  .gantt-messages > .gantt-message {
    background-color: #f4f4f4;
    box-shadow:inset 5px 0 #d69000;
    font-family: Geneva, Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin: 5px 0;
    padding: 8px 0 8px 10px;
  }

  .gantt-selected-info {
    border-bottom: 1px solid #cecece;
    box-sizing: border-box;
    font-family: Geneva, Arial, Helvetica, sans-serif;
    height: 100%;
    line-height: 28px;
    padding: 10px;
  }

  .gantt-selected-info h2 {
    border-bottom: 1px solid #cecece;
  }

  .select-task-prompt h2{
    color: #d9d9d9;
  }

</style>
