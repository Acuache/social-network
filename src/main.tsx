import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SocialApp from './SocialApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocialApp />
  </StrictMode>
)
