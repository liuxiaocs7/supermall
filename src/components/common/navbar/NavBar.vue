<template>
  <div class="nav-bar">
    <!-- 使用具名插槽并且外面套一个div方便修改样式 -->
    <div class="left"><slot name="left"></slot></div>
    <div class="center"><slot name="center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {
  name: "NavBar"
}
</script>

<style scoped>
  .nav-bar {
    display: flex;
    line-height: 44px;
    height: 44px;
    text-align: center;
    box-shadow: 0 1px 1px rgba(100, 100, 100, .1);
  }

  .left, .right {
    width: 60px;
    /* background-color: red; */
  }

  .center {
    flex: 1;
    /* background-color: blue; */
  }
</style>
