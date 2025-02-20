import {createRouter, createWebHashHistory} from 'vue-router';



export const menuList = [
    {
        path:'/system-settings',
        name:"system-settings",
        meta: {title: "系统设置"},
        component: () => import('@/views/setting.vue')
    },
    {
        path:'/buy-node',
        name:"buy-node",
        meta: {title: "购买节点"},
        component: () => import('@/views/buy-node.vue')
    },
    // {
    //     path:'/check-list',
    //     name:"check-list",
    //     meta: {title: "空投项目审核列表"},
    //     component: () => import('@/views/check-list.vue')
    //
    // },
    {
        path:'/aggregation-airdrop',
        name:"aggregation-airdrop",
        meta: {title: "聚合空投"},
        component: () => import('@/views/aggregation-airdrop.vue')
    },
    {
        path:'/platform-airdrop',
        name:"platform-airdrop",
        meta: {title: "平台空投"},
        component: () => import('@/views/platform-airdrop.vue')
    },
    {
        path:'/aggregation-alliance',
        name:"aggregation-alliance",
        meta: {title: "聚合联盟"},
        component: () => import('@/views/aggregation-alliance.vue')

    },
    {
        path:'/batch-airdrop',
        name:"batch-airdrop",
        meta: {title: "批量空投"},
        component: () => import('@/views/batch-airdrop.vue')
    },
    {
        path:'/platform-pre-sale',
        name:"platform-pre-sale",
        meta: {title: "平台预售"},
        component: () => import('@/views/platform-pre-sale.vue')
    }
]
// 定义路由
const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: '/system-settings',
        meta: {requiresAuth: true},
        children: menuList
    },
];

// 创建路由实例
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;