# 🛠️ Serveur DISC — Backend API

Backend minimaliste **Express + Prisma + PostgreSQL** qui enregistre les soumissions du questionnaire DISC.

## 🚀 Démarrage

### 1. Pré-requis
- **Node.js 18+**
- **PostgreSQL** (local, Neon, Supabase, Railway, etc.)

### 2. Configuration

```bash
# Copier le template d'environnement
cp .env.example .env

# Éditer .env et mettre votre DATABASE_URL
# Exemple local :
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/disc?schema=public
```

### 3. Installation et migration

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npm run prisma:generate

# Créer la table dans PostgreSQL
npm run prisma:migrate
# → Donner un nom à la migration : "init"
```

### 4. Lancer

```bash
# Développement (auto-reload)
npm run dev

# Production
npm start
```

Le serveur écoute sur `http://localhost:4000`.

## 📡 Endpoint

### `POST /api/submissions`

Enregistre un questionnaire DISC complet.

**Body** :
```json
{
  "info": {
    "nom": "Mufasa",
    "postNom": "King",
    "prenom": "randy",
    "sexe": "Homme",
    "dateNaissance": "1990-05-15",
    "telephone": "+243 900 000 000",
    "email": "mufasa@example.com"
  },
  "answers": { "1": "a", "2": "b", "3": "c", "...": "..." },
  "scores": { "D": 5, "I": 10, "S": 7, "C": 3 },
  "durationSeconds": 187
}
```

**Réponse 201** :
```json
{
  "id": 42,
  "code": "IS",
  "dominantProfile": "I",
  "createdAt": "2026-10-05T08:30:00.000Z"
}
```

### `GET /api/health`

Health check (vérifie aussi la connexion BDD).

```json
{ "ok": true, "db": "up", "ts": "2026-10-05T08:30:00.000Z" }
```

## 🗄️ Schéma de la base

Une seule table `submissions` :

| Champ              | Type           | Description                                |
|--------------------|----------------|--------------------------------------------|
| `id`               | SERIAL         | Identifiant unique                         |
| `created_at`       | TIMESTAMP      | Date de soumission                         |
| `nom`              | TEXT           | Nom (requis)                               |
| `post_nom`         | TEXT           | Post-nom                                   |
| `prenom`           | TEXT           | Prénom                                     |
| `sexe`             | TEXT           | Homme / Femme                              |
| `date_naissance`   | DATE           | Date de naissance                          |
| `telephone`        | TEXT           | Téléphone                                  |
| `email`            | TEXT           | Email                                      |
| `dominant_profile` | VARCHAR(2)     | D, I, S ou C                               |
| `code`             | VARCHAR(2)     | Ex: "DI", "IS", "SC"                       |
| `answers`          | JSONB          | Réponses brutes (objet)                    |
| `scores`           | JSONB          | Scores calculés (objet)                    |
| `duration_seconds` | INT            | Temps passé sur le quiz                    |
| `ip`               | TEXT           | IP du client                               |
| `user_agent`       | TEXT           | User-Agent du navigateur                   |

## 🛠️ Outils Prisma

```bash
# Ouvrir Prisma Studio (interface visuelle pour voir les données)
npm run prisma:studio

# Créer une nouvelle migration après modification du schéma
npm run prisma:migrate

# Régénérer le client après modif du schema
npm run prisma:generate
```

## 🔌 Connexion frontend

Dans le frontend du questionnaire (`disc/src/services/api.ts`), pointer vers :
```
http://localhost:4000/api
```
