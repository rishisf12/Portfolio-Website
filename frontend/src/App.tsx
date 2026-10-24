import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useIsMobile } from "./hooks/useIsMobile";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import MobileHome from "./pages/MobileHome";
import ProjectDetail from "./pages/ProjectDetail";
import MobileProjectDetail from "./pages/MobileProjectDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./components/admin/Login";

function Shell({
  user,
  isAuthenticated,
}: {
  user: { username: string } | null;
  isAuthenticated: boolean;
}) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const showChrome = !isMobile || isAdmin;

  return (
    <>
      {showChrome && <Navbar user={user} />}
      <Routes>
        <Route path="/" element={isMobile ? <MobileHome /> : <Home />} />
        <Route
          path="/project/:slug"
          element={isMobile ? <MobileProjectDetail /> : <ProjectDetail />}
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showChrome && <Footer />}
    </>
  );
}

function App() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Shell user={user} isAuthenticated={isAuthenticated} />
    </BrowserRouter>
  );
}

export default App;
