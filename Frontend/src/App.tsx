import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from "./Layout.tsx";
import Recovery from "./pages/recovery.tsx";
import Home from "./pages/home.tsx";
import Propulsion from "./pages/propulsion.tsx";

export default function App() {
    return (
        <>
        <Router>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/propulsion' element={<Propulsion/>}/>
                    <Route path='/recovery' element={<Recovery/>}/>
                </Route>
            </Routes>
        </Router>
        </>
    );
}
