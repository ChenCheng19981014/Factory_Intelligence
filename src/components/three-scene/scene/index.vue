<template>
  <div class="scene" ref="scene" onselectstart="return false;">
    <div @pointerdown="(e) => e.stopPropagation()" class="btn">
      <div v-for="(name, _) in ['整体', 'AH1', 'A01', 'AH2', 'A02']">
        <button @click="cameraAnima(name)">{{ name }}</button>
      </div>
      <div class="machine-infoSprite ">{{ $store.state.domName }}</div>
    </div>
  </div>
</template>

<script>
// chang 事件 实例
let sceneChange = null;
// 场景
let runScene = null;
import { RunScene, Utils } from "run-scene-v2";
import bus from "./../../../lib/bus";
import * as THREE from "three";
import store from "../../../store/index";
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

    this.$refs["scene"] && (this.$refs["scene"].style.opacity = 1);

    // 更新点击模型
    bus.$on("updateShopName", (name) => store.commit("updateShopName", name));
  },
  methods: {
    doStep(step) {
      bus.$emit("doStep", step);
    },
    // 加载场景
    loadScene() {
      runScene = new RunScene({
        msg: {
          // show: true,
        },
        // showFps: true,
        coverSameId: true,
        instanceClone: false,
        render3: true,
        // render2: true,
        renderConfig: {
          // 是否允许设置模型位置后自动渲染最新效果
          matrixAutoUpdate: true,
          scriptFrame: 60,
        },
        texture: {
          // load: false,
        },
      })
        .load({
          path: "./assets/scene.glb",
          // path:
          //   "http://192.168.3.8:8080/file?path=project/linkpoint/&key=202304061610445181171001202334",
          dom: this.$refs["scene"],
        })
        .on("complete", () => {
          this.$emit("load");

          // 代码运行
          runScene.code.createFunc()({ bus });

          // fn(
          //   runScene,
          //   {
          //     Utils,
          //     bus,
          //     Three: THREE,
          //   },
          //   {
          //     needsShowSpriteMachineId,
          //   }
          // );
        });
    },

    /**
     * changeColor 方法
     * @describe:修改模型颜色
     * 参数:@string  --- modelName 设备名称
     *      @string  --- color 设备需要修改的颜色
     */
    changeColor() {
      bus.$emit("changeMachine-Color", "1A01", "#DC143C");
    },

    /**
     * cameraAnima 相机聚焦动画
     * @param { string } 聚焦的位置名称
     *
     */
    cameraAnima(cameraName) {
      bus.$emit("scene-cameraAnima", cameraName);
    },

    // 打印点击到的模型
    logClickModel(model) {
      console.log("点击的模型为:", model.name);
    },
    // 判断是否需要为伪加载
  },
  // 场景自带销毁
  destroyed() {
    // sceneChange && sceneChange.dispose();
  },
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
.sprites {
  position: absolute;
  width: 200px;
  height: 200px;
  background-color: red;
  opacity: 0;
}
.showOpacity {
  opacity: 1 !important;
}

.machine-infoSprite {
  width: 400px !important;
  height: 200px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  background-color: pink;
  font-size: 50px;
  opacity: 0;
}
</style>
