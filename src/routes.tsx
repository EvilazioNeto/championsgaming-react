import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import { PrivateRoute } from './privateRoute';
import Layout from './layout/layout';
import MinhasLigas from './pages/liga/minhas-ligas/minhasLigas';
import GerenciarClubes from './pages/liga/gerenciar-clube/gerenciarClubes';
import Tabela from './pages/liga/tabela/tabela';
import GerenciarJogos from './pages/liga/gerenciar-jogos/gerenciarJogos';
import PageNotFound from './pages/pageNotFound/pageNotFound';
import Estatisticas from './pages/liga/estatisticas/estatisticas';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import ViewStats from './pages/liga/view-stats/view-stats';
import UserLayout from './layout/UserLayout';
import EsqueceuSenha from './pages/EsqueceuSenha/EsqueceuSenha';
import RedefinirSenha from './pages/EsqueceuSenha/RedefinirSenha';

function MainRoutes() {

    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/cadastre-se' element={<Cadastro />} />
            <Route path='/esqueceu-senha' element={<EsqueceuSenha />} />
            <Route path='/reset-password/:token' element={<RedefinirSenha />} />

            <Route path='/campeonato/:id' element={
                <UserLayout>
                    <ViewStats />
                </UserLayout>
            }
            />

            <Route path='/' element={
                <PrivateRoute>
                    <Layout>
                        <Home />
                    </Layout>
                </PrivateRoute>}
            />

            <Route path='/minhas-ligas' element={
                <PrivateRoute>
                    <Layout>
                        <MinhasLigas />
                    </Layout>
                </PrivateRoute>}
            />


            <Route path='/minhas-ligas/:id/clubes' element={
                <PrivateRoute>
                    <Layout>
                        <GerenciarClubes />
                    </Layout>
                </PrivateRoute>}
            />

            <Route path='/minhas-ligas/:id/tabela' element={
                <PrivateRoute>
                    <Layout>
                        <Tabela />
                    </Layout>
                </PrivateRoute>}
            />

            <Route path='/minhas-ligas/:id/jogos' element={
                <PrivateRoute>
                    <Layout>
                        <GerenciarJogos />
                    </Layout>
                </PrivateRoute>}
            />

            <Route path='/minhas-ligas/:id/estatisticas' element={
                <PrivateRoute>
                    <Layout>
                        <Estatisticas />
                    </Layout>
                </PrivateRoute>}
            />

            <Route path='*' element={
                <PrivateRoute>
                    <Layout>
                        <PageNotFound />
                    </Layout>
                </PrivateRoute>}
            />

        </Routes>
    )
}

export default MainRoutes;
