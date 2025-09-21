import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StaticModeNotice } from "@/components/StaticModeNotice";
import AuthApp from "./components/AuthApp";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StaticModeNotice />
        <AuthApp />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}