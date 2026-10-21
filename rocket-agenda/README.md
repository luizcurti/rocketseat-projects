# Rocket Agenda

Agenda de contatos no terminal, feita em Python puro (sem frameworks nem dependências externas), como desafio do módulo "Introdução ao Python" da Rocketseat.

## Funcionalidades

- [x] Menu com as opções da aplicação, onde o usuário digita a escolha
- [x] Adicionar contato (Nome, Telefone, Email, Favorito)
- [x] Visualizar a lista de contatos cadastrados
- [x] Editar um contato existente
- [x] Marcar/desmarcar um contato como favorito
- [x] Visualizar a lista de contatos favoritos
- [x] Apagar um contato

## Como executar

Requer Python 3.

```bash
python3 agenda.py
```

## Exemplo de uso

```
===== Menu da Agenda =====
1. Adicionar contato
2. Ver contatos
3. Editar contato
4. Marcar/desmarcar contato como favorito
5. Ver contatos favoritos
6. Apagar contato
7. Sair
Digite a sua escolha: 2

Lista de contatos:
1. [★] Maria | Tel: 11999990000 | Email: maria@email.com
2. [ ] João | Tel: 11988880000 | Email: joao@email.com
```

Os contatos ficam guardados em memória (uma lista de dicionários) enquanto o programa está rodando.
