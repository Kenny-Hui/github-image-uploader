<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { getGH, store } from '../store';
    import { ref } from 'vue';
    
    const router = useRouter();
    const repos = ref<Array<any>>([]);
    const emails = ref<Array<any>>([]);
    const selectedRepo = ref<string | null>(store.setup?.repo);
    const selectedEmail = ref<string | null>(store.setup?.email);

    Promise.all([
        getGH("/user/repos?per_page=100").then(repoList => {
            repos.value = repoList;
            if(selectedRepo.value == null && repoList.length > 0) {
                selectedRepo.value = repoList[0].full_name;
            }
        }),
        getGH("/user/emails").then(emailsList => {
            emails.value = emailsList;
            if(selectedEmail.value == null && emailsList.length > 0) {
                selectedEmail.value = emailsList[0].email;
            }
        })
    ]);

    function finishSetup() {
        store.setup = {
            repo: selectedRepo,
            email: selectedEmail
        }
        store.save();
        router.push('/');
    }
</script>

<template>
    <div class="login-container">
        <div class="login-box">
            <h1>Setup</h1>
            <p>Welcome! Please select the repository you want to upload in.</p>
            <select v-model="selectedRepo">
                <option :value="repo.full_name" v-for="repo in repos">{{ repo.full_name }}</option>
            </select>
            <p>Next, please select the email address.</p>
            <select v-model="selectedEmail">
                <option :value="email.email" v-for="email in emails">{{ email.email }}</option>
            </select>
            <p><small>This email address is used to commit in git and are viewable to anyone cloning the repository.</small></p>
            <button :disabled="selectedRepo == null" @click="finishSetup">Finish Setup!</button>
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

.box {
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
    max-width: 480px;
    margin: auto;
}

select, input {
    padding: 0.25rem;
}

a {
    display: inline-block;
    line-height: initial;
    background-color: #000;
    padding: 0.75rem;
    border-radius: 0.35rem;
    color: white;
    margin: 0.25rem 0;
}
</style>
