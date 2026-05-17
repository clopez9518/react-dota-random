# Dota Random Hero

A modern web application for randomly selecting Dota 2 heroes based on selected roles. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Role-based Selection** - Filter heroes by role: Carry, Mid, Offlane, Soft Support, Hard Support, or All Roles
- **Hero Management** - Enable/disable specific heroes for each role
- **Random Selection** - Roll for a random hero from the filtered pool
- **Visual Feedback** - Smooth animations during hero selection
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible components
- **Motion** - Animations
- **React Router** - Routing

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── components/     # UI components
│   │   ├── HeroTile.tsx
│   │   ├── ResultCard.tsx
│   │   └── RoleChip.tsx
│   ├── data/          # Hero data
│   ├── hooks/         # Custom hooks
│   └── pages/         # Page components
├── components/        # Shared UI components (shadcn)
├── lib/              # Utilities
└── main.tsx          # Entry point
```

## License

MIT