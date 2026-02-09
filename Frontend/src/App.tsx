import Testing from "./state/telemetry/testing.tsx";
import WebSocketProvider from "./state/websocket/WebSocketProvider.tsx";
import TestChart from "./components/TestChart.tsx";
import Input from "./components/Input.tsx";

import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from "./pages/Home.tsx";
import { Layout } from "./Layout.tsx";
import { Telemetry } from "./pages/telemetry.tsx";


export default function App() {
    return (
        <>
        <Router>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/telemetry' element={<Telemetry/>}/>
                </Route>
            </Routes>
        </Router>
        </>
    );
}
