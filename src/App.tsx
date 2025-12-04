import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { routes } from '@/routing/routes';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

const router = createBrowserRouter(routes);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
