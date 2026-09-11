import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { RouterProvider } from 'react-router-dom'
import { ColorModeProvider } from '@/shared/themes/color-mode-context'
import { router } from './router'
import './App.css'

function App() {
  return (
    <ColorModeProvider>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </ColorModeProvider>
  )
}

export default App
