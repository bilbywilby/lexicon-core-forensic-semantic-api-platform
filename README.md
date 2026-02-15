# Cloudflare Workers Chat Demo

[![Deploy to Cloudflare][![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/lexicon-core-forensic-semantic-api-platform)]

A full-stack real-time chat application built with Cloudflare Workers and Durable Objects. Features user management, chat rooms, and message persistence using a single shared Durable Object for efficient multi-entity storage. The modern React frontend uses Shadcn UI, Tanstack Query, and Tailwind CSS.

## Features

- **User Management**: Create, list, and delete users with pagination and indexing.
- **Chat Rooms**: Create chats, list with pagination, send messages in real-time.
- **Durable Objects**: One DO instance per entity (User/Chat), with global storage and indexes for listing.
- **API-Driven**: RESTful endpoints with Hono routing, CORS, and error handling.
- **Modern UI**: Responsive design with dark/light themes, sidebar navigation, and smooth animations.
- **Type-Safe**: Full TypeScript support across frontend, shared types, and Workers.
- **Production-Ready**: Error boundaries, client error reporting, health checks, and Cloudflare observability.

## Tech Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects
- **Frontend**: React 18, Vite, TypeScript, Tanstack Query
- **UI**: Shadcn UI, Tailwind CSS, Lucide Icons, Framer Motion
- **State**: Tanstack Query for data fetching/caching
- **Utils**: Zod validation, Immer, React Hook Form
- **Dev Tools**: Bun, Wrangler, ESLint, TypeScript

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (optional for local dev/deploy)

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd <project-name>
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Generate Worker types (if needed):

   ```bash
   bun run cf-typegen
   ```

### Development

Start the development server (runs Vite for frontend + Worker preview):

```bash
bun dev
```

- Frontend: http://localhost:3000
- API: http://localhost:8787/api (Worker proxy)
- Open browser to preview the app.

Hot-reload works for both frontend and Worker routes (edit `worker/user-routes.ts`).

### Build for Production

```bash
bun run build
```

Outputs static assets to `dist/` and Worker bundle.

## Usage

### Frontend

The app provides a demo interface for managing users and chats. Key pages:
- Home: Dashboard with chat overview.
- API integration via Tanstack Query hooks (e.g., `api('/api/users')`).

### API Endpoints

All endpoints under `/api/`:

- **Users**:
  - `GET /api/users?cursor=&limit=` - List users (paginated)
  - `POST /api/users` - Create user `{ name: string }`
  - `DELETE /api/users/:id` - Delete user
  - `POST /api/users/deleteMany` - Bulk delete `{ ids: string[] }`

- **Chats**:
  - `GET /api/chats?cursor=&limit=` - List chats
  - `POST /api/chats` - Create chat `{ title: string }`
  - `DELETE /api/chats/:id` - Delete chat
  - `POST /api/chats/deleteMany` - Bulk delete

- **Messages**:
  - `GET /api/chats/:chatId/messages` - List messages
  - `POST /api/chats/:chatId/messages` - Send `{ userId: string, text: string }`

- **Health**: `GET /api/health`
- **Error Reporting**: `POST /api/client-errors`

Responses follow `{ success: boolean, data?: T, error?: string }`.

Example with `curl`:

```bash
# Create user
curl -X POST http://localhost:8787/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'

# List chats
curl http://localhost:8787/api/chats
```

## Deployment

Deploy to Cloudflare Workers with a single command:

```bash
bun run deploy
```

This builds assets and deploys via Wrangler. Requires:
- Cloudflare account login: `wrangler login`
- Set via `wrangler secret put <name>` or `wrangler.toml`

For instant deployment:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/lexicon-core-forensic-semantic-api-platform)

**Custom Domain/Assets**: Update `wrangler.jsonc` for bindings/migrations.

**Observability**: Enabled by default (logs, metrics).

## Extending the Project

### Backend

- Add entities in `worker/entities.ts` (extends `IndexedEntity`).
- Add routes in `worker/user-routes.ts` (uses `core-utils.ts` helpers).
- Routes auto-reload in dev.

### Frontend

- Add pages/routes in `src/main.tsx`.
- Use `api()` from `src/lib/api-client.ts` for data fetching.
- Components in `src/components/ui/` (Shadcn).
- Hooks: `useTheme`, `useMobile`.

### Shared Code

- Types/Mocks: `shared/types.ts`, `shared/mock-data.ts`.

## Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Build for production |
| `bun lint` | Lint code |
| `bun preview` | Preview production build |
| `bun deploy` | Deploy to Cloudflare |
| `bun cf-typegen` | Generate Worker types |

## Troubleshooting

- **Types errors**: Run `bun run cf-typegen`.
- **Worker routes fail**: Check `worker/user-routes.ts` imports.
- **CORS issues**: Enabled for `/api/*`.
- **Logs**: Tail via `wrangler tail` post-deploy.

## License

MIT. See [LICENSE](LICENSE) for details.