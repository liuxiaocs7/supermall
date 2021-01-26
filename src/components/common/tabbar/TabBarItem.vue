<template>
  <!-- 所有的item都展示同一个图片同一个文字 -->
  <div class="tab-bar-item" @click="itemClick">
    <!-- 最外层包装一个div -->
    <div v-if="!isActive"><slot name='item-icon'></slot></div>
    <div v-else><slot name='item-icon-active'></slot></div>
<!--    <div :class="{active: isActive}" >
      <slot name='item-text'></slot>
    </div> -->
    <div :style="activeStyle">
      <slot name='item-text'></slot>
    </div>
    <!-- <slot name='item-text'></slot> -->
<!--    <img src="../../assets/img/tabbar/home.svg" alt="">
    <div>首页</div> -->
  </div>
</template>

<script>
export default {
  name: 'TabBarItem',
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {
      // isActive: true
    }
  },
  computed: {
    isActive() {
      // 当前活跃路由的path只有一个
      // /home -> item1(/home) = true
      return this.$route.path.indexOf(this.path) !== -1
    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {}
    }
  },
  methods: {
    itemClick() {
      // console.log('itemClick')
      this.$router.replace(this.path)
    }
  }
}
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
  /* line-height: 49px; */
}

.tab-bar-item img {
  height: 24px;
  width: 24px;
  margin-top: 3px;
  vertical-align: middle;
  margin-bottom: 2px;
}

.active {
  color: red;
}
</style>
