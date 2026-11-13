import { createRoot } from "react-dom/client"
import { shadcn } from "@clerk/themes"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { ClerkProvider } from "@clerk/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HashRouter } from "react-router-dom"
const queryClient = new QueryClient()
createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ClerkProvider
            publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
            appearance={{
              theme: shadcn,
              variables: { colorModalBackdrop: "rgba(0, 0, 0, 0.5)" },
            }}
          >
            <App />
            <Toaster />
          </ClerkProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HashRouter>
)
