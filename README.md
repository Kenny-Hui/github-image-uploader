# GitHub Image Uploader
This is a frontend webpage to quickly upload and manage images to a public GitHub repository.  

## Deploying
### Building
Run the following in this project
```
npm i
npm run build
```

The compiled files will be located in the `dist/` directory.

## Environment variable
Environment variables can be changed for a custom branding, as well as setting up OAuth Authentication.

### Files
- The `.env` file is used to store environment variable. (For generic config)
- Variables in the `.env.local` file overrides those in `.env`, and is ignored by git.
- Variables in the `.env.development` file overrides those in `.env` when in dev mode (`npm run dev`).
- Variables in the `.env.development.local` file overrides those in `.env.development` file, and is ignored by git.
- See https://vitejs.dev/guide/env-and-mode for further details

### Variables List
| Variable                | Description                             | Default                                                 |
|-------------------------|-----------------------------------------|---------------------------------------------------------|
| VITE_BRAND              | The website name displayed to the user. | GitHub Image Uploader                                   |
| VITE_FAVICON            | The website favicon displayed.          | vue.svg (Files named custom_favicon* is ignored by git) |
| VITE_GH_SCOPE           | The scope/permission to grant in GH.    | public_repo,user:read_user,user:email                   |
| VITE_GH_OAUTH_CLIENT_ID | The Client ID of your GitHub OAuth App. | (N/A)                                                   |
| VITE_GH_OAUTH_REDIRECT  | The redirect URL of your OAuth App.     | (N/A)                                                   |
| VITE_GH_OAUTH_TOKEN_URL | The endpoint to obtain token.           | (N/A)                                                   |

## OAuth Authentication
By default you will be asked to login with a GitHub Personal Access Token (PAT). To setup OAuth, please see the following example, as well as [GitHub documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow).

### Example Setup
Endpoints:
- GET `https://www.example.com/auth/prod`
- - Redirect to `https://www.example.com/#/auth` (Passes `code` query, `www.example.com` is location deployed for production use)
- GET `https://www.example.com/auth/dev`
- - Redirect to `https://localhost:5173/#/auth` (Passes `code` query, `localhost:5173` is the location of dev server via npm dev)
- GET `https://www.example.com/get_access_token`
- - POST request to `https://github.com/login/oauth/access_token` and return the result in json
- - Body type: `application/x-www-form-urlencoded`
- - Body Content:
- - - `client_id`: Obtained from your OAuth App
- - - `client_secret`: obtained from your OAuth app, must not be leaked elsewhere!
- - - `code`: Passed as query param (In PHP use `$_GET["code"]`)

Environment variables:
`.env.local`:
- VITE_GH_OAUTH_CLIENT_ID=ABCDEFG
- VITE_GH_OAUTH_REDIRECT=https://www.example.com/auth/prod
- VITE_GH_OAUTH_TOKEN_URL=https://www.example.com/get_access_token

`.env.development.local`:
- VITE_GH_OAUTH_REDIRECT=https://www.example.com/auth/dev

## License
This project is licensed under the MIT License.