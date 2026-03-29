# AI-Agent-Builder

## 🎯 What this project is about
AI-Agent-Builder is a comprehensive platform designed to construct, manage, and interact with AI agents seamlessly. It provides a robust interface combined with a powerful backend to give developers and users the tools they need to define agent behaviors, maintain conversational states, and orchestrate complex AI interactions.

## 🚀 What it does
- **Agent Construction**: Build highly capable AI agents tailored to specific tasks.
- **Real-Time Database**: Uses Convex for real-time state management, chat history, and configuration storage.
- **Authentication**: Secured end-to-end user authentication and management powered by Clerk.
- **Modern UI/UX**: Built with Next.js App Router, Tailwind CSS, and Radix UI components for an accessible and visually appealing interface.
- **AI Integration**: Deep integration with OpenAI's models and the `@openai/agents` SDK for executing advanced reasoning workflows.

## 📁 Folder Structure
- `app/` - The core Next.js application using the App Router architecture.
- `components/` - Reusable UI components (buttons, dialogs, forms, layout elements).
- `convex/` - Backend logic, database schemas, and serverless queries/mutations powered by Convex.
- `context/` - React context providers for global state management.
- `hooks/` - Custom React hooks emphasizing abstraction and logic reuse.
- `lib/` - Shared utility functions and configuration helpers.
- `types/` - Shared TypeScript definitions to maintain strict type safety across the stack.
- `config/` - Application-wide configuration parameters and settings.
- `public/` - Static assets, images, and icons.

## ⚙️ Requirements
To run this project locally, ensure you have the following installed:
- **Node.js**: Version `20.x` or later.
- **Package Manager**: npm, yarn, or pnpm.
- **API Keys**: 
  - A [Clerk](https://clerk.com/) account for authentication keys.
  - A [Convex](https://www.convex.dev/) account for the backend environment.
  - An [OpenAI](https://openai.com/) API key for AI capabilities.

## 🚨 Important Stuff
1. **Environment Variables**: Make sure to set up your `.env.local` file with the necessary credentials (e.g., `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, and `OPENAI_API_KEY`) before running the application.
2. **Convex Backend**: The backend relies entirely on Convex. You must run the Convex development server (`npx convex dev`) in tandem with the Next.js frontend to ensure data layers sync appropriately.
3. **Dependencies**: Some peer dependencies mandate the use of the `--legacy-peer-deps` flag during installation (e.g., when resolving strict `zod` versions against Next.js and external packages).

---
*Built with ❤️ using Next.js, Convex, Clerk, and OpenAI.*
