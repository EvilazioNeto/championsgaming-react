import ReactDOM from 'react-dom/client'
import './styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import MainRoutes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <MainRoutes />
      <ToastContainer />
    </BrowserRouter>
  </AuthProvider>

)
