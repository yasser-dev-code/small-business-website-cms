import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import PublicLayout from './components/public/PublicLayout.jsx';
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import Services from './pages/public/Services.jsx';
import Menu from './pages/public/Menu.jsx';
import Blog from './pages/public/Blog.jsx';
import BlogDetail from './pages/public/BlogDetail.jsx';
import Contact from './pages/public/Contact.jsx';
import NotFound from './pages/public/NotFound.jsx';
import Login from './pages/admin/Login.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import HomepageEditor from './pages/admin/HomepageEditor.jsx';
import ServicesManager from './pages/admin/ServicesManager.jsx';
import BlogManager from './pages/admin/BlogManager.jsx';
import BlogEditor from './pages/admin/BlogEditor.jsx';
import MenuManager from './pages/admin/MenuManager.jsx';
import SettingsManager from './pages/admin/SettingsManager.jsx';
import MediaManager from './pages/admin/MediaManager.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="homepage" element={<HomepageEditor />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="blog" element={<BlogManager />} />
        <Route path="blog/new" element={<BlogEditor />} />
        <Route path="blog/:id/edit" element={<BlogEditor />} />
        <Route path="menu" element={<MenuManager />} />
        <Route path="settings" element={<SettingsManager />} />
        <Route path="media" element={<MediaManager />} />
      </Route>
    </Routes>
  );
}
