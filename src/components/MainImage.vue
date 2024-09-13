<script setup lang="ts">
import { Check, Link, Redo, Trash } from 'lucide-vue-next';
import { deleteGH, putGH, store } from '../store';
import { ref } from 'vue';
import { _arrayBufferToBase64, openBrowseDialog } from '../util';

const props = defineProps(['image']);
const emit = defineEmits(['onRemove']);
const linkCopied = ref(false);
const ready = ref(true);

async function removeImage() {
    ready.value = false;
    const data = {
        message: `Remove ${props.image.name}`,
        commiter: {
            name: store.user.displayName,
            email: store.setup.email
        },
        sha: props.image.sha
    }
    
    const result = await deleteGH(`/repos/${store.setup.repo}/contents/${props.image.path}`, data);

    if(result) {
        emit('onRemove', props.image);
    }
}

async function replaceImage() {
    openBrowseDialog(false, async(files: FileList | null) => {
        if(files == null || files.length == 0) return;
        ready.value = false;
        let data = await files[0].arrayBuffer();
        
        const body = {
            message: `Update ${props.image.name}`,
            commiter: {
                name: store.user.displayName,
                email: store.setup.email
            },
            content: _arrayBufferToBase64(data),
            sha: props.image.sha
        }
        const result = await putGH(`/repos/${store.setup.repo}/contents/${store.user.username}/${props.image.name}`, body);
        props.image.download_url = result.content.download_url;
        props.image.preview_url = `https://raw.githubusercontent.com/${store.setup.repo}/${result.commit.sha}/${store.user.username}/${props.image.name}`;
        props.image.sha = result.content.sha;
        props.image.path = result.content.path
        props.image.size = result.content.size;
        ready.value = true;
    });
}

function copyLink() {
    linkCopied.value = true;
    window.navigator.clipboard.writeText(props.image.download_url);
}

function openRawLink() {
    window.open(props.image.download_url, "_blank");
}
</script>

<template>
    <button @click="openRawLink" :class="{unready: !ready}">
        <div class="inline">
            <p :title="props.image.name">{{ props.image.name }}</p>
            <div class="tools">
                <button :disabled="!ready" title="Replace Image" @click.stop="replaceImage"><Redo :size="20" /></button>
                <button :disabled="!ready" title="Copy Link" @mouseleave="linkCopied = false" @click.stop="copyLink"><Link v-if="!linkCopied" :size="20" /> <Check v-else :size="20" /></button>
                <button class="remove-icon" title="Delete Image" :disabled="!ready" @click.stop="removeImage"><Trash :size="20" /></button>
            </div>
        </div>
        <div class="image">
            <img :alt="`Image for ${props.image.name}`" :src="props.image.preview_url">
        </div>
    </button>
</template>

<style scoped>
    button {
        display: flex;
        flex-direction: column;
        position: relative;
        max-width: 340px;
        border-radius: 0.5rem;
        padding: 0.5rem;
        transition: border-color 0.2s, opacity 0.35s;
    }

    .tools {
        display: flex;
        gap: 0.5rem;
    }

    .unready {
        opacity: 0.25;
    }
    
    .inline {
        max-width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 0.25rem;
        margin-bottom: 0.5rem;
    }

    .inline button {
        margin: 0rem;
        padding: 0.25rem;
        border-radius: 0.25rem;
    }

    .inline p {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
        padding: 0;
        white-space: nowrap;
        transition: max-height 0.25s;
    }

    .image {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .image img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 0.25rem;
    }

    .remove-icon {
        border: 1px solid transparent;
        transition: background-color 0.2s;
    }

    .remove-icon:hover {
        background: #EE2222;
    }
</style>
