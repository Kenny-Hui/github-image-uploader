<script setup lang="ts">
import { computed, ref } from 'vue';
import { getGH, Image, store } from '../store';
import MainImage from '../components/MainImage.vue';
import MainUpload from '../components/MainUpload.vue';

const images = ref<Array<Image>>([]);
const searchTerm = ref("");
const displayedImages = computed(() => images.value
    .filter(e => e.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
    .sort((a, b) => parseInt(b.name.split("_").pop() ?? "0") - parseInt(a.name.split("_").pop() ?? "0"))
);

function addImage(img: Image) {
    images.value.push(img);
}

function removeImage(img: any) {
    images.value.splice(images.value.indexOf(img), 1);
}

(async() => {
    const imageList = await getGH(`/repos/${store.setup.repo}/contents/${store.user.username}`);

    if(imageList.status != "404") { // 404 if user haven't uploaded anything
        for(let img of (imageList as Image[])) {
            img.preview_url = img.download_url;
            images.value.push(img);
        }
    }
})();
</script>

<template>
    <div class="main">
        <MainUpload @add-file="addImage" />
        <div class="right-pane">
            <input class="search-box" type="text" placeholder="Search Here..." v-model="searchTerm">
            <div class="gallery" v-if="images.length > 0">
                <MainImage v-for="image in displayedImages" :image="image" :key="image.sha" @on-remove="removeImage" />
            </div>
            <div v-else>
                <p>Your uploaded file will be shown here.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .main {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        height: 100%;
    }

    .right-pane {
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 5rem);
        margin-bottom: auto;
        gap: 1rem;
        margin-right: 1rem;
        flex: 1;
    }

    .search-box {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid transparent;
        padding: 0.75rem;
        border-radius: 0.35rem;
        box-sizing: border-box;
        font-size: 1.1rem;
        outline: none;
        flex: 1;
    }

    .search-box:focus-visible {
        border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .gallery {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        gap: 1rem;
        overflow-y: auto;
    }
</style>
