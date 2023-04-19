<template>
  <div class="scene" ref="scene" onselectstart="return false;">
    <div @pointerdown="(e) => e.stopPropagation()" class="btn"></div>
  </div>
</template>

<script>
// chang 事件 实例
let sceneChange = null;
// 场景
let runScene = null;
import store from "../../../store/index";
import { RunScene, Utils } from "run-scene-v2";
import bus from "./../../../lib/bus";
import * as THREE from "three";
import { fn } from "./fn";
import { needsShowSpriteMachineId } from "./const";
export default {
  name: "ThreeScene",
  data() {
    return {
      modelName: null,
      color: null,
    };
  },
  mounted() {
    // 默认有loading
    bus.$emit("isShowLoading", true);
    // 加载场景
    this.loadScene();
    // 打印点击的模型接口
    bus.$on("logClickModel", this.logClickModel);
    // 初始化 透明度
    this.$refs["scene"] && (this.$refs["scene"].style.opacity = 1);
  },
  methods: {
    doStep(step) {
      bus.$emit("doStep", step);
    },
    // 加载场景
    loadScene() {
      runScene = new RunScene({
        coverSameId: true,
        instanceClone: false,
        render3: true,
        // render2: true,
        renderConfig: {
          // 是否允许设置模型位置后自动渲染最新效果
          matrixAutoUpdate: true,
          scriptFrame: 60,
        },
      })
        .load({
          // path: "./assets/scene.glb",
          path:
            // "http://192.168.3.8:8080/file?path=project/linkpoint/&key=202304060905173235331001202332",
            "http://192.168.3.8:8080/file?path=project/linkpoint/&key=202304031330569885801001202379",
          dom: this.$refs["scene"],
        })
        .on("complete", () => {
          this.$emit("load");

          // 代码运行
          // runScene.code.createFunc()({ bus });

          fn(
            runScene,
            {
              Utils,
              bus,
              Three: THREE,
            },
            {
              needsShowSpriteMachineId,
            }
          );
        });
    },

    // 打印点击到的模型
    logClickModel(model) {
      console.log("点击的模型为:", model.name);
    },
    // 判断是否需要为伪加载
  },
  // 场景自带销毁
  destroyed() {},
};

// 导出场景 资源
export { sceneChange, runScene as scene };
</script>

<style lang="scss" scoped>
// 场景
.scene {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
}

.text {
  width: 250px;
}
.scene .btn {
  position: absolute;
  z-index: 2;
}

.scene .show {
  opacity: 1 !important;
}

.scene .none {
  opacity: 0 !important;
}

.scene .block {
  display: block !important;
}
</style>
