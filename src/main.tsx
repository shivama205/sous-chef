import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/providers/AuthProvider"
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
