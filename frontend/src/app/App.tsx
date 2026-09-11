import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { RouterProvider } from 'react-router-dom'
import { ColorModeProvider } from '@/shared/themes/color-mode-context'
import { SidebarBehaviorProvider } from '@/shared/themes/sidebar-behavior-context'
import { router } from './router'
import './App.css'

function App() {
  return (
    <ColorModeProvider>
      <SidebarBehaviorProvider>
        <RouterProvider router={router} />
        <Analytics />
        <SpeedInsights />
      </SidebarBehaviorProvider>
    </ColorModeProvider>
  )
}

export default App
