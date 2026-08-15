# TechChronicle Frontend

The frontend interface for TechChronicle, a platform focused on in-depth technical deep dives and engineering blogs. Built with Vue 3 and Vite.

## Tech Stack
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Reka UI
- **State Management**: Pinia
- **Routing**: Vue Router
- **Validation**: Zod, VeeValidate
- **Testing**: Vitest (Unit), Cypress (E2E)

## Getting Started

### Prerequisites
- Node.js (v22+)
- pnpm

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Set up environment variables:
   Copy `.env.example` to `.env`.

### Running the App
- **Development**: `pnpm dev`
- **Build for Production**: `pnpm build`
- **Preview Production Build**: `pnpm preview`

### Testing
- **Unit Tests**: `pnpm test:unit`
- **E2E Tests**: `pnpm test:e2e:dev`

### Linting & Formatting
- **Lint**: `pnpm lint`
- **Format**: `pnpm format`
