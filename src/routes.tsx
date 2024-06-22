import {Routes, Route} from 'react-router-dom';
import Login from './pages/login/login';
import Cadastro from './pages/cadastro/cadastro';

function MainRoutes(){
    return(
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/cadastre-se' element={<Cadastro />} />
        </Routes>
    )
}

export default MainRoutes;
