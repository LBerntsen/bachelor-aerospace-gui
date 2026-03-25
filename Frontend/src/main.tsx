import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./state/store.ts";
import SignalRProvider from "./state/signalr/SignalRProvider.tsx";
import SponsorDataProvider from "./state/sponsor/SponsorDataProvider.tsx";

const appMode = import.meta.env.VITE_APP_MODE;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          {appMode === "operator" ? <SignalRProvider/> : <SponsorDataProvider/>}
          <App />
      </Provider>
  </StrictMode>,
)
