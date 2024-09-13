import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import AuthenticatePage from './pages/AuthenticatePage.vue';
import Login from './pages/LoginPage.vue';
import Main from './pages/MainPage.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import Setup from './pages/SetupPage.vue';
import { getGH, store } from './store';

const routes = [
    {
        path: '/',
        component: Main
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/setup',
        component: Setup
    },
    {
        path: '/auth',
        component: AuthenticatePage
    }
];

const router = createRouter({ history: createWebHashHistory(), routes });
router.beforeEach((to, _from) => {
    if(store.accessToken == null) {
        if(to.path != '/login' && to.path != '/auth') {
            return '/login';
        }
    } else {
        if(to.path != '/setup' && store.user != null && store.setup == null) {
            return '/setup';
        }
        if(to.path == '/login') {
            return '/';
        }
    }
});

router.afterEach((_to, _from) => {
    if(store.accessToken != null) { // TODO: We probably also need to update this periodically
        (async() => {
            const userInfo = await getGH("/user");
            if(userInfo.status && userInfo.status != "200") {
                store.reset();
                router.push(`/login?error=${userInfo.status}: ${userInfo.message}`);
            } else {
                store.user = {
                    username: userInfo.login,
                    displayName: userInfo.name,
                    avatarUrl: userInfo.avatar_url
                };
                store.save();
            }
        })();
    }
});

createApp(App)
.use(router)
.mount('#app');
