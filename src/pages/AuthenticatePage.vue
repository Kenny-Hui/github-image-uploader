<script setup lang="ts">
    import { useRoute, useRouter } from 'vue-router';
    import { store } from '../store';
    const router = useRouter();
    const route = useRoute();
    const code = route.query.code;

    if(code != null) {
        fetch(`${import.meta.env.VITE_GH_OAUTH_TOKEN_URL}?code=` + code)
        .then(resp => resp.text())
        .then(text => {
            const result = new URLSearchParams(text);
            if(result.get("error") != null) {
                router.replace(`/login?error=${result.get("error_description")}`);
            } else {
                let token = result.get("access_token");
                localStorage.setItem('access_token', token ?? 'null');
                store.accessToken = token;
                router.push('/setup');
            }
        }).catch(err => {
            router.replace(`/login?error=${err}`);
        });
    } else {
        router.replace(`/login`);
    }
</script>

<template>
    <div class="auth">
        <p>Logging in, please wait...</p>
    </div>
</template>

<style scoped>
.auth {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>
