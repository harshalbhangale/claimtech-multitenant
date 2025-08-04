import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { TenantProvider } from './contexts/TenantContext'
import { QueryProvider } from './hooks/providers/QueryProvider'
import router from './router'
import { Provider } from "@/components/ui/provider"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider>
        <QueryProvider>
          <TenantProvider>
            <RouterProvider router={router} />
          </TenantProvider>
        </QueryProvider>
      </Provider>
  </StrictMode>,
)
