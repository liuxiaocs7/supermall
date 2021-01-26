<template>
  <!-- 绑定给子组件children -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'Scroll',
  data() {
    return {
      scroll: null,
      message: '哈哈哈'
    }
  },
  mounted() {
    // console.log(document.querySelector('.wrapper'))
    // console.log(this.$refs.wrapper)
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: 3,
      click: true
    })
  },
  methods: {
    scrollTo(x, y, time=300) {
      this.scroll.scrollTo(x, y, time)
    }
  }
}
</script>

<style scoped>

</style>
