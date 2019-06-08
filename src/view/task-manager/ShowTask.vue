<template>
  <div class="container">
    <Form ref="formInline" :model="formInline" inline>

      <FormItem prop="borrowRecord">
        <Input type="text" v-model="formInline.taskName" placeholder="任务名称">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">查找</Button>
      </FormItem>

    </Form>
    <Table border :columns="columns" :data="taskData">
    </Table>
    <Page :total="total" :page-size="10" @on-change="changePage"></Page>



    <Modal v-model="modalForAdd"
           title="新建任务执行阶段"
           @on-ok="addTaskExec"
           width="1000">
      <Form ref="taskExec" :model="taskExec" :rules="ruleValidate" :label-width="80" :label-height="100">
        <Row>
          <Col span="8">
            <FormItem label="执行阶段名称：" prop="taskExecName">
              <Input v-model="taskExec.taskExecName" value="taskExec.taskExecName"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="执行阶段报告：" prop="taskExecReport">
              <Input v-model="taskExec.taskExecReport" type="textarea" :rows="4" value="taskExec.taskExecReport"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="执行阶段状态：" prop="taskExecStatus">
              <Select v-model="taskExec.taskExecStatus" style="width:200px">
                <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="执行阶段日期：" prop="taskExecDate">
              <DatePicker type="date" format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期"
                          v-model="taskExec.taskExecDate"></DatePicker>
            </FormItem>
          </Col>

        </Row>
      </Form>
    </Modal>


    <Modal v-model="modalForEdit"
           title="修改任务信息"
           @on-ok="modifyTask"
           width="1000">
      <Form ref="taskModifyData" :model="taskModifyData" :rules="ruleValidate" :label-width="80" :label-height="100">
        <Row>
          <Col span="8">
            <FormItem label="任务名称：" prop="taskName">
              <Input v-model="taskModifyData.taskName" value="taskExec.taskName"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="任务备注：" prop="taskMemo">
              <Input v-model="taskModifyData.taskMemo" type="textarea" :rows="4" value="taskExec.taskMemo"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="任务当前状态：" prop="taskStatusId">
              <Select v-model="taskModifyData.taskStatusId" style="width:200px">
                <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="任务结束日期：" prop="taskDateTo">
              <DatePicker type="date" format="yyyy年M月d日" value="yyyy-MM-dd" placeholder="选择日期"
                          v-model="taskModifyData.taskDateTo"></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal v-model="modalForUpload"
           title="上传文件"
           @on-ok="upload"
           width="1000">
      <Form inline>
        <Row>
          <FormItem label="请选择文档类型：">
            <Select v-model="select1" clearable @on-change="selectSubEvent" style="width:200px">
              <Option v-for="item in catagoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <RadioGroup v-model="discover">
              <Radio label="true">
                <Icon type="logo-apple"></Icon>
                <span>覆盖原版本</span>
              </Radio>
              <Radio label="false">
                <Icon type="logo-android"></Icon>
                <span>不覆盖原版本</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <Upload
            multiple
            type="drag"
            action="//localhost:8081/upload/test"
            :data="{'taskExecId':globalTaskExecId,'docCatagory':docCatagory, 'personId':personId, 'discover':discover}">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击上传或将文件拖到这里</p>
            </div>
          </Upload>
        </Row>
      </Form>
    </Modal>

    <div>
      <Drawer title="执行阶段信息" :closable="false" width="640" v-model="value1" >
        <div>
          <Collapse v-model="showPanel" accordion>
            <Panel v-for='(list, index) in taskExecList'  v-bind:key='list.id' >
              {{list.taskExecName}}
              <div slot="content">
                <h6 :style="pStyle">执行阶段id：{{list.taskExecId}} <Button type="success" shape="circle" :style="myStyle" @click="showUploadModal(list)">上传</Button>
                  <Divider type="vertical"/><Button type="info" shape="circle" :style="bStyle" @click="showDownloadModal(list)">查看</Button></h6>
                <Divider />
                <h6 :style="pStyle">
                  执行阶段汇报：{{list.taskExecReport}}
                  <Button type="primary" shape="circle" :style="bStyle" @click="addReport(list)">填写汇报</Button>
                </h6>
                <h6 :style="pStyle">
                  执行阶段反馈：{{list.taskExecMonitor}}
                  <Button type="primary" shape="circle" :style="bStyle" @click="addFeedback(list)">填写反馈</Button>
                </h6>
                <Divider/>
                <h6 :style="pStyle">
                  日期：
                  <DatePicker type="date" confirm placement="bottom-end" format="yyyy年M月d日" value="yyyy-MM-dd"
                              v-model="list.taskExecDate"></DatePicker>
                </h6>
                <h6 :style="pStyle">
                  <Progress :percent="list.taskExecRate" status="active" />
                  <ButtonGroup size="large">
                    <Button icon="ios-add" @click="addProgress(list)"></Button>
                    <Button icon="ios-remove" @click="minusProgress(list)"></Button>
                  </ButtonGroup>
                </h6>
                <h6 :style="pStyle">当前状态：{{list.taskExecStatusName}} 修改为->
                  <Select v-model="list.taskExecStatus" style="width:200px">
                    <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <Button type="primary" shape="circle" :style="bStyle" @click="modifyExec(list)">修改</Button>
                </h6><Divider />
              </div>
            </Panel>
          </Collapse>
        </div>
      </Drawer>
    </div>

    <Modal v-model="modalForDownload"
           title="上传记录"
           draggable="true"
           width="1000">
      <Collapse v-model="showPanel3" accordion>
        <Panel v-for='(list, index) in documentList'  v-bind:key='list.documentId' >
          {{list.docName}} <Divider type="vertical"/>版本号：第{{list.version}}版本
          <div slot="content">
            <h6 :style="pStyle">文件id：{{list.documentId}}<Divider type="vertical"/> 文件名：{{list.docName}}
              <Button type="primary" shape="circle" :style="bStyle" @click="exportnpmData(list)">下载</Button></h6><Divider />
            <h6 :style="pStyle">上传者：{{list.personName}} <Divider type="vertical"/>上传时间：{{list.modifyDate}}</h6>
            <h6 :style="pStyle">版本号：第{{list.version}}版本 <Divider type="vertical"/>文件类型：{{list.docCatagory}}</h6>
          </div>
        </Panel>
      </Collapse>
    </Modal>

    <div>
      <Drawer title="检查点信息" :closable="false" width="640" v-model="value2" >
        <div>
          <Collapse v-model="showPanel2" accordion>
            <Panel v-for='(list, index) in taskCheckPointLists'  v-bind:key='list.id' >
              {{list.taskCheckPointName}}
              <div slot="content">
                <h6 :style="pStyle">检查点id：{{list.id}}</h6><Divider />
                <h6 :style="pStyle">检查点备注：{{list.taskCheckPointMemo}}</h6>
                <h6 :style="pStyle">检查点时间：{{list.taskCheckPointDate}} </h6>
              </div>
            </Panel>
          </Collapse>
        </div>
      </Drawer>
    </div>
  </div>
