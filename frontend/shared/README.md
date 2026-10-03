# shared

Code imported by both `admin` and `web` through the `@shared` alias
(configured in each app's `vite.config.js`):

- `api/` – fetch wrapper for the backend (`/api/...`)
- `hooks/` – `useFetch`
- `utils/` – date/text helpers
- `components/` – `Loader`