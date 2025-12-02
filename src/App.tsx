import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { HomePage } from "@/pages/HomePage";
import { NotesPage } from "@/pages/NotesPage";
import { MicroprojectsPage } from "@/pages/MicroprojectsPage";
import { CapstoneProjectsPage } from "@/pages/CapstoneProjectsPage";
import { DepartmentPage } from "@/pages/DepartmentPage";
import { ContentDetail } from "@/pages/ContentDetail";
import { Dashboard } from "@/pages/Dashboard";
import { Wishlist } from "@/pages/Wishlist";
import { Support } from "@/pages/Support";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { FAQsPage } from "@/pages/FAQsPage";
import { CustomBuildPage } from "@/pages/CustomBuildPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsConditionsPage } from "@/pages/TermsConditionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/microprojects" element={<MicroprojectsPage />} />
            <Route path="/capstone-projects" element={<CapstoneProjectsPage />} />
            <Route path="/department/:code" element={<DepartmentPage />} />
            <Route path="/content/:id" element={<ContentDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/support" element={<Support />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/custom-build" element={<CustomBuildPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
