import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/Landing";
import Quiz from "@/pages/Quiz";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-[#8A7965] text-sm tracking-widest uppercase">
        Loading…
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}

function Shell() {
  const loc = useLocation();
  const hideNavbar = loc.pathname === "/";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App grain">
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-center" richColors closeButton />
          <Shell />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
