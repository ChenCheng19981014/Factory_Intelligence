<style lang="scss" scoped>
body {
  margin: 0 auto;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <div id="app" @dragstart.prevent @selectstart.prevent>
    <fit-layout :width="1920" :height="1080">
      <ThreeScene></ThreeScene>
    </fit-layout>
  </div>
</template>

<script>
import ThreeScene from "./components/three-scene/scene/index.vue";
export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>
