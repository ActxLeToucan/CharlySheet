import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

import "./index.css";
import Lang from './scripts/Lang';

// https redirection (should be done in NGINX, but it not we do it here)
// if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
//     window.location.protocol = 'https:';
// }

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("./views/Home.vue")
    },
    {
        path: "/my",
        name: "My",
        component: () => import("./views/My.vue"),
        meta: { title: () => Lang.CreateTranslationContext('my', 'Documents') }
    },
    {
        path: "/doc/:id",
        name: "Doc",
        component: () => import("./views/Doc.vue"),
        meta: { title: () => import("./views/Doc.vue").then(async m => await m.default.meta.title()) }
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: () => import("./views/NotFound.vue"),
        meta: { title: () => Lang.CreateTranslationContext('errors', 'Error') }
    }
];

const router = createRouter({
    mode: "history",
    history: createWebHistory(),
    routes: routes
});

router.beforeEach((to, from) => {
    const route = routes.find(r => r.name === to.name);
    if (route.condition === undefined) return true;

    return route.condition() ? true : { name: "Login" };
});
router.afterEach(async (to, from) => {
    document.title = await Lang.GetTextAsync(Lang.CreateTranslationContext('home', 'CharlySheet'));
    if (!to.meta.title) return;
    
    let metaTitle = to.meta.title;
    if (typeof(metaTitle) === 'function') metaTitle = metaTitle();
    if (metaTitle instanceof Promise)     metaTitle = await metaTitle;
    if (Lang.isValidContext(metaTitle))   metaTitle = await Lang.GetTextAsync(metaTitle);
    if (typeof(metaTitle) !== 'string')   metaTitle = metaTitle.toString();
    document.title += ` - ${metaTitle}`;
});

createApp(App).use(router).mount('#app');