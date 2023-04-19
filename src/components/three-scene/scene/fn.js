// const console = {
//   log: () => { }
// }

const fn = (runScene, inputData = {}, constant = {}) => {

  const fn = (map) => {

    const {
      runScene,
      Utils,
      core,
      getModel,
      constant,
      bus,
      Three,
      camera, scene, controls, renderer
    } = map;

    // 拿到常量
    const { needsShowSpriteMachineId } = constant

    // 场景初始化
    class InitScene {
      name = 'initScene';
      mounted() {
        // 脚本
        runScene.script.playAll();

        const resizeCanvas = function (x) {
          let map = runScene.assetsEx.engineDom.getBoundingClientRect();
          runScene.setSize(map.width / x, map.height / x);
        };

        bus.$emit("scene-resize", resizeCanvas);

        bus.$on("scene-changeScene", (x) => {

          Utils.getMacro(() => {
            resizeCanvas(x);
          })
        });


        // 入场动画
        runScene.cameraEx.setTemp('初始', { time: 2 });
      }
    }

    // 机器
    class Machine {
      name = "machine";
      // 机器 模型
      machineModel = {};
      mounted() {
        // 获取模型 并且克隆材质
        this.getModelAndCloneMaterial();
      }

      // 获取模型 并且克隆材质
      getModelAndCloneMaterial() {

        const machine = runScene.tags.get("设备");
        this.machineModel["设备"] = {};
        machine.map((modelId) => {
          const model = runScene.modelEx.getById(modelId);
          model.material = model.material.clone();
          const childrenName = model.name;
          this.machineModel["设备"][childrenName] = null;
          this.machineModel["设备"][childrenName] = model;
        });

        const ctMachine = runScene.tags.get("抽屉模型");
        this.machineModel["抽屉模型"] = {};
        ctMachine.map((modelId) => {
          const model = runScene.modelEx.getById(modelId);
          model.material = model.material.clone();
          const childrenName = model.name;
          this.machineModel["抽屉模型"][childrenName] = null;
          this.machineModel["抽屉模型"][childrenName] = model;
        });
      }

      dispose() { }
    }

    // 点位
    class Point {
      name = 'point'
      // 模型点位
      pointModel = {}

      mounted() {
        this.getModel();
        console.log('this.pointModel:', this.pointModel);
      }

      getModel() {
        const machine = runScene.tags.get("点位");
        const ctMachine = runScene.tags.get("抽屉点位");

        this.pointModel["点位"] = {};
        machine.map((modelId) => {
          const model = runScene.modelEx.getById(modelId);
          const childrenName = model.name;
          this.pointModel["点位"][childrenName] = null;
          this.pointModel["点位"][childrenName] = model;
          model.visible = false
        });

        console.log('ctMachine:', ctMachine);

        ctMachine.map((modelId) => {
          const model = runScene.modelEx.getById(modelId);
          const childrenName = model.name;
          this.pointModel["点位"][childrenName] = null;
          this.pointModel["点位"][childrenName] = model;
          model.visible = false
        });
      }

      dispose() {

      }

    }

    // 添加数据看板---- 选中设备
    class Sprite {
      name = 'sprite'
      dom = null;
      sprite = null;
      lastPointModel = null;
      mounted() {
        // 添加dom
        this.add();
      }
      // 加数据看牌
      add() {
        // 添加 数据看板
        this.sprite = getModel('machine-infoSprite')
        this.dom = this.sprite.element
        this.sprite.scale.set(0.3, 0.3, 0.3);
        this.sprite.visible = false;
        this.dom.classList.add("showOpacity");
      }

      // 是否显示对应的看板
      showSprite(model) {
        const name = model.name;
        const iscludes = needsShowSpriteMachineId.includes(name);
        const pointModel = core.point.pointModel["点位"][`point_${name}`];
        this.sprite.visible = iscludes;

        if (!iscludes) return;
        this.sprite.position.set(
          pointModel.position.x,
          pointModel.position.y,
          pointModel.position.z
        );

        // 更新选中的看板 名称
        bus.$emit('updateShopName', name)

      }

      dispose() {

      }
    }

    // 相机视角
    class CameraPosition {

      name = 'cameraPosition'

      mounted() {
        // 主场景 相机聚焦动画
        bus.$on('scene-cameraAnima', this.anima.bind(this))
      }

      anima(animaName) {
        runScene.cameraEx.setTemp(animaName, { time: 1 });
      }
    }

    // 颜色
    class ChangeColor {

      name = 'changeColor';

      modelMap = {}

      mounted() {

        // this.set('1A01', '#DC143C')
        bus.$on('changeMachine-Color', this.set.bind(this))
      }

      set(modelName, color) {
        const model = core.machine.machineModel['设备'][modelName]
        model.material.color = new Three.Color(color)
      }
    }

    // 基本事件
    class Events {
      name = 'events'
      constructor() {
        // runScene.assetsEx.controls.addEventListener("start", this.controlStart);

        runScene.cb.model.setSelect.add(
          "trigger-click",
          this.triggerClick.bind(this)
        );
      }
      triggerClick = (model) => {
        if (!model) return;
        bus.$emit("logClickModel", model);
        core.sprite.showSprite(model)
      };

      dispose() {
        controls.removeEventListener("start", this.controlStart);
      }
    }

    return [Machine, Sprite, Events, Point, InitScene, CameraPosition, ChangeColor];
  };

  const modules = fn({
    runScene,
    getModel: runScene.modelEx.getModel.bind(runScene.modelEx),
    core: runScene.custom,
    ...runScene.assetsEx.get(),
    ...inputData,
    constant,
    window: null,
  });

  if (!modules) return;

  modules
    .map((TheClass) => {
      const ins = new TheClass();
      if (!ins.name) throw TypeError("代码出错");
      runScene.custom[ins.name] = ins;
      return ins;
    })
    .map((ins) => ins?.mounted?.());
};

export { fn };
