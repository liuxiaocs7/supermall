<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>

    <!-- 包在里面的就是可滚动的 -->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
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
import {debounce} from 'common/utils'

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
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  destroyed() {
    // console.log('home destroyed')
  },
  activated() {
    // console.log('activated')
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // console.log('deactivated')
    // console.log(this.saveY)
    this.saveY = this.$refs.scroll.getScrollY()
    // console.log(this.saveY)
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

    // 1. 图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 500)
    this.$bus.$on('itemImageLoad', () => {
      refresh()
    })

    // 2.获取tabController的offsetTop
    // 所有的组件都有一个属性$e1:用于获取组件中的元素
    // 这里很多图片还没有加载完获取到的offsetTop不准确
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    // console.log(this.$refs.tabControl.$el.offsetTop)
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

        // 完成了上拉加载更多，以便于下一次使用
        this.$refs.scroll.finishPullUp()
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
      // 让两个tabcontrol保证一致
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
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
      // 1. 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000
      // // 2.决定tabControl是否吸顶(position:fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      // console.log('上拉加载更多')
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop)
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    }
    // debounce(func, delay) {
    //   let timer = null

    //   return function(...args) {
    //     if(timer) clearTimeout(timer)

    //     timer = setTimeout(() => {
    //       func.apply(this, args)
    //     }, delay)
    //   }
    // }
  },
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  /* 单独为主页导航栏设置样式 */
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* 固定位置 */
    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  /* .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  } */

  .content {
    /* height: calc(100% - 93px); */
    /* height: 300px; */
		/* background-color: red; */
    /* overflow: hidden; */

    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /* .fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  } */

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
