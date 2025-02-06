import AppRoutes from "./routes/customer";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;

// api key XRi8QqZ4U85UqVJAniWoq67NG5CVFpzq

