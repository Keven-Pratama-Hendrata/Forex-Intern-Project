import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './app/App.jsx'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store.js'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster />
    </Provider>
  </StrictMode>,
)
