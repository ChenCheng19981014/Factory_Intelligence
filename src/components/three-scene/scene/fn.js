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

      }
    }



    return [InitScene];
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
