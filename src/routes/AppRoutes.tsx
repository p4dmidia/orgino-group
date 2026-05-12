import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import HowItWorks from "../pages/Public/HowItWorks";
import AboutUs from "../pages/Public/AboutUs";
import PublicBenefits from "../pages/Public/Benefits";

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
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/saques" element={<AdminWithdrawals />} />
        <Route path="/admin/moderacao" element={<AdminModeration />} />
        <Route path="/admin/cursos" element={<AdminCourses />} />
        <Route path="/admin/config" element={<AdminSettings />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/videos" element={<VideoFeed />} />
        <Route path="/videos/upload" element={<VideoUpload />} />
        <Route path="/rede" element={<NetworkMatrix />} />
        <Route path="/financeiro" element={<FinancialStatement />} />
        <Route path="/cursos" element={<CourseCatalog />} />
        <Route path="/cursos/detalhes/:id" element={<CourseDetail />} />
        <Route path="/cursos/player/:id" element={<CoursePlayer />} />
        <Route path="/cursos/produtor" element={<ProducerDashboard />} />
        <Route path="/beneficios-membros" element={<Partners />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
