<template>
  <div id="home">
    <nav-bar class="home">
      <div slot="center">购物街</div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import {getHomeMultidata} from 'network/home'

export default {
  name: 'Home',
  components: {
    NavBar
  },
  data() {
    return {
      banners: [],
      recommends: []
    }
  },
  // 组件创建的时候发送网络请求
  created() {
    // 1. 请求多个数据
    getHomeMultidata().then(res => {
      // console.log(res)
      // 数据保存
      this.banners = res.data.banner.list
      this.recommends = res.data.recommend.list
    })
  }
}
</script>

<style>
  /* 单独为主页导航栏设置样式 */
  .home {
    background-color: var(--color-tint);
    color: white;
  }
</style>
