import { getToken } from "@/utils/index"
import store from "../store";
import { NEED_LOGIN_ROUTER_NAMES } from "@/constant/index"
import { Message } from "element-ui"
import bus from "@/lib/bus.js"

/**
 * @description 路由导航守卫
 */
export default (router) => {


    router.beforeEach(async (to, from, next) => {

        //执行路由跳转操作
        async function doNext() {


            store.state.rc = true

            //延迟处理
            if (to.meta.time) {
                await new Promise((r) => {

                    if (from.name === null) {
                        r()
                    } else {
                        setTimeout(() => {
                            r()
                        }, from.meta.time());
                    }

                })
            }

            store.state.rc = false


            next()



        }

        await doNext()

        // let token = getToken();
        // if (store.state.loginState) {
        //     next();
        //     return
        // }
        // // 登录拦截
        // if (NEED_LOGIN_ROUTER_NAMES.includes(to.name)) {
        //     if (token) {
        //         try {
        //             // 测试token真实性  请求用户数据
        //             let res = {
        //                 code: 200
        //             }
        //             if (res.code == 200) {
        //                 // token可用 登入
        //                 store.commit("setUserInfo", res.data.userInfo)
        //                 store.commit("loginIn");
        //                 if (from.query && from.query.redirect) {
        //                     next({ path: from.query.redirect })
        //                 } else {
        //                     next()
        //                 }
        //                 return
        //             }
        //         } catch (error) {
        //             Message.error("请登录")
        //             next({
        //                 path: `/login?redirect=${to.path}`
        //             })
        //         }
        //     }
        //     Message.error("请登录")
        //     next({
        //         path: `/login?redirect=${to.path}`
        //     })
        //     return
        // }
        // next()
    })
}