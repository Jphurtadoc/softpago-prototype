# AGENT.md

# Project Architecture & Development Rules

This project follows **Hexagonal Architecture (Ports and Adapters)** and Clean Architecture principles.

The objective is to keep the business logic isolated from frameworks, databases, UI implementations, and external services.

---

# Core Principles

- Business logic must be framework-independent.
- Dependencies must always point inward.
- Controllers must remain thin.
- Infrastructure must never contain business rules.
- Use dependency injection whenever possible.
- Favor composition over tight coupling.
- Keep modules isolated and scalable.
- Write readable, maintainable, and testable code.

---

# Backend Architecture

The backend is built using:

- NestJS
- TypeScript

Each module must follow this structure:

```txt
module/
├── domain/
├── application/
├── infrastructure/
└── module.module.ts
```

---

# Layer Responsibilities

## Domain Layer

The domain layer contains the core business logic.

### Responsibilities

- Entities
- Value Objects
- Repository contracts (ports)
- Domain rules
- Domain services

### Rules

- Must NOT depend on NestJS
- Must NOT depend on databases
- Must NOT depend on HTTP
- Must NOT contain framework decorators
- Must remain pure TypeScript

### Example

```txt
domain/
├── entities/
├── repositories/
├── services/
└── value-objects/
```

---

## Application Layer

The application layer orchestrates business use cases.

### Responsibilities

- Use cases
- Commands, queries, and results (plain application contracts)
- Inbound ports (use case interfaces)
- Application mappers (domain → result)
- Application services
- Business workflows

### Rules

- Depends only on domain abstractions
- Must not contain infrastructure implementations
- Must not directly access databases
- Must not contain controller logic
- Must NOT contain framework decorators (`@ApiProperty`, `class-validator`, etc.)
- Must NOT contain HTTP DTO classes

### Example

```txt
application/
├── commands/
├── queries/
├── results/
├── ports/
├── use-cases/
├── mappers/
└── services/
```

---

## Infrastructure Layer

The infrastructure layer contains external implementations.

### Responsibilities

- Controllers
- HTTP DTOs (request/response classes with validation and Swagger decorators)
- HTTP mappers (HTTP DTO ↔ application command/query/result)
- Database repositories
- ORM schemas/models
- External APIs
- Adapters
- Event emitters
- File storage integrations

### Rules

- Implements domain contracts and inbound/outbound adapters
- Must not contain core business rules
- Framework-specific code belongs here
- HTTP DTOs must never be imported by use cases

### Example

```txt
infrastructure/
├── controllers/
├── http/
│   ├── dto/
│   └── mappers/
├── repositories/
├── persistence/
├── gateways/
└── providers/
```

---

# Dependency Direction

Dependencies must always point inward:

```txt
Infrastructure → Application → Domain
```

The domain layer must never know about infrastructure implementations.

---

# Module Isolation

Each module should be self-contained.

Avoid:

- cross-module tight coupling
- importing internal files from other modules
- shared mutable state

Communication between modules should happen through:

- interfaces
- services
- events
- public contracts

---

# HTTP Boundary (Inbound Adapter)

HTTP concerns belong in the infrastructure layer only.

## HTTP DTOs

- Location: `infrastructure/http/dto/`
- Naming: `{action}-{entity}.http-dto.ts` (e.g. `login-response.http-dto.ts`)
- May use `@ApiProperty`, `class-validator`, and `class-transformer`
- Represent the HTTP transport shape, not the application contract

## Application contracts

Plain TypeScript types/interfaces without decorators:

| Type | Location | Naming | Purpose |
|------|----------|--------|---------|
| Command | `application/commands/` | `{action}.command.ts` | Write operation input |
| Query | `application/queries/` | `{action}.query.ts` | Read operation input |
| Result | `application/results/` | `{entity}.result.ts` | Use case output for responses |

Use cases must accept commands/queries and return results (or domain entities when no response mapping is needed).

## HTTP mappers

- Location: `infrastructure/http/mappers/`
- Naming: `{feature}.http-mapper.ts`
- Map HTTP DTO → command/query before calling a use case
- Map result → HTTP response DTO when the API response shape differs from the application result

Do NOT use `implements` between HTTP DTOs and application contracts. Always map explicitly.

## Inbound ports

- Location: `application/ports/`
- Naming: `{action}.port.ts` (e.g. `login.port.ts`)
- Define the use case interface: `execute(command): Promise<result>`
- Use case classes implement the port
- Outbound ports (repositories) remain in `domain/repositories/`

Inbound ports are optional when the module has a single HTTP adapter, but prefer them for consistency in new code.

---

# Controllers

Controllers should:

- receive HTTP DTOs
- map HTTP DTOs to application commands/queries
- call use cases
- map results to HTTP response DTOs when needed

