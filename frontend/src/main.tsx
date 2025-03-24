import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StateContextProvider } from './lib/state/context.tsx'
import { ThemeProvider } from "@material-tailwind/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </ThemeProvider>
  </StrictMode>,
)
