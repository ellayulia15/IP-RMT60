import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import LandingPage from "./pages/LandingPages";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PackageList from "./pages/PackageList";
import PackageDetail from "./pages/PackageDetail";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProfilePage from './pages/ProfilePage';

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/packages" element={<PackageList />} />
            <Route path="/packages/:id" element={<PackageDetail />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
