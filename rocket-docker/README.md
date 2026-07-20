# Docker Multi-Container Challenge

Projeto com Node.js + Express + PostgreSQL usando Docker e Docker Compose.

## Requisitos

- Docker
- Docker Compose

## Estrutura

```text
docker-desafio/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── .env.example
├── .env
├── README.md
├── app/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── db.js
│   └── routes.js
└── postgres/
    └── init-app-db.sh
```

## Como executar

1. Copiar o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Ajustar os valores sensiveis no arquivo `.env` antes de subir a stack.

3. Subir os containers:

```bash
docker compose up --build
```

## Ver logs

```bash
docker compose logs -f
```

## Parar

```bash
docker compose down
```

## Remover tudo

```bash
docker compose down -v
```

## Testar aplicacao

```bash
curl http://localhost:3000
```

Resultado esperado:

```text
Docker funcionando!
```

## Testar conexao com banco

```bash
curl http://localhost:3000/health
```

Resultado esperado:

```text
Database connected
```

## Entrar no banco

```bash
docker exec -it postgres_db psql -U appuser -d appdb
```

Para acessar com o usuario administrador do cluster:

```bash
docker exec -it postgres_db psql -U postgresadmin -d appdb
```

## Rede Docker

A rede customizada usada no projeto e `app-network`.

## Volume persistente

O volume nomeado `postgres_data` persiste os dados do PostgreSQL.

## Variaveis de ambiente

As configuracoes sao gerenciadas no arquivo `.env`.

Exemplo de variaveis:

```env
POSTGRES_DB=appdb
POSTGRES_USER=postgresadmin
POSTGRES_PASSWORD=ChangeThisAdminPassword

APP_DB_USER=appuser
APP_DB_PASSWORD=ChangeThisAppPassword

DB_HOST=postgres
DB_PORT=5432
DB_NAME=appdb
DB_USER=appuser
DB_PASSWORD=ChangeThisAppPassword

PORT=3000
```

## Seguranca

- O usuario administrador do PostgreSQL e separado do usuario da aplicacao.
- O usuario da aplicacao recebe apenas privilegios de conexao e operacao no banco configurado.
- Senhas configuradas por variaveis de ambiente.
- O arquivo `.env` esta no `.gitignore` para evitar versionar segredos locais.
- Build multi-stage.
- Imagem Alpine.
- Rede isolada e volume persistente.

## Checklist do desafio

| Item | Atendido |
| --- | --- |
| Dockerfile | ✅ |
| Multi-stage | ✅ |
| Alpine | ✅ |
| docker-compose | ✅ |
| Banco de dados | ✅ |
| Volume | ✅ |
| Rede | ✅ |
| Variaveis de ambiente | ✅ |
| Usuario nao root | ✅ |
| README | ✅ |
