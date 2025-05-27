This the client for my travel-management-system with permitio article. follow along to setup locally

## 📁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-nextjs-app.git
cd your-nextjs-app
```

### 2. Install Dependencies with pnpm

Make sure you have `pnpm` installed. If not, install it globally:

```bash
npm install -g pnpm
```

Then install project dependencies:

```bash
pnpm install
```

### 3. Setup Environment Variables

Copy the example environment file and update it with your API URL:

```bash
cp .env.example .env
```

Then open `.env` and set the appropriate values:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

---

## 🧑‍💻 Development

Start the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app running.

---

## 🏗️ Building for Production

To build the application:

```bash
pnpm build
```

To preview the production build locally:

```bash
pnpm start
```

---

## 🧪 Linting & Formatting

Run ESLint to catch issues:

```bash
pnpm lint
```

(If using Prettier)

```bash
pnpm format
```

---

## 🧼 Clean Install

If you run into issues:

```bash
pnpm install --force
```

---

## 📄 Scripts Summary

| Script        | Description               |
| ------------- | ------------------------- |
| `pnpm dev`    | Run development server    |
| `pnpm build`  | Build app for production  |
| `pnpm start`  | Start production server   |
| `pnpm lint`   | Run ESLint checks         |
| `pnpm format` | Format code with Prettier |

---

## Article Link

Down below is a link to an article , have fun reading