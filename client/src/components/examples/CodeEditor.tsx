import CodeEditor from '../CodeEditor';

// todo: remove mock functionality 
const mockFiles = [
  {
    name: "App.tsx",
    path: "/client/src/App.tsx", 
    language: "tsx",
    content: `import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}`
  },
  {
    name: "index.css",
    path: "/client/src/index.css",
    language: "css", 
    content: `:root {
  --background: 0 0% 98%;
  --foreground: 0 0% 8%;
  --primary: 0 85% 45%;
}

body {
  font-family: Inter, sans-serif;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}`
  },
  {
    name: "tailwind.config.ts",
    path: "/tailwind.config.ts",
    language: "typescript",
    content: `import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
      }
    }
  }
} satisfies Config;`
  }
];

export default function CodeEditorExample() {
  return (
    <div className="p-4 h-screen">
      <CodeEditor 
        files={mockFiles}
        onSaveFile={(file) => console.log('Save file:', file.name)}
        onPreview={() => console.log('Preview triggered')}
      />
    </div>
  );
}