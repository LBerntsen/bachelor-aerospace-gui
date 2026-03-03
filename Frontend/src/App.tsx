import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from "./pages/home.tsx";
import { Layout } from "./Layout.tsx";
import { Propulsion } from "./pages/propulsion.tsx";
import { Recovery } from './pages/recovery.tsx';

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
