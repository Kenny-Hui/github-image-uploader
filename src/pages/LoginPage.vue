<script setup lang="ts">
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { store } from '../store';

    const route = useRoute();
    const router = useRouter();
    const patToken = ref("");
    const errorMsg = route.query.error;
    const signout = route.query.signout == "1";
    const clientId = import.meta.env.VITE_GH_OAUTH_CLIENT_ID;
    const redirectUrl = import.meta.env.VITE_GH_OAUTH_REDIRECT;
    const scopes = import.meta.env.VITE_GH_SCOPE;
    const usePAT = clientId == null || redirectUrl == null;

    function authWithPAT() {
        if(patToken.value.length > 0) {
            store.accessToken = patToken.value;
            router.push('/setup');
        }
    }
</script>

<template>
    <div class="login-container">
        <div class="login-box">
            <h1>Login</h1>
            <div v-if="errorMsg != null" class="error msgbox">
                Failed to login: {{ errorMsg }}
            </div>
            <div v-if="signout" class="success msgbox">
                You have successfully signed out.
            </div>
            <p>This webpage serves as a frontend to GitHub's User Interface for uploading and share images in a GitHub repository.
                <br>To upload, we need to first authenticate with your GitHub account.
            </p>

            <hr>

            <div v-if="!usePAT">
                <a :href="`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scopes.split(',').join(' ')}&redirect_uri=${redirectUrl}`">Login with GitHub</a>
            </div>
            <div v-else>
                <input placeholder="GitHub Personal Access Token" v-model="patToken" size="40" type="password" />
                <br>
                <small>PAT Token Permission: <b>{{scopes.split(',').map((e: string) => `[${e}]`).join(' ')}}</b></small>
                <button @click="authWithPAT" :disabled="patToken.length == 0">Login</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
h1 {
    display: block;
    font-size: 2rem;
    margin: 1.5rem 0;
}

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    line-height: 2rem;
}

.msgbox {
    padding: 0.5rem;
    border-radius: 0.25rem;
}

.success {
    border: 1px solid #2791FC;
    background: rgba(39, 145, 252, 0.25);
}

.error {
    border: 1px solid red;
    background: rgba(255, 0, 0, 0.25);
}

.login-box {
    width: 500px;
    max-width: 100%;
    padding: 0 1rem;
    margin: auto;
}

input {
    margin: 0.5rem 0;
}

a {
    display: inline-block;
    line-height: initial;
    background-color: #000;
    padding: 0.7rem 1.2rem;
    border-radius: 0.35rem;
    color: white;
    margin: 0.25rem 0;
    line-height: 1;
}
</style>
