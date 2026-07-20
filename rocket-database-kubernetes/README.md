# Desafio: API Node.js + PostgreSQL no Kubernetes

Este projeto implementa uma API em Node.js conectada a um PostgreSQL em Kubernetes, com isolamento por namespaces, persistencia via PV/PVC, probes de saude, HPA e comandos de observabilidade.

## 1. Estrutura do projeto

```text
.
├── Dockerfile
├── package.json
├── src
│   ├── db.js
│   └── index.js
└── k8s
    ├── 00-namespaces.yaml
    ├── 01-db-secret.yaml
    ├── 02-db-storage.yaml
    ├── 03-db.yaml
    ├── 04-api-config.yaml
    ├── 05-api.yaml
    ├── 06-api-hpa.yaml
    └── 07-api-nodeport-optional.yaml
```

## 2. Pre-requisitos

- Docker instalado
- kubectl instalado
- Kind **ou** Minikube instalado

## 3. Subindo cluster local

### Opcao A: Kind

```bash
kind create cluster --name desafio-k8s
kubectl cluster-info --context kind-desafio-k8s
```

### Opcao B: Minikube

```bash
minikube start
kubectl cluster-info
```

## 4. Build da imagem da API (Node.js)

Na raiz do projeto:

```bash
docker build -t desafio-api:1.0.0 .
```

Se estiver usando Kind, carregue a imagem no cluster:

```bash
kind load docker-image desafio-api:1.0.0 --name desafio-k8s
```

Se estiver usando Minikube, pode usar:

```bash
eval $(minikube docker-env)
docker build -t desafio-api:1.0.0 .
```

## 5. Habilitar Metric Server (necessario para HPA)

### Kind

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl -n kube-system patch deployment metrics-server \
  --type='json' \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
```

### Minikube

```bash
minikube addons enable metrics-server
```

Validacao:

```bash
kubectl top nodes
```

## 6. Aplicar manifests

```bash
kubectl apply -f k8s/00-namespaces.yaml
kubectl apply -f k8s/01-db-secret.yaml
kubectl apply -f k8s/02-db-storage.yaml
kubectl apply -f k8s/03-db.yaml
kubectl apply -f k8s/04-api-config.yaml
kubectl apply -f k8s/05-api.yaml
kubectl apply -f k8s/06-api-hpa.yaml
```

Aguarde pods prontos:

```bash
kubectl get pods -n desafio-db -w
kubectl get pods -n desafio-api -w
```

## 7. Recursos criados

- Namespace `desafio-db`
  - Secret `postgres-secret`
  - PV `postgres-pv`
  - PVC `postgres-pvc`
  - Deployment `postgres` (1 replica)
  - Service `postgres-service` (ClusterIP)

- Namespace `desafio-api`
  - ConfigMap `api-config`
  - Secret `api-secret`
  - Deployment `api` (1 replica, com liveness/readiness)
  - Service `api-service` (ClusterIP)
  - HPA `api-hpa` (CPU target 70%, min 1, max 5)

- Opcional
  - Service `api-nodeport` em `k8s/07-api-nodeport-optional.yaml`

## 8. Testes de integracao API <-> Banco

### 8.1 Via port-forward

```bash
kubectl -n desafio-api port-forward svc/api-service 3000:3000
```

Em outro terminal:

```bash
curl -s http://localhost:3000/status
```

Retorno esperado:

```json
{"message":"Conexao OK"}
```

Inserir dado:

```bash
curl -s -X POST http://localhost:3000/dados \
  -H "Content-Type: application/json" \
  -d '{"valor":"teste desafio"}'
```

Listar dados:

```bash
curl -s http://localhost:3000/dados
```

### 8.2 Opcional via NodePort (sem port-forward)

```bash
kubectl apply -f k8s/07-api-nodeport-optional.yaml
```

- Kind: acesse pelo IP do no + porta 30080
- Minikube:

```bash
minikube service api-nodeport -n desafio-api --url
```

## 9. Observabilidade basica

### Logs

```bash
kubectl logs -n desafio-api deploy/api
kubectl logs -n desafio-db deploy/postgres
```

### Uso de CPU e memoria

```bash
kubectl top pod -n desafio-api
kubectl top pod -n desafio-db
```

### Descricao detalhada dos recursos

```bash
kubectl describe deploy api -n desafio-api
kubectl describe hpa api-hpa -n desafio-api
kubectl describe pvc postgres-pvc -n desafio-db
```

## 10. Validacao do HPA com carga

Veja o estado inicial:

```bash
kubectl get hpa -n desafio-api -w
```

Gere carga (exemplo com busybox):

```bash
kubectl run -n desafio-api load-generator --rm -it --image=busybox -- /bin/sh
```

Dentro do pod:

```sh
while true; do wget -q -O- http://api-service:3000/status; done
```

Em outro terminal, acompanhe o escalonamento:

```bash
kubectl get pods -n desafio-api -w
kubectl top pod -n desafio-api
```

## 11. Rolling Update

O Deployment da API ja esta com estrategia `RollingUpdate`:

- `maxUnavailable: 0`
- `maxSurge: 1`

Para simular update:

```bash
kubectl -n desafio-api set image deploy/api api=desafio-api:1.0.1
kubectl -n desafio-api rollout status deploy/api
```

## 12. Permissoes de banco (melhoria adicional)

No estado atual, a API usa `app_user`. Para endurecer seguranca:

- criar usuario com permissoes somente de `SELECT/INSERT` na tabela `dados`
- impedir permissoes de `DROP/ALTER`
- guardar credenciais no Secret do Kubernetes

## 13. Limpeza do ambiente

```bash
kubectl delete -f k8s/06-api-hpa.yaml
kubectl delete -f k8s/05-api.yaml
kubectl delete -f k8s/04-api-config.yaml
kubectl delete -f k8s/03-db.yaml
kubectl delete -f k8s/02-db-storage.yaml
kubectl delete -f k8s/01-db-secret.yaml
kubectl delete -f k8s/00-namespaces.yaml
```

Se estiver usando Kind:

```bash
kind delete cluster --name desafio-k8s
```
