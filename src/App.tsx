import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DepartmentStudyMaterials from "./pages/DepartmentStudyMaterials";
import StudyMaterialPage from "./pages/StudyMaterialPage";
import SubjectContentPage from "./pages/SubjectContentPage";
import ProjectsPage from "./pages/ProjectsPage";
import { AdminSubjects } from "./pages/admin/AdminSubjects";
import { AppProvider } from "@/contexts/AppContext";
import { HomePage } from "@/pages/HomePage";
import { NotesPage } from "@/pages/NotesPage";
import { ContentDetail } from "@/pages/ContentDetail";
import { Dashboard } from "@/pages/Dashboard";
import { Wishlist } from "@/pages/Wishlist";
import { Support } from "@/pages/Support";
import { HowToBuy } from "@/pages/HowToBuy";
import { PaymentHelp } from "@/pages/PaymentHelp";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { FAQsPage } from "@/pages/FAQsPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsConditionsPage } from "@/pages/TermsConditionsPage";
import NotFound from "./pages/NotFound";

// Admin imports
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminContent } from "@/pages/admin/AdminContent";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminCoupons } from "@/pages/admin/AdminCoupons";
import { AdminSupport } from "@/pages/admin/AdminSupport";
import { AdminSettings } from "@/pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            {/* Student/Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/microprojects" element={<ProjectsPage />} />
            <Route path="/capstone-projects" element={<ProjectsPage />} />
            <Route path="/custom-build" element={<ProjectsPage />} />
            <Route path="/department/:deptCode" element={<DepartmentStudyMaterials />} />
            <Route path="/department/:deptCode/:materialType" element={<StudyMaterialPage />} />
            <Route path="/department/:deptCode/:materialType/:subjectId" element={<SubjectContentPage />} />
            <Route path="/projects/:projectType" element={<ProjectsPage />} />
            <Route path="/content/:id" element={<ContentDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/support" element={<Support />} />
            <Route path="/how-to-buy" element={<HowToBuy />} />
            <Route path="/payment-help" element={<PaymentHelp />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="content/:type" element={<AdminContent />} />
              <Route path="subjects" element={<AdminSubjects />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
