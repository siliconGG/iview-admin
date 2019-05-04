<template>
  <div>
    <Button @click="value1 = true" type="success">新增</Button>
    <Drawer
      :title="drawTitle"
      v-model="value1"
      width="600"
      :mask-closable="false"
      :styles="styles"
    >
      <Form ref="union" :model="union">
        <FormItem label="名称" prop="unionName">
          <Input v-model="union.unionName" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="简称" prop="unionShort">
          <Input v-model="union.unionShort" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="英文名" prop="unionEngName">
          <Input v-model="union.unionEngName" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="地址" prop="unionAddress">
          <Input v-model="union.unionAddress" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="网址" prop="unionWebsite">
          <Input v-model="union.unionWebsite" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="微信公众号" prop="unionWechat">
          <Input v-model="union.unionWechat" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="QQ群" prop="unionQq">
          <Input v-model="union.unionQq" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="其他联系方式" prop="unionOthers">
          <Input v-model="union.unionOthers" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="成立时间" prop="registerTime">
          <Row>
            <Col span="11">
              <DatePicker type="date" placeholder="Select date" v-model="union.registerTime"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="简介" prop="unionIntroduction">
          <Input v-model="union.unionIntroduction" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="备注" prop="unionMemo">
          <Input v-model="union.unionMemo" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="Enter something..."></Input>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="cancel('union')">取消</Button>
        <Button type="primary" @click="postUnion('union')">提交</Button>
      </div>
    </Drawer>
    <br>
    <div v-for="unionInfo in unionList">
      <card>
        <p slot="title">{{unionInfo.unionName}}</p>
        <ButtonGroup slot="extra">
          <Button @click="showInst(unionInfo.unionId)" type="info">管理学会</Button>
          <Button @click="updateUnion(unionInfo.unionId)" type="primary">修改信息</Button>
          <Button @click="remove(unionInfo.unionId)" type="error">停用</Button>
        </ButtonGroup>
        <Row>
          <Col span="8"><p>简称:{{unionInfo.unionShort}}</p></Col>
          <Col span="8"><p>英文名:{{unionInfo.unionEngName}}</p></Col>
          <Col span="8"><p>成立时间:{{unionInfo.registerTime}}</p></Col>
        </Row>
        <Row>
          <Col span="16"><p>地址:{{unionInfo.unionAddress}}</p></Col>
          <Col span="8"><p>网址:{{unionInfo.unionWebsite}}</p></Col>
        </Row>
        <Row>
          <Col span="8"><p>QQ群:{{unionInfo.unionQq}}</p></Col>
          <Col span="8"><p>微信公众号:{{unionInfo.unionWechat}}</p></Col>
          <Col span="8"><p>其他联系方式:{{unionInfo.unionOthers}}</p></Col>
        </Row>
        <p>简介:{{unionInfo.unionIntroduction}}</p>
        <p>备注:{{unionInfo.unionMemo}}</p>
      </card>
    </div>
    <div>
      <Drawer :closable="false" :scrollable="true" width="640" v-model="value2">
        <div class="demo-drawer-profile">
          <p :style="pStyle">
            学联体所含学会
            <Button @click="showInstList()" type="primary" :style="bStyle">添加学会</Button>
          </p>
        </div>
        <div v-for="inst in unionInstList">
          <Divider/>
          <p :style="pStyle">
            {{inst.instName}}
            <Button @click="removeInst(inst.instId)" type="error" :style="bStyle">移除学会</Button>
          </p>
          <div class="demo-drawer-profile">
            <Row>
              <Col span="12">
                <p :style="pStyle">学会简称:{{inst.instShort}}</p>
              </Col>
              <Col span="12">
                <p :style="pStyle">学会英文名:{{inst.instEngName}}</p>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <p :style="pStyle">注册时间:{{inst.registerTime}}</p>
              </Col>
              <Col span="12">
                <p :style="pStyle">所在行业:{{inst.indusName}}</p>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <p :style="pStyle">学会网址:{{inst.instWebsite}}</p>
              </Col>
              <Col span="12">
                <p :style="pStyle">微信公众号:{{inst.instWechat}}</p>
              </Col>
            </Row>
            <p :style="pStyle">学会地址:{{inst.instAddress}}</p>
            <p :style="pStyle">学会简介:{{inst.instIntroduction}}</p>
            <p :style="pStyle">学会备注:{{inst.instMemo}}</p>
          </div>
        </div>
      </Drawer>
      <Drawer title="学会列表" :closable="false" :mask-closable="false" v-model="value3">
        <CheckboxGroup v-model="unionInstGroup">
          <div v-for="inst in instList">
            <Checkbox v-if="inst.isInclude" v-bind:label="inst.instId" disabled>{{inst.instName}}</Checkbox>
            <Checkbox v-else v-bind:label="inst.instId">{{inst.instName}}</Checkbox>
          </div>
        </CheckboxGroup>
        <div class="demo-drawer-footer">
          <Button style="margin-right: 8px" @click="cancelValue3">取消</Button>
          <Button type="primary" @click="addInst">提交</Button>
        </div>
      </Drawer>
    </div>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'

  export default {
    name: 'unionInfo',
    data () {
      return {
        value1: false,
        value2: false,
        value3: false,
        showUnionId: '',
        drawTitle: '新增学联体',
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
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
        update: false,
        unionList: [],
        union: {
          unionId: '',
          unionName: '',
          unionShort: '',
          unionEngName: '',
          unionAddress: '',
          unionWebsite: '',
          unionWechat: '',
          unionQq: '',
          unionOthers: '',
          registerTime: '',
          unionIntroduction: '',
          unionMemo: ''
        },
        unionInstList: [],
        unionInstGroup: [],
        instList: [],
        unionInst: {
          unionId: '',
          initId: []
        }
      }
    },
    created () {
      this.getUnions()
    },
    methods: {
      cancel (name) {
        this.$refs[name].resetFields()
        this.value1 = false
        this.drawTitle = '新增学联体'
        this.update = false
      },
      cancelValue3 () {
        this.unionInstGroup = []
        this.instList = []
        this.value3 = false
      },
      postUnion (name) {
        axios.request({
          url: `societies/unions`,
          method: `${this.update ? 'put' : 'post'}`,
          data: this.union
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
          this.getUnions()
          this.cancel(name)
        })
      },
      getUnions () {
        axios.request({
          url: `societies/unions/list`,
          method: 'get',
        }).then(res => {
          this.unionList = res.data.data
        })
      },
      showInst (unionId) {
        axios.request({
          url: `societies/unions/institutes/${unionId}`,
          method: 'get'
        }).then(res => {
          this.unionInstList = res.data.data
          this.showUnionId = unionId
          this.value2 = true
        })
      },
      remove (id) {
        this.$Modal.confirm({
          title: '警告',
          content: '你确定要删除吗？',
          onOk: () => {
            axios.request({
              url: `societies/unions/${id}`,
              method: 'delete'
            }).then(res => {
              this.getUnions()
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
      updateUnion (id) {
        axios.request({
          url: `societies/unions/${id}`,
          method: 'get'
        }).then(res => {
          this.union.unionId = res.data.data.unionId
          this.union.unionName = res.data.data.unionName
          this.union.unionShort = res.data.data.unionShort
          this.union.unionEngName = res.data.data.unionEngName
          this.union.unionAddress = res.data.data.unionAddress
          this.union.unionWebsite = res.data.data.unionWebsite
          this.union.unionWechat = res.data.data.unionWechat
          this.union.unionQq = res.data.data.unionQq
          this.union.unionOthers = res.data.data.unionOthers
          this.union.registerTime = res.data.data.registerTime
          this.union.unionIntroduction = res.data.data.unionIntroduction
          this.union.unionMemo = res.data.data.unionMemo
          this.drawTitle = '更新学联体'
          this.update = true
          this.value1 = true
        })
      },
      addInst () {
        this.unionInst.unionId = this.showUnionId
        this.unionInst.initId = this.unionInstGroup
        axios.request({
          url: `societies/unions/institutes`,
          method: 'post',
          data: this.unionInst
        }).then(res => {
          if (res.data.code === 200) {
            this.$Message.success({
              title: '成功',
              content: '添加成功'
            })
          } else {
            this.$Message.error({
              title: '错误',
              content: res.data.errMsg
            })
          }
          this.cancelValue3()
          this.showInst(this.showUnionId)
        })
      },
      showInstList () {
        axios.request({
          url: `societies/unions/institutes/list/${this.showUnionId}`,
          method: 'get'
        }).then(res => {
          this.instList = res.data.data.instList
          this.unionInstGroup = res.data.data.unionInstGroup
          this.value3 = true
        })
      },
      removeInst (instId) {
        this.$Modal.confirm({
          title: '警告',
          content: '你确定要删除吗？',
          onOk: () => {
            axios.request({
              url: `societies/unions/institutes/${this.showUnionId}/${instId}`,
              method: 'delete'
            }).then(res => {
              if (res.data.code === 200) {
                this.$Message.success({
                  title: '成功',
                  content: '移除成功'
                })
              } else {
                this.$Message.error({
                  title: '错误',
                  content: res.data.errMsg
                })
              }
              this.showInst(this.showUnionId)
            })
          }
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

  .demo-drawer-profile {
    font-size: 14px;
  }

  .demo-drawer-profile {
    margin-bottom: 12px;
  }
</style>
