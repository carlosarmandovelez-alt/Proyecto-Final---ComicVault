// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComicProvider } from './context/ComicContext';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <AuthProvider>
            <ComicProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ComicProvider>
        </AuthProvider>
    );
}

export default App;