# Desafio: Implementação de Práticas DevOps em um Ambiente Empresarial Fictício

## Contexto
Este documento apresenta um plano completo para aplicar práticas DevOps na empresa fictícia **Tech**, usando os conceitos de **CALMS** e as **Três Maneiras**.

## 1. Diagnóstico Cultural (C de CALMS)

### Processo analisado
Fluxo de entrega atual: desenvolvimento -> envio de pacote para operações -> deploy manual em produção -> testes manuais em produção -> monitoramento manual de logs.

### Pontos de atrito
- Handoff entre Desenvolvimento e Operações, com pouca responsabilidade compartilhada.
- Deploy manual sem padrão, com alta chance de erro humano.
- Testes feitos após deploy em produção, elevando risco ao cliente.
- Monitoramento reativo, dificultando detecção precoce de falhas.
- Conhecimento do legado (Delphi) concentrado em uma pessoa.

### Linha de base (dados atuais)
- Lead time entre entrega de código e deploy: **2 dias**.
- Taxa de sucesso dos deploys manuais: **80%**.
- Incidentes pós-deploy: **2 por semana**.
- MTTR: **4 horas**.

## 2. Automação (A de CALMS)

### Proposta
Implementar um pipeline **CI/CD padronizado** para os projetos, com etapas de validação antes da produção.

### Fluxo automatizado proposto
1. Commit/PR dispara pipeline.
2. Build automático e versionamento de artefato.
3. Testes automáticos (unitário, integração e smoke).
4. Qualidade e segurança (lint, análise estática, dependências vulneráveis).
5. Deploy automático em homologação.
6. Testes de regressão/smoke em homologação.
7. Aprovação leve para produção.
8. Deploy em produção com estratégia segura (canary/blue-green, quando possível).
9. Observabilidade automática (métricas, logs e alertas).
10. Rollback automatizado em caso de falha.

### Ferramentas sugeridas
- CI/CD: GitHub Actions, GitLab CI ou Jenkins.
- Deploy/configuração: Ansible.
- Infraestrutura como código: Terraform.
- Monitoramento: Prometheus + Grafana.
- Logs: ELK/OpenSearch.

### Plano de adoção (baixa resistência)
1. Piloto na plataforma de e-commerce.
2. Squad temporário com Dev + Ops + QA.
3. Definition of Done com critérios mínimos de qualidade.
4. Treinamento em pipeline, rollback e operação assistida.
5. Rollout por fases:
   - Fase 1: CI + testes automáticos.
   - Fase 2: deploy automático em homologação.
   - Fase 3: deploy em produção com aprovação e rollback.
6. Para o legado: script padronizado de deploy e transferência de conhecimento com especialista Delphi.

## 3. Mensuração e Compartilhamento (M e S de CALMS)

### Métricas (baseline -> meta em 90 dias)
- Lead Time: 2 dias -> até 4 horas.
- Frequência de Deploy: baixa -> ao menos 1 deploy diário (e-commerce).
- Taxa de Falha de Mudança: 20% -> até 5%.
- MTTR: 4 horas -> até 30 minutos.
- Incidentes pós-deploy: 2/semana -> até 0,5/semana.
- Cobertura de testes críticos: mínimo 70% nos módulos prioritários.
- MTTD: alertas em até 5 minutos.

### Disseminação de conhecimento
- Comunidade interna DevOps quinzenal.
- Post-mortem sem culpa.
- Runbooks de deploy, rollback e incidentes.
- Documentação viva versionada.
- Tech talks curtas e rodízio de operação assistida.

## 4. Três Maneiras do DevOps

### Primeira Maneira (Fluxo)
- Reduzir handoffs com pipeline único.
- Entregas menores e mais frequentes.
- Padronização de deploy e IaC.

### Segunda Maneira (Feedback)
- Feedback automático em PR (build/test/security).
- Dashboards e alertas em tempo real.
- Revisões periódicas de indicadores operacionais.

### Terceira Maneira (Aprendizado)
- Experimentos controlados (canary/feature flags).
- Blameless post-mortem.
- Backlog contínuo de melhorias técnicas.
- Reserva de capacidade para melhoria contínua (ex.: 15% da sprint).

## 5. Roadmap de 90 dias

### 0 a 30 dias
- Mapear fluxo atual e dependências críticas.
- Definir padrão de pipeline e critérios de qualidade.
- Implantar CI com build e testes no e-commerce.
- Criar dashboard inicial (métricas DORA).

### 31 a 60 dias
- Automatizar deploy em homologação.
- Implantar monitoramento e alertas.
- Formalizar runbooks e rollback.
- Iniciar rotina de post-mortem sem culpa.

### 61 a 90 dias
- Deploy em produção com estratégia segura.
- Expandir automação para o legado.
- Consolidar governança e rituais de aprendizado.
- Reavaliar metas para o próximo ciclo.

## 6. Resultados Esperados
- Entrega mais rápida e previsível.
- Menos falhas e recuperação mais ágil.
- Redução de riscos por conhecimento concentrado.
- Maior colaboração entre Desenvolvimento e Operações.
- Cultura contínua de aprendizado e inovação.
