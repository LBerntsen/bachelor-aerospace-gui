import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./state/store.ts";
import SignalRProvider from "./state/signalr/SignalRProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <SignalRProvider/>
          <App />
      </Provider>
  </StrictMode>,
)
