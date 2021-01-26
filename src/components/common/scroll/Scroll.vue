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
  props: {
      probeType: Number,
      default: 0
  },
  data() {
    return {
      scroll: null,
      message: '哈哈哈'
    }
  },
  mounted() {
    // console.log(document.querySelector('.wrapper'))
    // console.log(this.$refs.wrapper)

    // 1. 创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      click: true
    })

    // 2. 监听滚动的位置
    this.scroll.on('scroll', (position) => {
      // console.log(position)
      // 自定义一个事件传出去
      this.$emit('scroll', position)
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
