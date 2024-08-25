import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import { PrivateRoute } from './privateRoute';
import Layout from './layout/layout';
import CriarLiga from './pages/liga/criar-liga/CriarLiga';
import MinhasLigas from './pages/liga/minhas-ligas/minhasLigas';
import GerenciarLiga from './pages/liga/gerenciar-liga/gerenciarLiga';
import GerenciarClubes from './pages/liga/gerenciar-clube/gerenciarClubes';
import Tabela from './pages/liga/tabela/tabela';
import GerenciarJogos from './pages/liga/gerenciar-jogos/gerenciarJogos';
import PageNotFound from './pages/pageNotFound/pageNotFound';
import Estatisticas from './pages/liga/estatisticas/estatisticas';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import ViewStats from './pages/liga/view-stats/view-stats';
import UserLayout from './layout/UserLayout';

function MainRoutes() {

    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/cadastre-se' element={<Cadastro />} />

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

            <Route path='/criar-liga' element={
                <PrivateRoute>
                    <Layout>
                        <CriarLiga />
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

            <Route path='/minhas-ligas/:id' element={
                <PrivateRoute>
                    <Layout>
                        <GerenciarLiga />
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
