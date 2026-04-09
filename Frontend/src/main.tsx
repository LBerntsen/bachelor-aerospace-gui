import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./state/store.ts";
import SignalRProvider from "./state/signalr/SignalRProvider.tsx";
import SponsorDataProvider from "./state/sponsor/SponsorDataProvider.tsx";
import {isOperator} from "./state/utility.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          {isOperator() ? <SignalRProvider/> : <SponsorDataProvider/>}
          <App />
      </Provider>
  </StrictMode>,
)