Controllers should NOT:

- contain business logic
- access repositories directly
- contain data transformation complexity beyond HTTP mapping

---

# Repositories

Repositories are abstractions defined in the domain layer.

Infrastructure provides concrete implementations.

Example:

```txt
domain/repositories/user.repository.ts
```

Implemented by:

```txt
infrastructure/repositories/in-memory-user.repository.ts
```

or:

```txt
infrastructure/repositories/prisma-user.repository.ts
```

---

# Frontend Architecture

Frontend is built using:

- React
- TypeScript

Use a **pages + features + shared** layout (not a flat `components/` tree for product UI):

```txt
src/
├── app/                 # App shell, router, providers
├── pages/               # Route entry points only
│   ├── auth/
│   └── dashboard/
├── features/            # Domain modules (UI + logic owned by a feature)
│   └── auth/
│       ├── components/
│       ├── themes/
│       └── index.ts     # Public barrel exports
├── shared/              # Cross-app UI and utilities (Navbar, layouts, etc.)
└── main.tsx
```

### Layer responsibilities

| Layer | Role | Examples |
|--------|------|----------|
| **`pages/`** | Route orchestration: navigation, API calls, loading/error, wiring props | `LoginPage`, `HomePage` |
| **`features/`** | Domain UI and logic reusable beyond a single route | `LoginForm`, `AuthLayout`, `authTheme` |
| **`shared/`** | Cross-cutting UI used by multiple features/pages | `Navbar`, `ConfirmDialog`, `MainLayout` |
| **`app/`** | Application bootstrap and routing | `router.tsx`, `App.tsx` |

---

# Frontend Rules

- **Pages stay thin.** A page wires a feature (or shared layout) to the route; it should not own large presentational trees or Storybook stories.
- **Features own the domain.** Forms, feature layouts, feature themes, hooks, and services live under `features/<name>/`. Export the public API from `features/<name>/index.ts`.
- **Do not fold features into pages.** Keep `features/auth` separate from `pages/auth` — pages import from `@/features/auth`.
- **One home for route pages.** Auth (and other) route pages live only under `pages/…`. Do not also keep duplicate pages under `features/*/pages/`.
- **Grow the same way.** When a dashboard page becomes non-trivial, add `features/dashboard` (or `features/loans`, etc.) and keep `pages/dashboard/*` as thin routes.
- **Avoid a top-level `src/components/` for product UI.** Prefer `features/*` or `shared/*`.
- Components should remain reusable within their layer.
- Avoid business logic inside pure presentational components; orchestration belongs in pages or feature hooks/services.
- API communication belongs in feature services (or shared services when cross-cutting).
- Keep state management predictable.

---

# Naming Conventions

## Files

Use kebab-case:

```txt
user.repository.ts
get-users.use-case.ts
users.controller.ts
```

## Classes

Use PascalCase :

```ts
GetUsersUseCase;
UsersController;
UserRepository;
```

---

# Code Style

- Prefer explicit typing
- Avoid `any`
- Keep functions small and focused
- Use meaningful variable names
- Prefer immutable patterns when possible
- Remove dead code
- Avoid duplicated logic

---

# Scalability Guidelines

The architecture should support:

- replacing infrastructure without affecting business logic
- adding databases with minimal changes
- adding new adapters easily
- future microservice extraction
- testability

---

# Testing Philosophy

Prefer testing:

- use cases
- domain services
- business rules

Avoid coupling tests to frameworks whenever possible.

---

# Future Extensions

Infrastructure implementations may later include:

- PostgreSQL
- MongoDB
- Prisma
- TypeORM
- Redis
- Message brokers
- Cloud providers

The architecture must allow these additions without changing the domain layer.

---

# General Rules

- Keep the codebase clean and modular.
- Follow SOLID principles.
- Prioritize maintainability over premature optimization.
- Keep architecture consistency across all modules.
- New modules must follow the same structure.

---

# AI Agent Instructions

When generating code for this repository:

- Respect Hexagonal Architecture on the backend.
- Never place business logic in controllers.
- Never couple domain logic to frameworks.
- Never put `@ApiProperty` or validation decorators in the application layer.
- Place HTTP DTOs in `infrastructure/http/dto/` with the `.http-dto.ts` suffix.
- Use plain `commands/`, `queries/`, and `results/` in the application layer.
- Map between HTTP DTOs and application contracts via `infrastructure/http/mappers/`.
- Generate scalable and modular code.
- Keep dependencies pointing inward.
- Follow the established folder structure.
- On the frontend, respect **pages + features + shared**: thin route pages, domain code in features, cross-app UI in shared. Do not dump product UI into a flat `src/components/` or merge features into `pages/`.
