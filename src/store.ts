import { reactive } from 'vue'

export type Image = {
    name: string,
    base64: string,
    type: string,
    download_url?: string,
    preview_url?: string,
    sha?: string,
    path?: string,
    size?: number,
    ready: boolean
}

export const store = reactive({
    user: JSON.parse(localStorage.getItem("user") ?? 'null'),
    setup: JSON.parse(localStorage.getItem("setup") ?? 'null'),
    accessToken: localStorage.getItem("access_token"),
    save() {
        if(this.accessToken) {
            localStorage.setItem("access_token", this.accessToken);
        } else {
            localStorage.removeItem("access_token");
        }
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("setup", JSON.stringify(this.setup));
    },
    reset() {
        this.user = null;
        this.setup = null;
        this.accessToken = null;
        this.save();
    }
});

export const getGH = async(endpoint: string) => {
    const resp = await fetch(`https://api.github.com${endpoint}`, {
        cache: 'no-store',
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${store.accessToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });

    const data = await resp.json();
    return data;
}

export const deleteGH = async(endpoint: string, body: object) => {
    const resp = await fetch(`https://api.github.com${endpoint}`, {
        method: "DELETE",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${store.accessToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
        },
        body: JSON.stringify(body)
    });

    const data = await resp.json();
    return data;
}

export const putGH = async(endpoint: string, body: object) => {
    const resp = await fetch(`https://api.github.com${endpoint}`, {
        method: "PUT",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${store.accessToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
        },
        body: JSON.stringify(body)
    });

    const data = await resp.json();
    return data;
}