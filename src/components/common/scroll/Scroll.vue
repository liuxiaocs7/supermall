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
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
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
      click: true,
      pullUpLoad: this.pullUpLoad
    })

    // 2. 监听滚动的位置
    if(this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
        // console.log(position)
        // 自定义一个事件传出去
        this.$emit('scroll', position)
      })
    }

    // // 3. 监听上拉事件
    // this.scroll.on('pullingUp', () => {
    //   // console.log('上拉加载更多')
    //   this.$emit('pullingUp')
    // })

    // console.log(this.scroll)

    // 监听Scroll滚动到底部
    if(this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        console.log('监听到滚动到底部')
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
    scrollTo(x, y, time=300) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      // 有值的时候再刷新
      this.scroll && this.scroll.refresh()
      // console.log('-----------')
    }
  }
}
</script>

<style scoped>

</style>