</template>
<script>
  import axios from '@/libs/api.request'
  import Role from "../system/role";

  export default {
    name: 'AllInstitute',
    components: {Role},
    data () {
      return {
        value1: false,
        value2: false,
        modalForEdit: false,

        modalForAdd: false,
        modalForUpload: false,
        modalForDownload: false,
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
        personId: window.localStorage.getItem("personId"),
        globalTaskId: '',
        globalTaskExecId: '',
        taskExec: {
          taskExecName: '',
          taskExecStatus: '',
          taskExecReport: '',
          taskExecRate: 0,
          taskExecDate: ''
        },
        showPanel: '0',
        showPanel2: '0',
        showPanel3: '0',
        lists: [],
        taskCheckPointLists: [],
        documentList: [],
        pStyle: {
          fontSize: '16px',
          color: 'rgba(0,0,0,0.85)',
          lineHeight: '24px',
          display: 'block',
          marginBottom: '16px'
        },
        bStyle: {
          position: 'absolute',
          right: '16px',
        },
        myStyle: {
          position: 'absolute',
          right: '66px',
        },
        modal1: false,
        total: '',
        condi: '',
        currIndex: 0,
        discover: false,

        publishList: [
          {
            value: 1,
            label: '已发布'
          },
          {
            value: 0,
            label: '未发布'
          }
        ],
        taskStatusList:[
          {
            value: 1,
            label: '筹备'
          },
          {
            value: 2,
            label: '启动'
          },{
            value: 3,
            label: '前期'
          },{
            value: 4,
            label: '过半'
          },{
            value: 5,
            label: '后期'
          },{
            value: 6,
            label: '扫尾'
          },{
            value: 7,
            label: '结项'
          },{
            value: 8,
            label: '完成'
          },{
            value: 9,
            label: '关闭'
          },{
            value: 10,
            label: '重启'
          }
        ],
        formInline: {
          actName: '',
          taskName: '',
          ids: [],
          publish: '',
          actStatusId: ''
        },
        cascaderData: [],
        columns: [
          {
            title: '任务代号',
            key: 'taskId'
          },
          {
            title: '任务名称',
            key: 'taskName'
          },
          {
            title: '活动名称',
            key: 'actName'
          },
          {
            title: '任务负责人',
            key: 'personName'
          },
          {
            title: '负责人职责',
            key: 'duty'
          },
          {
            title: '任务发起日期',
            key: 'taskDateFrom'
          },
          {
            title: '任务结束日期',
            key: 'taskDateTo'
          },
          {
            title: '任务当前状态',
            key: 'taskStatusName'
          },
          {
            title: '任务备注',
            key: 'taskMemo'
          },
          {
            title: '任务优先级',
            key: 'priorityName'
          },
          {
            title: '任务检查点',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: "ios-paper"
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showCheckPoint(params.index)
                    }
                  }
                }, '查看')
              ])
            }
          },
          {
            title: '任务执行阶段',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: "ios-paper"
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showTaskExec(params.index)
                    }
                  }
                }, '查看')
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              let btns = []
              params.row.editable && btns.push(
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: "ios-pricetag"
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.setId(params.index, 'edit')
                    }
                  }
                }, '编辑')
              )
              return h("div",btns)
            }
          }
        ],
        taskData: [],
        taskModifyData: {
          taskDateTo: "",
          taskId: '',
          taskMemo: "",
          taskName: "",
          taskStatusId: ''
        },
        dataFromInterface: [],
        taskExecList: [],

      }
    },
    mounted () {
      this.request(1)
      this.fetchList();
    },
    methods: {
      selectSubEvent: function (value) {
        this.docCatagory = value
      },
      showUploadModal(list) {
        this.globalTaskExecId = list.taskExecId
        this.modalForUpload = true

      },
      showDownloadModal(list) {
        let that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })
        instance.get(that.GLOBAL.serverPath + '/upload/getDocuments?taskExecId=' + list.taskExecId)
          .then( res => {
            if (res.data.success) {
              that.documentList = res.data.data;
              that.modalForDownload = true
            } else {
              alert("服务器开下差啦～");
            }
          }).catch(e => {
          alert("系统异常！")
        })
      },
      exportData: function (list) {
        let url = `//localhost:8081/upload/download?documentId=${list.documentId}`
        window.open(url)
      },
      addProgress (list) {
        if (list.taskExecRate >= 100) {
          return false;
        }
        list.taskExecRate += 10;
      },
      minusProgress (list) {
        if (list.taskExecRate <= 0) {
          return false;
        }
        list.taskExecRate -= 10;
      },
      addReport(list) {
        let that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })
        let temp = '';
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: list.taskExecReport,
                placeholder: '填写或修改汇报'
              },
              on: {
                input: (val) => {
                  temp = val;
                }
              },
            })
          },
          onOk: () => {
            instance.post(that.GLOBAL.serverPath + "/task/modifyTaskExec", {
              taskExecId: list.taskExecId,
              taskExecName: list.taskExecName,
              taskExecStatus: list.taskExecStatus,
              taskExecReport: temp,
              taskExecMonitor: list.taskExecMonitor,
              taskExecRate: list.taskExecRate,
              taskExecDate:list.taskExecDate,
            }).then(res => {
              if (res.data.success) {
                list.taskExecReport = temp;
                alert("新增汇报成功！");
              } else {
                alert("服务器出小差拉～～")
              }
            }).catch(error => {
              alert("系统出故障拉！～～")
            });
            this.$Message.info('Clicked ok');
          },
          onCancel: () => {
            temp = '';
            this.$Message.info('Clicked cancel');
          }
        });
      },
      modifyTask() {
        let that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })
        instance.post(that.GLOBAL.serverPath + "/task/modifyTask", {
          taskName: that.taskModifyData.taskName,
          taskId: that.taskModifyData.taskId,
          taskMemo: that.taskModifyData.taskMemo,
          taskPriority: that.taskModifyData.taskPriority,
          taskDateTo: that.taskModifyData.taskDateTo,
        }).then(res => {
          if (res.data.success) {
            alert("修改成功！");
          } else {
            alert("服务器出小差拉～～")
          }
        }).catch(error => {
          alert("系统出故障拉！～～")
        });
      },
      modifyExec(list) {
        let that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })
        instance.post(that.GLOBAL.serverPath + "/task/modifyTaskExec", {
          taskExecId: list.taskExecId,
          taskExecName: list.taskExecName,
          taskExecStatus: list.taskExecStatus,
          taskExecReport: list.taskExecReport,
          taskExecMonitor: list.taskExecMonitor,
          taskExecRate: list.taskExecRate,
          taskExecDate:list.taskExecDate,
        }).then(res => {
          if (res.data.success) {
            alert("修改成功！");
          } else {
            alert("服务器出小差拉～～")
          }
        }).catch(error => {
          alert("系统出故障拉！～～")
        });
      },
      addFeedback(list) {
        let that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })
        let temp = '';
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: list.taskExecMonitor,
                placeholder: '填写或修改检查反馈'
              },
              on: {
                input: (val) => {
                  temp = val;
                }
              },

            })
          },
          onOk: () => {
            instance.post(that.GLOBAL.serverPath + "/task/modifyTaskExec", {
              taskExecId: list.taskExecId,
              taskExecName: list.taskExecName,
              taskExecStatus: list.taskExecStatus,
              taskExecReport: list.taskExecReport,
              taskExecMonitor: temp,
              taskExecRate: list.taskExecRate,
              taskExecDate:list.taskExecDate,
            }).then(res => {
              if (res.data.success) {
                list.taskExecMonitor = temp;
                alert("新增反馈成功！");
              } else {
                alert("服务器出小差拉～～")
              }
            }).catch(error => {
              alert("系统出故障拉！～～")
            });
            this.$Message.info('Clicked ok');
          },
          onCancel: () => {
            temp = '';
            this.$Message.info('Clicked cancel');
          }
        });
      },



      ok () {
        this.$Message.info('Clicked ok')
      },
      cancel () {
        this.$Message.info('Clicked cancel')
      },
      dateFormat (timestamp, format) {
        var date = {
          'M+': timestamp.getMonth() + 1,
          'd+': timestamp.getDate(),
          'h+': timestamp.getHours(),
          'm+': timestamp.getMinutes(),
          's+': timestamp.getSeconds(),
          'q+': Math.floor((timestamp.getMonth() + 3) / 3),
          'S+': timestamp.getMilliseconds()
        }

        if (/(y+)/i.test(format)) {
          format = format.replace(RegExp.$1, (timestamp.getFullYear() + '').substr(4 - RegExp.$1.length))
        }

        for (var k in date) {
          if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
          }
        }

        return format
      },
      quickFilter(name) {
        switch (name) {
          case "editable":
            this.request(1, window.localStorage.getItem('personId'))
            break;
          case "priority":
            this.request(1, null, true)
            break;
        }
      },
      handleSubmit (account) {
        this.request(1)
      },
      test (key) {
        alert(key)
      },
      show (index) {
        this.$router.push({
          name: 'new-show',
          params: {actId: this.taskData[index].actId}
        })
      },
      showCheckPoint(index) {
        this.taskCheckPointLists = [];
        var that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })
        instance.get(that.GLOBAL.serverPath + "/task/getTaskCheckPoint?taskId=" + that.taskData[index].taskId)
          .then(res => {
            if (res.data.success) {
              let results = res.data.data
              results.forEach( result => {
                let obj = {};
                obj.id = result.taskCheckPointId;
                obj.taskCheckPointName = result.taskCheckPointName;
                obj.taskCheckPointMemo = result.taskCheckPointMemo;
                obj.taskCheckPointDate = that.dateFormat(new Date(result.taskCheckPointDate * 1000), 'yyyy-MM-dd')
                that.taskCheckPointLists.push(obj);
              })
              that.showPanel2 = '' // 把showPanel原来的值去掉
              setTimeout(() => {
                this.showPanel2 = '1' // 如果上面没有把showPanel的值改掉，此处取值和原来的showPanel一样，那么也不会生效。
              }, 0)
              if (that.taskCheckPointLists.length === 0) {
                that.value2 = false
                that.$Message.info('暂无任务检查点')
              } else {
                that.value2 = true
              }
            } else {
              alert('服务器开小差啦～～ \n' + error.message)
            }
          }).catch(error => {
          console.log(error)
          alert('系统异常～～ \n' + error.message)
        })
      },
      showTaskExec(index) {
        this.taskExecList = [];
        let that = this
        let instance = this.$ajax.create({
          headers:{
            'token': window.localStorage.getItem('token')
          }
        })
        instance.get(that.GLOBAL.serverPath + "/task/getTaskExec?taskId=" + that.taskData[index].taskId)
          .then(res => {
            if (res.data.success) {
              let results = res.data.data
              results.forEach( result => {
                let obj = {};
                obj.taskExecId = result.taskExecId;
                obj.taskExecName = result.taskExecName;
                obj.taskId = result.taskId;
                obj.taskExecStatusName = result.taskExecStatusName;
                obj.taskExecDate = result.taskExecDate;
                obj.taskExecReport = result.taskExecReport;
                obj.taskExecRate = result.taskExecRate;
                obj.taskExecMonitor = result.taskExecMonitor
                that.taskExecList.push(obj);
              })
              that.showPanel = '' // 把showPanel原来的值去掉
              setTimeout(() => {
                this.showPanel = '1' // 如果上面没有把showPanel的值改掉，此处取值和原来的showPanel一样，那么也不会生效。
              }, 0)
              if (that.taskExecList.length === 0) {
                that.value1 = false
                that.$Message.info('暂无任务执行阶段')
              } else {
                that.value1 = true
              }
            } else {
              alert('服务器开小差啦～～ \n' + error.message)
            }
          }).catch(error => {
          console.log(error)
          alert('系统异常～～ \n' + error.message)
        })
      },
      setId(index, tag) {
        let that = this
        if (tag === 'add') {
          that.modalForAdd = true;
          that.globalTaskId = that.taskData[index].taskId
        } else if (tag === 'edit') {
          that.modalForEdit = true;
          that.taskModifyData = that.taskData[index];
        }

      },
      addTaskExec() {
        var that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })

        instance.post(that.GLOBAL.serverPath + '/task/addTaskExec', {
          taskId: that.globalTaskId,
          taskExecName: that.taskExec.taskExecName,
          taskExecStatus: that.taskExec.taskExecStatus,
          taskExecReport: that.taskExec.taskExecReport,
          taskExecRate: that.taskExec.taskExecRate,
          taskExecDate: that.taskExec.taskExecDate
        })
          .then(function (response) {
            if (response.data.success) {
              alert("增加任务执行阶段成功！");
            } else {
              alert(response.data.errMsg)
            }
          })
          .catch(function (error) {
            console.log(error)
            alert('服务器开小差啦～～ \n' + error.message)
          })
      },
      fetchList() {
        var that = this
        let instance = this.$ajax.create({
          // 用来将token放到header上
          headers: {'token': window.localStorage.getItem('token')}
        })

        // 获取会员所属学会信息
        instance.get(that.GLOBAL.serverPath + '/common/getInstByPersonId?personId=' + window.localStorage.getItem('personId'))
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
      },
      request (currentPage, personId, sortByPriority, stop) {
        var that = this

        axios.request({
          url: '/task/getAllTask',
          method: 'post',
          data: {
            page: currentPage,
            taskName: that.formInline.taskName != '' ? that.formInline.taskName : null
          }
        }).then(function (res) {
          if (res.data.success) {
            that.total = res.data.data.total
            that.dataFromInterface = res.data.data.items
            that.taskData = []
            that.dataFromInterface.forEach((data) => {
              let obj = {}

              obj.taskId = data.taskId
              obj.actId = data.actId
              obj.taskName = data.taskName
              obj.taskShort = data.taskShort
              obj.taskEngName = data.taskEngName
              obj.taskDateFrom = data.taskDateFrom
              obj.taskDateTo = data.taskDateTo
              obj.taskPriority = data.taskPriority
              obj.taskStatusId = data.taskStatusId
              obj.taskMemo = data.taskMemo
              obj.stop = data.stop
              obj.personName = data.personName
              obj.taskStatusName = data.taskStatusName
              obj.duty = data.duty
              obj.priorityName = data.priorityName
              obj.actName = data.actName
              obj.editable = data.editable;

              that.taskData.push(obj)
            })
          } else {
            alert(response.data.errMsg)
          }
        }).catch(function (error) {
          that.$Message.error('服务器出小差了')
        })
      },
      changePage: function (page) {
        this.request(page)
      }
    }
  }
</script>

<style>
  .container {
    height: 600px;
    width: 100%;
  }
  .demo-drawer-profile{
    font-size: 14px;
  }
  .demo-drawer-profile .ivu-col{
    margin-bottom: 12px;
  }
</style>
