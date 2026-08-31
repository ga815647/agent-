# Mobile setup gate

Cloudflare connector is not required. The PoC deploys from GitHub Actions.

1. In Cloudflare Dashboard, create a custom API token for the account with Workers Scripts: Edit, Browser Rendering: Edit, and Account Settings: Read.
2. Copy the Cloudflare Account ID.
3. In GitHub repo Settings > Secrets and variables > Actions, create:
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID
   - POC3A_ADMIN_TOKEN
4. Run Actions > Deploy ordinary-chat PoC-3A > Run workflow.
5. Open the deployed workers.dev URL, enter POC3A_ADMIN_TOKEN, start login, sign into ChatGPT through Live View, then run the fixed test.

Do not put the Cloudflare API token or ChatGPT session data in an Issue, commit, Actions artifact, or Actions log.
