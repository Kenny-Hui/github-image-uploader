<script setup lang="ts">
    import { Link, Upload } from 'lucide-vue-next';
    import { putGH, store } from '../store';
    import { ref } from 'vue';
    import { Image } from '../store';
    import { _arrayBufferToBase64, openBrowseDialog } from '../util';

    const uploadedFiles = ref<Array<Image>>([]);
    const emit = defineEmits(['addFile']);

    async function handleDrop(ev: DragEvent) {
        ev.preventDefault();
        await processAndUpload(ev.dataTransfer?.files ?? null);
    }

    function dragOver(ev: DragEvent) {
        ev.preventDefault();
    }

    async function processAndUpload(files: FileList | null) {
        const imageBatch: Image[] = [];
        if(files != null) {
            for(let file of files) {
                let fileNameArr = file.name.split(".");
                let fileName = fileNameArr.slice(0, -1).join(".");
                let extension = fileNameArr[fileNameArr.length - 1];
                let name = `${fileName}_${getDate()}.${extension}`;
                let data = await file.arrayBuffer();
                imageBatch.push({
                    name: name,
                    base64: _arrayBufferToBase64(data),
                    type: file.type,
                    ready: false
                });
            }
        }

        uploadedFiles.value = [...imageBatch];
        for(let file of uploadedFiles.value) {
            await upload(file);
        }
    }

    async function upload(img: Image) {
        const body = {
            message: `Upload ${img.name}`,
            commiter: {
                name: store.user.displayName,
                email: store.setup.email
            },
            content: img.base64,
            sha: img.sha
        };
        const result = await putGH(`/repos/${store.setup.repo}/contents/${store.user.username}/${img.name}`, body);
        img.download_url = result.content.download_url;
        img.preview_url = result.content.download_url;
        img.sha = result.content.sha;
        img.path = result.content.path
        img.size = result.content.size;
        img.ready = true;
        emit('addFile', img);
    }

    function onFileAreaClick() {
        openBrowseDialog(true, processAndUpload);
    }

    function copyLink(file: any) {
        window.navigator.clipboard.writeText(file.download_url);
    }

    function getDate(): string {
        let date = new Date();
        let year = date.getFullYear();
        let month = (date.getMonth()+1).toString().padStart(2, '0');
        let day = (date.getDate()).toString().padStart(2, '0');
        let hour = (date.getHours()).toString().padStart(2, '0');
        let minutes = (date.getMinutes()).toString().padStart(2, '0');
        let seconds = (date.getSeconds()).toString().padStart(2, '0');

        return year + month + day + hour + minutes + seconds;
    }
</script>

<template>
    <button class="upload" @dragover="dragOver" @drop="handleDrop" @click="onFileAreaClick">
        <div class="upload-prompt" v-if="uploadedFiles.length == 0">
            <Upload :size="48" />
            Drag and drop or browse file here
        </div>
        <div class="uploaded-files" v-else>
            <div :class="{uploaded: file.download_url != null}" class="file" v-for="file in uploadedFiles">
                <img :src="`data:${file.type};base64, ${file.base64}`">
                <p>{{ file.name }}</p>
                <div>
                    <button class="link-button" :disabled="file.download_url == null" @click.stop="copyLink(file)"><Link :size="20" /></button>
                </div>
            </div>
        </div>
    </button>
</template>

<style scoped>
    .upload {
        box-sizing: border-box;
        margin-left: 0.75rem;
        margin-bottom: 0.75rem;
        min-width: 20rem;
        max-width: 30rem;
        max-height: calc(100vh - 5rem);
    }

    .upload-prompt {
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .uploaded-files {
        height: 100%;
        overflow-y: auto;
    }

    .file img {
        max-width: 32px;
    }

    .file p {
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        transition: opacity 0.25s;
        opacity: 0.25;
    }

    .uploaded p {
        opacity: 1;
    }

    .link-button {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        margin: 0;
    }

    .file {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
</style>
