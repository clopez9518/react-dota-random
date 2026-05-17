import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { DotaRandomApp } from './DotaRandomApp'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DotaRandomApp />
  </StrictMode>,
)
