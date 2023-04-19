/**
 * @description 全局组件
 * @tips 全局扫描 自动注册 {@components} 中所有组件,组件名称字段是name
 */

import Vue from "vue"

const componentsContext = require.context("../components", true, /index.vue$/)

componentsContext.keys().forEach(component => {
    const componentConfig = componentsContext(component).default
    if(!componentConfig.name){
        return
    }
    Vue.component(componentConfig.name, componentConfig)

})

