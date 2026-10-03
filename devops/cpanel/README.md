# Deploying to GoDaddy Economy (cPanel + Node.js)

One Node app serves everything: the API (`/api`), the public site (`/`) and the admin panel (`/admin`).

## 1. Build the bundle (on your own computer, Node 18+)

```bash
npm install
npm run package:cpanel
```
This creates `dist-cpanel/`. Zip its **contents** (so `package.json` is at the top of the zip) as `pulizia.zip`.

## 2. Upload

cPanel → **File Manager** → create a folder **outside** `public_html`, e.g. `/home/USER/pulizia-app`
→ upload `pulizia.zip` there → **Extract**.

Also create a data folder (survives app updates): `/home/USER/pulizia-data` with a subfolder `uploads`.

## 3. Create the Node.js app

cPanel → **Setup Node.js App** → **Create Application**
- Node.js version: highest available (18, 20 or 22)
- Application mode: **Production**
- Application root: `pulizia-app`
- Application URL: your domain (root)
- Application startup file: `src/server.js`

Add **environment variables**:

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | a long random string |
| `ADMIN_USER` | your admin username |
| `ADMIN_PASS` | a strong password (used on first start only) |
| `DB_PATH` | `/home/USER/pulizia-data/pulizia.sqlite` |
| `UPLOAD_DIR` | `/home/USER/pulizia-data/uploads` |

Click **Run NPM Install**, then **Start App** (or **Restart**). The database tables and admin account are created automatically on first start.

## 4. HTTPS (required)

In production the login cookie is `Secure`, so the site must open over HTTPS.
cPanel → **SSL/TLS Status** → run AutoSSL (GoDaddy's free SSL is included), and turn on **Force HTTPS Redirect** (Domains page).

## 5. Check

- `https://yourdomain.com/api/health` → `{"status":"ok"}`
- `https://yourdomain.com/` → public site
- `https://yourdomain.com/admin/` → log in

## Updating later

Re-run `npm run package:cpanel`, upload and extract the new zip over `pulizia-app` (overwrite), click **Run NPM Install** only if dependencies changed, then **Restart**. Your database and uploads live in `pulizia-data`, so they are untouched.

## Backups
Download `/home/USER/pulizia-data/` (the .sqlite file + `uploads/`) from File Manager regularly.

## Troubleshooting
- **`npm install` fails on `sqlite3`**: it needs a prebuilt binary or a compiler. Try a different Node version in the app settings; if it still fails, contact GoDaddy support or tell me and I'll switch the app to Node's built-in SQLite.
- **500 / blank page**: check `stderr.log` in the app folder (File Manager) for the error.
- **Cannot log in**: confirm you're on HTTPS.