# izLETI

Pokrenuti sa 
```
npm i pg
npm i -D tsx @types/express @types/pg
npx tsx --env-file=.env server.ts



## Run locally

From the `src` directory:

```powershell
npm install
npm run dev
```

Then open <http://localhost:8080>. To use a different Google OAuth client, set
`GOOGLE_CLIENT_ID` before starting the server. Add `http://localhost:8080` (or
the configured local port) to that OAuth client's **Authorized JavaScript origins**
in Google Cloud Console. No redirect URI is needed for Google Identity Services.

Set `SESSION_SECRET` to a long random value for deployments. The development
server uses a local-only fallback.


PROVJER ROLLOVA

SELECT u.email, r.name AS role
FROM users u
JOIN userrole ur ON ur.userid = u.id
JOIN roles r ON r.id = ur.roleid
WHERE lower(u.email) = lower('ivor.trstenjak@gmail.com');