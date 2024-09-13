<script setup lang="ts">
import { useRouter } from 'vue-router';
import { store } from '../store';
import { Wrench } from 'lucide-vue-next';

const router = useRouter();
const brand = import.meta.env.VITE_BRAND;

function signout() {
    store.reset();
    router.push('/login?signout=1');
}
</script>

<template>
    <div class="header">
        <div v-if="store.user != null" class="user">
            <img :src="store.user.avatarUrl">
            {{ store.user.displayName }} ({{ store.user.username }})
        </div>
        <div class="title">
            {{ brand }}
        </div>
        <div class="rhs">
            <button v-if="store.accessToken != null" @click="router.push('/setup')">
                <Wrench :size="18" />
            </button>
            <button v-if="store.accessToken != null" @click="signout">
                Sign out
            </button>
        </div>
    </div>
</template>

<style scoped>
    .header {
        display: flex;
        flex-wrap: wrap;
        font-size: 24px;
        padding: 0.75rem;
        align-items: center;
        justify-content: space-between;
    }

    button {
        line-height: 1;
        vertical-align: middle;
    }

    .rhs {
        display: flex;
        gap: 0.75rem;
    }

    .user {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: rgba(255, 255, 255, 0.1);
        font-size: 1.1rem;
        padding: 0.35rem 0.6rem;
        border-radius: 0.35rem;
    }

    .user > img {
        border-radius: 0.25rem;
        height: 24px;
    }

    .title {
        margin: auto;
        font-weight: 600;
    }
</style>