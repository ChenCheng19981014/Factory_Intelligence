/**
 * @description 路由信息
 */

export default [
    {
        name: "index",
        path: "/",
        component: () => import("@/views/index"),
        meta: {
            keepAlive: true, //需要被缓存的组件
            time() {
                return 300
            }
        },
    },
]
