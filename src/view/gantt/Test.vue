
<template>
  <div class="container">

    <Form inline>
      <Row>
        <FormItem inline>
          <Button type="primary" @click="modal1 = true">发起活动</Button>
          <Button>常用模板</Button>
        </FormItem>
      </Row>
      <Row>
        <FormItem label="请选择文档类型：">
          <Select v-model="select1" clearable  @on-change="selectSubEvent" style="width:200px">
            <Option v-for="item in catagoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <Upload action="//localhost:8081/upload/test"
                :data="{'taskExecId':taskExecId,'docCatagory':docCatagory}">
          <Button icon="ios-cloud-upload-outline">上传</Button>
        </Upload>
        <Button type="primary" @click="exportData()">导出</Button>
      </Row>
    </Form>
    <Modal
      v-model="modal1"
      title="新建活动"
      @on-ok="addActivity"
      width="1000">
      <Form ref="activityData" :model="activityData" :rules="ruleValidate" :label-width="80" :label-height="100">
        <Row>
          <Col span="8">
            <FormItem label="活动名称：" prop="actName">
              <Input v-model="activityData.actName" value="activityData.actName"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="活动简称：" prop="actShort">
              <Input v-model="activityData.actShort" value="activityData.actShort"></Input>
            </FormItem>
          </Col>
          <Col span ="6">
            <FormItem label="活动英文名：" prop="actName">
              <Input v-model="activityData.actEngName" value="activityData.actName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="活动所属分会：" prop="personId">
              <Cascader  v-model="activityData.ids"  trigger="hover" :data="cascaderData" change-on-select></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="选择活动负责人：" prop="personId">
              <Select v-model="activityData.personId" filterable clearable>
                <Option v-for="item in personList" :value="item.personId" :key="item.personId">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="启动日期：" prop="date">
              <DatePicker type="date"   format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期" v-model="activityData.actDateFrom"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="预计截止日期：" prop="date">
              <DatePicker type="date"   format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期" v-model="activityData.actDateTo"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="活动行业分类：" prop="industryId">
              <Select v-model="activityData.industryId" filterable clearable>
                <Option v-for="item in industryList" :value="item.industryId" :key="item.industryId">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="活动地点：" prop="actAddress">
              <Input v-model="activityData.actAddress" value="activityData.actAddress"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <Poptip word-wrap width="200" trigger="hover" content="活动优先级:1-10(低-高)">
              <FormItem label="选择活动优先级：" prop="personId">
                <Select v-model="activityData.actPriority" filterable clearable>
                  <Option v-for="item in priorityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Poptip>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="活动备注：" prop="actMemo">
              <Input type="textarea" :rows="4" v-model="activityData.actMemo" value="activityData.actMemo"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal
      v-model="modal2"
      title="新建子活动"
      @on-ok="addActSub"
      width="1000">
      <Form ref="activitySubData" :model="activitySubData" :rules="ruleValidate" :label-width="80" :label-height="100">
        <Row>
          <Col span="8">
            <FormItem label="子活动名称：" prop="actSubName">
              <Input v-model="activitySubData.actSubName" value="activitySubData.actSubName"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="子活动简称：" prop="actSubShort">
              <Input v-model="activitySubData.actSubShort" value="activitySubData.actSubShort"></Input>
            </FormItem>
          </Col>
          <Col span ="6">
            <FormItem label="子活动英文名：" prop="actSubName">
              <Input v-model="activitySubData.actSubEngName" value="activitySubData.actSubName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="子活动所属分会：" prop="personId">
              <Cascader  v-model="activitySubData.ids"  trigger="hover" :data="cascaderData" change-on-select></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Form ref="activitySubData" :model="activitySubData" :label-width="80" style="width: 950px">
            <FormItem
              v-for="(item, index) in activitySubData.personChargers"
              v-if="item.status"
              :key="index"
              :label="'负责人 ' + item.index"
              :prop="'items.' + index + '.value'"
              :rules="{required: true, message: '负责人 ' + item.index +' 职责不能为空', trigger: 'blur'}">
              <Row>
                <Col span="5">
                  <FormItem inline label="子活动负责人：" prop="personId">
                    <Select v-model="item.personId" filterable clearable>
                      <Option v-for="item1 in personList" :value="item1.personId" :key="item1.personId">{{ item1.label }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="5">
                  <FormItem inline label="是否任务编辑人：" prop="item.actSubChargerEditor">
                    <RadioGroup v-model="item.actSubChargerEditor" value="item.actSubChargerEditor">
                      <Radio label="true">是</Radio>
                      <Radio label="false">否</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col span="5">
                  <FormItem inline label="负责人排序：" prop="item.actSubChargerOrder">
                    <Select v-model="item.actSubChargerOrder" filterable clearable>
                      <Option v-for="order in orderList" :value="order.value" :key="order.value">{{ order.label }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="5">
                  <FormItem inline label="负责人职责：" prop="item.actSubChargerDuty">
                    <Input type="textarea" v-model="item.actSubChargerDuty" placeholder="负责人职责"></Input>
                  </FormItem>
                </Col>
                <Col span="4">
                  <Button @click="handleRemoveActSub(index)">删除</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Row>
                <Col span="12">
                  <Button type="dashed" long @click="handleAddActSub" icon="md-add">增加负责人</Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </Row>

        <Row>
          <Col span="8">
            <FormItem label="启动日期：" prop="date">
              <DatePicker type="date"   format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期" v-model="activitySubData.actSubDateFrom"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="预计截止日期：" prop="date">
              <DatePicker type="date"   format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期" v-model="activitySubData.actSubDateTo"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="活动行业分类：" prop="industryId">
              <Select v-model="activitySubData.industryId" filterable clearable>
                <Option v-for="item in industryList" :value="item.industryId" :key="item.industryId">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="活动地点：" prop="actSubAddress">
              <Input v-model="activitySubData.actSubAddress" value="activityData.actSubAddress"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <Poptip word-wrap width="200" trigger="hover" content="活动优先级:1-10(低-高)">
              <FormItem label="选择活动优先级：" prop="personId">
                <Select v-model="activitySubData.actSubPriority" filterable clearable>
                  <Option v-for="item in priorityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Poptip>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="活动备注：" prop="actSubMemo">
              <Input type="textarea" :rows="4" v-model="activitySubData.actSubMemo" value="activityData.actMemo"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal
      v-model="modal3"
      title="新建任务"
      @on-ok="addTask"
      width="1000">
      <Form ref="taskData" :model="taskData" :rules="ruleValidate" :label-width="80" :label-height="100">
        <Row>
          <Col span="8">
            <FormItem label="任务名：" prop="taskName">
              <Input v-model="taskData.taskName" value="activitySubData.actSubName"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="任务简称：" prop="taskShort">
              <Input v-model="taskData.taskShort" value="activitySubData.actSubShort"></Input>
            </FormItem>
          </Col>
          <Col span ="6">
            <FormItem label="任务英文名：" prop="taskEngName">
              <Input v-model="taskData.taskEngName" value="activitySubData.actSubName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
            <Form ref="taskData" :model="taskData" :label-width="80" style="width: 950px">
              <FormItem
                v-for="(item, index) in taskData.personChargers"
                v-if="item.status"
                :key="index"
                :label="'负责人 ' + item.index"
                :prop="'items.' + index + '.value'"
                :rules="{required: true, message: '负责人 ' + item.index +' 职责不能为空', trigger: 'blur'}">
                <Row>
                  <Col span="5">
                    <FormItem inline label="任务负责人：" prop="personId">
                      <Select v-model="item.personId" filterable clearable>
                        <Option v-for="item1 in personList" :value="item1.personId" :key="item1.personId">{{ item1.label }}
                        </Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem inline label="是否任务编辑人：" prop="item.taskChargerEditor">
                      <RadioGroup v-model="item.taskChargerEditor" value="item.taskChargerEditor">
                        <Radio label="true">是</Radio>
                        <Radio label="false">否</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem inline label="负责人排序：" prop="item.taskChargerOrder">
                      <Select v-model="item.taskChargerOrder" filterable clearable>
                        <Option v-for="order in orderList" :value="order.value" :key="order.value">{{ order.label }}
                        </Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem inline label="负责人职责：" prop="item.taskChargerOrder">
                      <Input type="textarea" v-model="item.taskChargerDuty" placeholder="负责人职责"></Input>
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <Button @click="handleRemoveTask(index)">删除</Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Row>
                  <Col span="12">
                    <Button type="dashed" long @click="handleAddTask" icon="md-add">增加负责人</Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="启动日期：" prop="taskDateFrom">
              <DatePicker type="date" format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期"
                          v-model="taskData.taskDateFrom"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="预计截止日期：" prop="taskDateTo">
              <DatePicker type="date" format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期"
                          v-model="taskData.taskDateTo"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <Poptip word-wrap width="200" trigger="hover" content="任务优先级:1-10(低-高)">
              <FormItem label="选择任务优先级：" prop="taskPriority">
                <Select v-model="taskData.taskPriority" filterable clearable>
                  <Option v-for="item in priorityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Poptip>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="任务备注：" prop="taskMemo">
              <Input type="textarea" :rows="4" v-model="taskData.taskMemo" value="taskData.taskMemo"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <div id="example">
      <ul class="switch-list">
        <li class="switch-item" v-for="item in propList">
          <span>{{ item.name }}: </span>
          <iSwitch v-model="props[item.value]"></iSwitch>
        </li>
      </ul>
      <zk-table
        ref="table"
        sum-text="sum"
        index-text="#"
        :data="data"
        :columns="columns"
        :border="props.border"
        :show-header="props.showHeader"
        :show-summary="props.showSummary"
        :show-row-hover="true"
        :show-index="props.showIndex"
        :tree-type="true"
        :selection-type="false"
        :is-fold="props.isFold"
        :expand-type="props.expandType"
        :empty-text="emptyText">
        <template slot="$expand" slot-scope="scope">
          {{ `活动名： ${scope.row.name},
          活动介绍： ${scope.row.introduction}.`
          }}
        </template>
        <template slot="operate" slot-scope="scope">
          <div v-if="scope.row.type !== '任务'">
            <Button @click="setIdType(scope.row.id, scope.row.type, 'addSub')" >新增子活动</Button>
            <Button @click="setIdType(scope.row.id, scope.row.type, 'addTask')">新增任务</Button>
          </div>
          <Button type="error" @click="stop(scope.row.id, scope.row.type)">停用</Button>
        </template>

        <template slot="publish" slot-scope="scope">
          <div v-if="scope.row.type !== '任务'">
            <Button type="success" @click="stop(scope.row.id, scope.row.type)">发布</Button>
          </div>
        </template>
      </zk-table>
    </div>

    <Divider size="small">甘特图</Divider>
    <RadioGroup v-model="button1" type="button" @on-change="radioSelected">
      <Radio name="1" label="日视图"></Radio>
      <Radio name="2" label="周视图"></Radio>
      <Radio name="3" label="月视图"></Radio>
    </RadioGroup>
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
import {dateFormat} from '@/libs/util'

export default {
  name: 'test',
  components: {Gantt},
  data () {
    return {

      actId: '',
      select1: '',
      catagoryList: [{
        value: '通知',
        label: '通知'
      },
      {
        value: '策划方案',
        label: '策划方案'
      },
      {
        value: '报告',
        label: '报告'
      }
      ],
      docCatagory: '未选择',
      taskExecId: '1',
      // 用于添加子活动时告诉后端父节点类型
      parentId: '',
      type: '',

      cascaderData: [],
      activityData: {
        ids: [],
        actName: '',
        actShort: '',
        personId: '',
        actEngName: '',
        industryId: '',
        actDateFrom: '',
        actDateTo: '',
        actAddress: '',
        actPriority: '',
        actMemo: ''
      },
      actSubIndex: 1,
      activitySubData: {
        ids: [],
        actSubName: '',
        actSubShort: '',
        personId: '',
        actSubEngName: '',
        industryId: '',
        actSubDateFrom: '',
        actSubDateTo: '',
        actSubAddress: '',
        actSubPriority: '',
        actSubMemo: '',
        personChargers: [
          {
            status: 1,
            index: 1,
            personId: '',
            actSubChargerOrder: '',
            actSubChargerEditor: '',
            actSubChargerDuty: ''
          }
        ]
      },

      taskIndex: 1,
      taskData: {
        actId: '',
        actSubId: '',
        taskName: '',
        taskShort: '',
        taskEngName: '',
        taskDateFrom: '',
        taskDateTo: '',
        taskPriority: '',
        taskMemo: '',
        personChargers: [
          {
            status: 1,
            index: 1,
            personId: '',
            taskChargerOrder: '',
            taskChargerEditor: '',
            taskChargerDuty: ''
          }
        ]

      },
      personList: [],
      industryList: [],
      orderList: [
        {
          value: 1,
          label: '高'
        }, {
          value: 2,
          label: '中'
        }, {
          value: 3,
          label: '低'
        }
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

      modal1: false,
      modal2: false,
      modal3: false,
      props: {
        // border: false,
        // showHeader: true,
        // showSummary: false,
        // showIndex: false,
        isFold: true
        // expandType: false,
      },
      emptyText: '暂未发起活动,已发起的活动可以在所有活动中找到',
      data: [
        // {
        //   name: '浙江工业大学运动会',
        //   charger: '陈进颖',
        //   likes: ['football', 'basketball'],
        //   startTime: 10,
        //   endTime: 10,
        //   introduction: "介绍",
        //   type: '活动',
        //   children: [
        //     {
        //       name: '计算机学院运动会',
        //       charger: '陈进颖',
        //       likes: ['football', 'basketball'],
        //       startTime: 20,
        //       endTime: 10,
        //       type: '子活动',
        //       children: [
        //         {
        //           name: '租借场地',
        //           charger: '郭威',
        //           likes: ['football', 'basketball'],
        //           startTime: 20,
        //           endTime: 10,
        //           type: '任务',
        //         },
        //         {
        //           name: '运动会项目筹划',
        //           charger: '郭威',
        //           likes: ['football', 'basketball'],
        //           startTime: 10,
        //           endTime: 10,
        //           type: '子活动',
        //           children: [
        //             {
        //               name: '拔河比赛',
        //               charger: '陈进颖',
        //               likes: ['football', 'basketball'],
        //               startTime: 20,
        //               type: '任务',
        //               endTime: 10,
        //             },
        //             {
        //               name: '田径赛事',
        //               charger: '郭威',
        //               likes: ['football', 'basketball'],
        //               startTime: 10,
        //               endTime: 10,
        //               type: '子活动',
        //               children: [
        //                 {
        //                   name: '跳高比赛',
        //                   charger: '体育老师1',
        //                   likes: ['football', 'basketball'],
        //                   startTime: 20,
        //                   type: '任务',
        //                   endTime: 10,
        //
        //                 },
        //                 {
        //                   name: '跳远比赛',
        //                   charger: '体育老师2',
        //                   likes: ['football', 'basketball'],
        //                   startTime: 10,
        //                   type: '任务',
        //                   endTime: 10,
        //
        //                 },
        //               ],
        //             },
        //           ],
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
      columns: [
        {
          label: '活动名',
          prop: 'name',
          width: '300px'
        },
        {
          label: '主要负责人',
          prop: 'charger',
          minWidth: '100px'
        },
        {
          label: '类型',
          prop: 'type',
          width: '100px'
        },
        {
          label: '开始时间',
          prop: 'startTime',
          width: '200px'

        },
        {
          label: '结束时间',
          prop: 'endTime',
          width: '200px'

        },
        {
          label: '操作',
          minWidth: '100px',
          type: 'template',
          template: 'operate'
        },
        {
          label: '是否发布',
          minWidth: '100px',
          type: 'template',
          template: 'publish'
        }
      ],

      button1: '周视图',
      tasks: {
        data: [],
        links: [],
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
      selectedTask: null,
      messages: []
    }
  },
  computed: {
    propList () {
      return Object.keys(this.props).map(item => ({
        name: this.getName(item),
        value: item
      }))
    }
  },
  filters: {
    toPercent (val) {
      if (!val) return '0'
      return Math.round((+val) * 100)
    },
    niceDate (obj) {
      return `${obj.getFullYear()} / ${obj.getMonth() + 1} / ${obj.getDate()}`
    }
  },

  created () {
    this.fetchData(window.localStorage.getItem('personId'))
  },
  methods: {
    handleAddActSub () {
      this.actSubIndex++
      this.activitySubData.personChargers.push({
        status: 1,
        index: this.actSubIndex,
        personId: '',
        actSubChargerOrder: '',
        actSubChargerEditor: '',
        actSubChargerDuty: ''
      })
    },

    handleAddTask () {
      this.taskIndex++
      this.taskData.personChargers.push({
        status: 1,
        index: this.taskIndex,
        personId: '',
        taskChargerOrder: '',
        taskChargerEditor: '',
        taskChargerDuty: ''
      })
    },
    handleRemoveTask (index) {
      this.taskData.personChargers[index].status = 0
      // 目前4最小
      this.taskData.personChargers[index].taskChargerDuty = 4
    },
    handleRemoveActSub (index) {
      this.activitySubData.personChargers[index].status = 0
      this.activitySubData.personChargers[index].actSubChargerDuty = 4
    },

    selectSubEvent: function (value) {
      this.docCatagory = value
    },
    exportData: function () {
      let url = `//localhost:8081/upload/download?taskExecId=${this.taskExecId}`
      window.open(url)
    },
    getName (item) {
      switch (item) {
        case 'border':
          return '展示边界'
        case 'isFold':
          return '是否展开'
        case 'showHeader':
          return '展示表头'
        case 'expandType':
          return '展示介绍'
        case 'showSummary':
          return '展示总和'
        case 'showIndex':
          return '展示序号'
        default :
          return '未设置'
      }
    },
    addActivity () {
      let that = this
      let instance = this.$ajax.create({
        // 用来将token放到header上
        headers: {'token': window.localStorage.getItem('token')}
      })
      instance.post(that.GLOBAL.serverPath + '/activity/addActivity', {
        actName: that.activityData.actName,
        actShort: that.activityData.actShort,
        personId: that.activityData.personId,
        actEngName: that.activityData.actEngName,
        actAddress: that.activityData.actAddress,
        actMemo: that.activityData.actMemo,
        actPriority: that.activityData.actPriority,
        actDateFrom: that.activityData.actDateFrom,
        actDateTo: that.activityData.actDateTo,
        industryId: that.activityData.industryId,
        ids: that.activityData.ids
      }).then(function (response) {
        if (response.data.success) {
          let obj = {}
          obj.name = that.activityData.actName
          that.personList.forEach((person) => {
            if (that.activityData.personId === person.personId) {
              obj.charger = person.label
            }
          })
          that.priorityList.forEach((priority) => {
            if (that.activityData.actPriority === priority.value) {
              obj.priority = priority.label
            }
          })
          obj.id = response.data.data.actId
          obj.startTime = dateFormat(new Date(that.activityData.actDateFrom.getTime()), 'yyyy-MM-dd')
          obj.endTime = dateFormat(new Date(that.activityData.actDateTo.getTime()), 'yyyy-MM-dd')
          obj.introduction = '介绍'
          obj.type = '活动'
          obj.children = []
          that.data.push(obj)
          let dataAdd = {
            id: obj.id,
            text: that.activityData.actName,
            users: obj.charger,
            start_date: obj.startTime,
            duration: (that.activityData.actDateTo.getTime() - that.activityData.actDateFrom.getTime()) / 86400000,
            progress: 0,
            person_id: that.activityData.personId,
            act_type: '活动',
            priority: that.activityData.actPriority,
            priorityName: obj.priority,
            act_short: that.activityData.actShort,
            act_eng_name: that.activityData.actEngName,
            act_address: that.activityData.actAddress,
            act_memo: that.activityData.actMemo,
            act_status_id: ''
          }
          that.$refs.gantt.addActivityTask(dataAdd)
          // 当活动创建成功后设置全局活动id 用于新增任务时的入参
          that.actId = obj.id
        } else {
          alert(response.data.errMsg)
        }
      })
        .catch(function (error) {
          console.log(error)
          alert('服务器开小差啦～～ \n' + error.message)
        })
    },
    setIdType (id, type, judge) {
      this.parentId = id
      this.type = type
      if (judge === 'addSub') {
        this.modal2 = true
      } else if (judge === 'addTask') {
        this.modal3 = true
      }
    },
    getFilterArr (arr, id, type) {
      let that = this
      return arr.filter(function (item, i) {
        if (item.children) {
          item.children = that.getFilterArr(item.children, id, type)
        }
        if (item.id === id && item.type === type) {
          return false
        } else {
          return true
        }
      })
    },

    deleteTask (data, id, type) {
      this.data = this.getFilterArr(data, id, type)
    },
    stop (id, type) {
      this.$Modal.confirm({
        title: '确认删除？',
        content: '<p>删除该活动将删除该活动下的子活动和任务</p>',
        onOk: () => {
          let that = this
          let instance = this.$ajax.create({
            // 用来将token放到header上
            headers: {'token': window.localStorage.getItem('token')}
          })
          switch (type) {
            case '活动' :
              instance.get(that.GLOBAL.serverPath + '/activity/deleteActivity?actId=' + id)
                .then(function (res) {
                  if (res.data.success) {
                    that.deleteTask(that.data, id, type)
                    alert(id + type + '停用成功！')
                  }
                }).catch(error => {
                  alert('服务器出小差啦～～')
                })
              break
            case '子活动' :
              instance.get(that.GLOBAL.serverPath + '/activity/deleteActivitySub?actSubId=' + id)
                .then(function (res) {
                  if (res.data.success) {
                    that.deleteTask(that.data, id, type)
                    alert(id + type + '停用成功！')
                  }
                }).catch(error => {
                  alert('服务器出小差啦～～')
                })
              break
            case '任务' :
              instance.get(that.GLOBAL.serverPath + '/task/deleteTask?taskId=' + id)
                .then(function (res) {
                  if (res.data.success) {
                    that.deleteTask(that.data, id, type)
                    alert(id + type + '停用成功！')
                  }
                }).catch(error => {
                  alert('服务器出小差啦～～')
                })
              break
          }
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    },

    // 排序函数
    compActSub (a, b) {
      return a.actSubChargerOrder - b.actSubChargerOrder
    },

    compTask (a, b) {
      return a.taskChargerOrder - b.taskChargerOrder
    },

    addActSub () {
      let that = this
      let instance = this.$ajax.create({
        // 用来将token放到header上
        headers: {'token': window.localStorage.getItem('token')}
      })
      instance.post(that.GLOBAL.serverPath + '/activity/addSubActivity', {
        actId: that.actId,
        parentId: that.parentId,
        actSubName: that.activitySubData.actSubName,
        actSubShort: that.activitySubData.actSubShort,
        personChargers: that.activitySubData.personChargers,
        parentType: that.type,
        actSubEngName: that.activitySubData.actSubEngName,
        actSubAddress: that.activitySubData.actSubAddress,
        actSubMemo: that.activitySubData.actSubMemo,
        actSubPriority: that.activitySubData.actSubPriority,
        actSubDateFrom: that.activitySubData.actSubDateFrom,
        actSubDateTo: that.activitySubData.actSubDateTo,
        industryId: that.activitySubData.industryId,
        ids: that.activitySubData.ids
      }).then(function (response) {
        if (response.data.success) {
          that.data = that.setActSub(that.data, that.parentId, that.type, response.data.data.actSubId)
          let charger = ''
          let personId = ''
          let prio = ''
          let duty = ''
          that.personList.forEach((person) => {
            let sortedList = that.activitySubData.personChargers.filter(that.filterMethod).sort(that.compActSub)
            if (sortedList[0].personId === person.personId) {
              personId = sortedList[0].personId
              charger = person.label
              duty = sortedList[0].actSubChargerDuty
            }
          })

          that.priorityList.forEach((priority) => {
            if (that.activityData.actPriority === priority.value) {
              prio = priority.label
            }
          })
          let dataAdd = {
            id: response.data.data.actSubId,
            parent: that.parentId,
            text: that.activitySubData.actSubName,
            users: charger,
            duty: duty,
            start_date: dateFormat(new Date(that.activitySubData.actSubDateFrom.getTime()), 'yyyy-MM-dd'),
            duration: (that.activitySubData.actSubDateTo.getTime() - that.activitySubData.actSubDateFrom.getTime()) / 86400000,
            progress: 0,
            person_id: personId,
            act_type: '子活动',
            priority: that.activityData.actPriority,
            priorityName: prio,
            act_short: that.activitySubData.actSubShort,
            act_eng_name: that.activitySubData.actSubEngName,
            act_address: that.activitySubData.actSubAddress,
            act_memo: that.activitySubData.actSubMemo,
            act_status_id: ''
          }
          that.$refs.gantt.addSubActivityTask(dataAdd)
        } else {
          alert(response.data.errMsg)
        }
      })
        .catch(function (error) {
          console.log(error)
          alert('服务器开小差啦～～ \n' + error.message)
        })
    },
    filterMethod: function (e) {
      return e.status == 1
    },
    setActSub (data, parentId, type, id) {
      let that = this
      let result = data;
      (function traverse (node) {
        node.forEach(i => {
          if (i.id === parentId && i.type === type) {
            let obj = {}
            obj.name = that.activitySubData.actSubName
            let sortedList = that.activitySubData.personChargers.filter(that.filterMethod).sort(that.compActSub)
            that.personList.forEach((person) => {
              if (person.personId === sortedList[0].personId) {
                obj.charger = person.label
              }
            })
            obj.id = id
            obj.startTime = dateFormat(new Date(that.activitySubData.actSubDateFrom.getTime()), 'yyyy-MM-dd')
            obj.endTime = dateFormat(new Date(that.activitySubData.actSubDateTo.getTime()), 'yyyy-MM-dd')
            obj.introduction = '介绍'
            obj.type = '子活动'
            obj.children = []
            i.children.push(obj)
          }
          // 有子数据的先遍历子数据
          i.children && traverse(i.children)
        })
      })(data)
      return result
    },

    addTask () {
      let that = this
      let instance = this.$ajax.create({
        // 用来将token放到header上
        headers: {'token': window.localStorage.getItem('token')}
      })
      instance.post(that.GLOBAL.serverPath + '/task/addTask', {
        actId: that.actId,
        parentId: that.parentId,
        taskName: that.taskData.taskName,
        taskShort: that.taskData.taskShort,
        personChargers: that.taskData.personChargers,
        parentType: that.type,
        taskEngName: that.taskData.taskEngName,
        taskMemo: that.taskData.taskMemo,
        taskPriority: that.taskData.taskPriority,
        taskDateFrom: that.taskData.taskDateFrom,
        taskDateTo: that.taskData.taskDateTo
      }).then(function (response) {
        if (response.data.success) {
          that.data = that.setTask(that.data, that.parentId, that.type, response.data.data.taskId)
          let charger = ''
          let personId = ''
          let prio = ''
          let duty = ''

          that.personList.forEach((person) => {
            let sortedList = that.taskData.personChargers.filter(that.filterMethod).sort(that.compTask)
            if (sortedList[0].personId === person.personId) {
              personId = sortedList[0].personId
              charger = person.label
              duty = sortedList[0].taskChargerDuty
            }
          })
          that.priorityList.forEach((priority) => {
            if (that.activityData.actPriority === priority.value) {
              prio = priority.label
            }
          })
          let dataAdd = {
            id: response.data.data.taskId,
            parent: that.parentId,
            text: that.taskData.taskName,
            users: charger,
            duty: duty,
            start_date: dateFormat(new Date(that.taskData.taskDateFrom.getTime()), 'yyyy-MM-dd'),
            duration: (that.taskData.taskDateTo.getTime() - that.taskData.taskDateFrom.getTime()) / 86400000,
            progress: 0,
            act_type: '任务',
            person_id: personId,
            priority: that.activityData.actPriority,
            priorityName: prio,
            act_short: that.taskData.taskShort,
            act_eng_name: that.taskData.taskEngName,
            act_memo: that.taskData.taskMemo,
            act_status_id: ''}
          that.$refs.gantt.addSubActivityTask(dataAdd)
        } else {
          alert(response.data.errMsg)
        }
      })
        .catch(function (error) {
          console.log(error)
          alert('服务器开小差啦～～ \n' + error.message)
        })
    },

    setTask (data, parentId, type, id) {
      let that = this
      let result = data;
      (function traverse (node) {
        node.forEach(i => {
          if (i.id === parentId && i.type === type) {
            let obj = {}
            obj.name = that.taskData.taskName
            that.personList.forEach((person) => {
              let sortedList = that.taskData.personChargers.filter(that.filterMethod).sort(that.compTask)
              if (sortedList[0].personId === person.personId) {
                obj.charger = person.label
              }
            })
            obj.id = id
            obj.startTime = dateFormat(new Date(that.taskData.taskDateFrom.getTime()), 'yyyy-MM-dd')
            obj.endTime = dateFormat(new Date(that.taskData.taskDateTo.getTime()), 'yyyy-MM-dd')
            obj.introduction = '介绍'
            obj.type = '任务'
            i.children.push(obj)
          }
          // 有子数据的先遍历子数据
          i.children && traverse(i.children)
        })
      })(data)
      return result
    },
    change (status) {
      this.$Message.info('开关状态：' + status)
    },
    fetchData (personId) {
      var that = this
      let instance = this.$ajax.create({
        // 用来将token放到header上
        headers: {'token': window.localStorage.getItem('token')}
      })

      // 获取会员所属学会信息
      instance.get(that.GLOBAL.serverPath + '/common/getInstByPersonId?personId=' + personId)
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
              that.personList.push(person)
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
    radioSelected: function (name) {
      this.$refs.gantt.viewChanged(name)
    },
    selectTask (task) {
      this.selectedTask = task
    },
    addMessage (message) {
      this.messages.unshift(message)
      if (this.messages.length > 40) {
        this.messages.pop()
      }
    },
    // 记录对任务的修改记录
    logTaskUpdate (id, mode, task) {
      let operate = ''
      switch (mode) {
        case 'updated':
          operate = '更新'
          break
        case 'deleted':
          operate = '删除'
          break
        case 'inserted':
          operate = '新增'
          break
        default :
          operate = '更新'
      }
      let text = (task && task.text ? ` (${task.text})` : '')
      let message = `${operate}活动 :  ${text}`
      this.addMessage(message)
    },
    // 记录对连接箭头的修改记录
    logLinkUpdate (id, mode, link) {
      let message = `Link ${mode}: ${id}`
      if (link) {
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
