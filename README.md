# Autoflex Production Manager

Sistema de gerenciamento de produção com priorização de valor agregado.

## Estrutura
O projeto está dividido em dois módulos:
- `production-manager`: Backend em Java (Quarkus).
- `autoflex-front`: Frontend em React (Vite).

## Como Rodar

### 1. Back-end (Quarkus)

Requisitos: Java 17+

```bash
cd back-end
./mvnw quarkus:dev
```

A API estará disponível em: http://localhost:8080

### 2. Front-end (React)

Requisitos: Node.js
```bash
cd front-end
npm install
npm run dev
```

O front-end estará disponível em: http://localhost:5173

## Decisões Técnicas

- Back-end: Quarkus (Performance e Baixo consumo de memória).
- Database: H2 (In-memory para facilidade de teste e setup zero).
- Front-end: React + Vite (Build rápido e moderno).
- Arquitetura: Separação clara entre back-end e front-end via API REST JSON.
