# CI/CD com GitHub Actions e AWS App Runner

Este repositorio contem um exemplo completo de pipeline CI/CD com GitHub Actions e provisionamento de infraestrutura com Terraform para AWS App Runner, com dois ambientes:

- dev
- prod

O fluxo implementado:

1. Executa testes da aplicacao.
2. Executa validacao do Terraform (fmt e validate).
3. Provisiona ECR e faz build/push da imagem para dev.
4. Aplica Terraform em dev para atualizar App Runner.
5. Executa health check em dev.
6. Se o health check passar, provisiona ECR/build/push/apply em prod.

## Estrutura do projeto

```
.
|-- .github/workflows/ci-cd.yml
|-- infra/
|   |-- environments/
|   |   |-- dev/
|   |   `-- prod/
|   `-- modules/
|       |-- ecr/
|       `-- apprunner_service/
|-- src/
|-- test/
|-- Dockerfile
`-- package.json
```

## Requisitos

- Node.js 22+
- Docker
- Terraform 1.6+
- Conta AWS com permissoes para:
  - ECR
  - App Runner
  - IAM
- Repositorio no GitHub com OIDC configurado para AWS

## Rodando localmente

1. Instale dependencias:

```bash
npm ci
```

2. Rode testes:

```bash
npm test
```

3. Rode aplicacao:

```bash
npm start
```

4. Teste endpoint de saude:

```bash
curl http://localhost:8080/health
```

## Terraform (dev/prod)

Cada ambiente possui pasta propria em `infra/environments`.

### Exemplo dev

```bash
cd infra/environments/dev
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

### Exemplo prod

```bash
cd infra/environments/prod
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

## Configuracao do GitHub Actions

Configure as seguintes **Secrets** no repositorio:

- `AWS_ROLE_TO_ASSUME`: role IAM para OIDC do GitHub Actions.
- `DEV_RUNTIME_ENV_VARS_JSON`: JSON com variaveis do ambiente dev.
- `PROD_RUNTIME_ENV_VARS_JSON`: JSON com variaveis do ambiente prod.

Exemplo de JSON:

```json
{
  "APP_ENV": "dev",
  "API_BASE_URL": "https://api.exemplo.com",
  "DB_URL": "postgres://user:pass@host:5432/db"
}
```

Configure as seguintes **Variables** no repositorio:

- `AWS_REGION` (opcional, padrao: `us-east-1`)
- `DEV_HEALTHCHECK_PATH` (opcional, padrao: `/health`)

## Branch e disparos

- Pull Request para `main`: executa qualidade (testes + validacao terraform).
- Push em `main`: executa deploy dev e, se aprovado no health check, deploy prod.
- `workflow_dispatch`: permite disparo manual.

## Contribuicao

1. Crie uma branch a partir de `main`.
2. Implemente sua alteracao.
3. Rode testes e validacoes locais.
4. Abra Pull Request com descricao clara.

## Licenca

Projeto licenciado sob MIT. Veja o arquivo `LICENSE`.
