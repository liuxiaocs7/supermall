<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <!-- 包在里面的就是可滚动的 -->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            >
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control"
                  :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <!-- 监听组件的点击事件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>
// 公共组件
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

// 子组件
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

// 方法
import {getHomeMultidata, getHomeGoods} from 'network/home'

export default {
  name: 'Home',
  components: {
    NavBar,
    TabControl,
    GoodsList,
    HomeSwiper,
    RecommendView,
    FeatureView,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType: 'pop',
      isShowBackTop: false
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  // 组件创建的时候发送网络请求
  created() {
    // 1. 请求多个数据
    this.getHomeMultidata()

    // 2. 请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

  },
  mounted() {
    // 3. 开始监听item中图片加载完成
    // this.$bus.$on('itemImageLoad', () => {
    //   // console.log('------------')

    //   // 调用30次频繁
    //   this.$refs.scroll && this.$refs.scroll.refresh()
    // })

    const refresh = this.debounce(this.$refs.scroll.refresh, 500)
    this.$bus.$on('itemImageLoad', () => {
      refresh()
    })
  },
  methods: {
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // console.log(res)
        // 数据保存
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log(res)
        // 将数组中的每个元素依次取出来塞进去
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        // this.$refs.scroll.finishPullUp()
      })
    },
    /**
     * 事件监听的相关方法
     */
    tabClick(index) {
      // console.log(index)
      switch(index) {
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2:
          this.currentType = 'sell'
          break;
      }
    },
    backClick() {
      // console.log(this.$refs.scroll.message)
      // console.log(this.$refs.scroll)
      // this.$refs.scroll 表示拿到的组件，直接调用组件的方法
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    contentScroll(position) {
      // console.log(position)
      // position.y > 1000
      this.isShowBackTop = -position.y > 1000
    },
    // loadMore() {
    //   // console.log('上拉加载更多')
    //   this.getHomeGoods(this.currentType)
    // }
    debounce(func, delay) {
      let timer = null

      return function(...args) {
        if(timer) clearTimeout(timer)

        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    }
  },
}
</script>

<style scoped>
  #home {
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }

  /* 单独为主页导航栏设置样式 */
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* 固定位置 */
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }

  .content {
    /* height: calc(100% - 93px); */
    /* height: 300px; */
		/* background-color: red; */
    /* overflow: hidden; */

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
