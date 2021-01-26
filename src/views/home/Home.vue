<template>
  <div id="home">
    <nav-bar class="home">
      <div slot="center">购物街</div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'

export default {
  name: 'Home',
  components: {
    NavBar
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
