<<<<<<< HEAD
<template>
  <div :class="classes">
    <div :class="barConClasses">
      <i :class="`${prefix}-bar`" v-once v-for="i in 8" :key="`trigger-${i}`"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Trigger',
  props: {
    mode: String
  },
  data () {
    return {
      prefix: 'ivu-split-trigger',
      initOffset: 0
    }
  },
  computed: {
    isVertical () {
      return this.mode === 'vertical'
    },
    classes () {
      return [
        this.prefix,
        this.isVertical ? `${this.prefix}-vertical` : `${this.prefix}-horizontal`
      ]
    },
    barConClasses () {
      return [
        `${this.prefix}-bar-con`,
        this.isVertical ? 'vertical' : 'horizontal'
      ]
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
=======
<template>
  <div :class="classes">
    <div :class="barConClasses">
      <i :class="`${prefix}-bar`" v-once v-for="i in 8" :key="`trigger-${i}`"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Trigger',
  props: {
    mode: String
  },
  data () {
    return {
      prefix: 'ivu-split-trigger',
      initOffset: 0
    }
  },
  computed: {
    isVertical () {
      return this.mode === 'vertical'
    },
    classes () {
      return [
        this.prefix,
        this.isVertical ? `${this.prefix}-vertical` : `${this.prefix}-horizontal`
      ]
    },
    barConClasses () {
      return [
        `${this.prefix}-bar-con`,
        this.isVertical ? 'vertical' : 'horizontal'
      ]
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
>>>>>>> 1d06fb3a01ddefa6e96ab6b024b816bd877ab556
