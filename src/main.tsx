import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { MemoryPage } from '@/pages/MemoryPage'
import { CheckpointPage } from '@/pages/CheckpointPage'
import { QueryPage } from '@/pages/QueryPage'
import { AppLayout } from '@/components/layout/AppLayout'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout><HomePage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/memories",
    element: <AppLayout><MemoryPage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/checkpoints",
    element: <AppLayout><CheckpointPage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/query",
    element: <AppLayout><QueryPage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)