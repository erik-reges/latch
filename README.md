# 🍣 latch

### what you need

- A PostgreSQL instance
- [Bun](https://bun.sh) runtime installed

### how to run 🏃‍♂️‍➡️

1. clone the repo

```bash
git clone https://github.com/yourusername/latch.git
cd latch
```

2. set up envs

```bash
cp ./packages/api/.env.example ./packages/api/.env
cp ./packages/client/.env.example ./packages/client/.env
cp ./packages/db/.env.example ./packages/db/.env
```

3. db config

```bash
- Open `./packages/api/.env` and `./packages/db/.env`
- Set `DATABASE_URL` to your PostgreSQL connection string
```

4. install deps && init db

```bash
bun i && bun db:migrate
```

4. dev

```bash
bun dev
```
