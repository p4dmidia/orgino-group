import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import DashboardOverview from "../pages/Dashboard/Overview";
import VideoFeed from "../pages/Videos/Feed";
import NetworkMatrix from "../pages/Network/Matrix";
import FinancialStatement from "../pages/Financial/Statement";
import CourseCatalog from "../pages/Courses/Catalog";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Partners from "../pages/Benefits/Partners";
import CoursePlayer from "../pages/Courses/Player";
import ProducerDashboard from "../pages/Courses/Producer";
import CourseDetail from "../pages/Courses/CourseDetail";
import VideoUpload from "../pages/Videos/Upload";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminLogin from "../pages/Admin/Login";
import AdminUsers from "../pages/Admin/Users";
import AdminWithdrawals from "../pages/Admin/Withdrawals";
import AdminModeration from "../pages/Admin/Moderation";
import AdminCourses from "../pages/Admin/Courses";
import AdminSettings from "../pages/Admin/Settings";
import AdminVideos from "../pages/Admin/Videos";
import AdminPartners from "../pages/Admin/Partners";
import HowItWorks from "../pages/Public/HowItWorks";
import AboutUs from "../pages/Public/AboutUs";
import PublicBenefits from "../pages/Public/Benefits";
import CareerPlan from "../pages/Network/CareerPlan";
import { ProtectedRoute } from "../components/ProtectedRoute";
import PublicVideo from "../pages/Public/PublicVideo";
import AffiliateDashboard from "../pages/Dashboard/AffiliateDashboard";

function ReferralRedirect() {
  const { sponsorCode } = useParams();
  
  // List of base routes that are public/static to prevent conflicts
  const knownPaths = [
    "como-funciona", "sobre", "beneficios", "auth", "admin", "dashboard", 
    "videos", "rede", "financeiro", "carreira", "cursos", "beneficios-membros",
    "v"
  ];
  
  if (sponsorCode && knownPaths.includes(sponsorCode.split('/')[0])) {
    return <Navigate to="/" replace />;
  }
  
  return <Navigate to={`/auth/register?ref=${sponsorCode}`} replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/como-funciona" element={<HowItWorks />} />
        <Route path="/sobre" element={<AboutUs />} />
        <Route path="/beneficios" element={<PublicBenefits />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/v/:id" element={<PublicVideo />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/usuarios" element={<ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/saques" element={<ProtectedRoute adminOnly={true}><AdminWithdrawals /></ProtectedRoute>} />
        <Route path="/admin/moderacao" element={<ProtectedRoute adminOnly={true}><AdminModeration /></ProtectedRoute>} />
        <Route path="/admin/cursos" element={<ProtectedRoute adminOnly={true}><AdminCourses /></ProtectedRoute>} />
        <Route path="/admin/config" element={<ProtectedRoute adminOnly={true}><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/videos" element={<ProtectedRoute adminOnly={true}><AdminVideos /></ProtectedRoute>} />
        <Route path="/admin/parceiros" element={<ProtectedRoute adminOnly={true}><AdminPartners /></ProtectedRoute>} />
        
        {/* User Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
        <Route path="/dashboard/afiliado" element={<ProtectedRoute><AffiliateDashboard /></ProtectedRoute>} />
        <Route path="/videos" element={<ProtectedRoute><VideoFeed /></ProtectedRoute>} />
        <Route path="/videos/upload" element={<ProtectedRoute><VideoUpload /></ProtectedRoute>} />
        <Route path="/rede" element={<ProtectedRoute><NetworkMatrix /></ProtectedRoute>} />
        <Route path="/financeiro" element={<ProtectedRoute><FinancialStatement /></ProtectedRoute>} />
        <Route path="/carreira" element={<ProtectedRoute><CareerPlan /></ProtectedRoute>} />
        <Route path="/cursos" element={<ProtectedRoute><CourseCatalog /></ProtectedRoute>} />
        <Route path="/cursos/detalhes/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/cursos/player/:id" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
        <Route path="/cursos/produtor" element={<ProtectedRoute><ProducerDashboard /></ProtectedRoute>} />
        <Route path="/beneficios-membros" element={<ProtectedRoute><Partners /></ProtectedRoute>} />

        {/* Dynamic Referral Redirect Route */}
        <Route path="/:sponsorCode" element={<ReferralRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
