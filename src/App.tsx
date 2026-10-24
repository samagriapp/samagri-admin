import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './router';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster richColors closeButton position="top-right" />
    </AuthProvider>
  );
}

export default App;
