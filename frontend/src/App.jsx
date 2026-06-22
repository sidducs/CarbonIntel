import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
          <Navbar />
          <AppRoutes />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;