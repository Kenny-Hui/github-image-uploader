<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
</script>

<template>
    <div class="app">
        <header>
            <AppHeader />
        </header>
        <main>
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
    .app {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: auto;
    }

    main {
        flex: 1;
    }
</style>
