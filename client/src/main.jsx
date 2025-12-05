import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Omarchy } from 'omarchy'
import { MousePlugin } from '@omarchy/mouse-plugin'
import { ScrollPlugin } from '@omarchy/scroll-plugin'
import './index.css'
import App from './App.jsx'

const omarchy = new Omarchy({
  plugins: [
    new MousePlugin(),
    new ScrollPlugin()
  ]
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
