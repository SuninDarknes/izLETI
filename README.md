# izLETI

### KORACI ZA LOKALNO POKRETANJE

#### 1. setup baze
- po potrebi instalirati PostgreSQL (i pgadmin)
- napraviti novu bazu 'izLETI'
- **kreirati tablice**: kopirati SQL iz docs/baza/schema.sql (branch baza-relacijska-shema na git-u) u query tool i pokrenuti
- **dodati dummy data**: kopirati SQL iz docs/baza/dummy_data.sql (branch baza-relacijska-shema na git-u) u query tool i pokrenuti

#### 2. povezivanje s bazom
- u src folderu napraviti '.env' file
- kopirati podatke iz '.env.example' u '.env' i **prilagoditi za svoju lokalnu bazu**

#### 3. instaliranje node modula
- pozicionirati se **u src folder** 
- pokrenuti ```npm install```

#### 4. pokrenuti sa
- ```npx tsx --env-file=.env server.ts``` (u src folderu)

#### 5. otvoriti stranicu
- u preglednik napisati http://localhost:8080/
