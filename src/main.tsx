import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { TenantProvider } from './contexts/TenantContext'
import router from './router'
import { Provider } from "@/components/ui/provider"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider>
        <TenantProvider>
          <RouterProvider router={router} />
        </TenantProvider>
      </Provider>
  </StrictMode>,
)
