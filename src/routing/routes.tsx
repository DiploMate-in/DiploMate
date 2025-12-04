import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { RequireAuth, RequireAdmin } from './guards';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Lazy load pages
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage })),
);
const NotesPage = lazy(() =>
  import('@/pages/NotesPage').then((module) => ({ default: module.NotesPage })),
);
const ProjectsPage = lazy(() =>
  import('@/pages/ProjectsPage').then((module) => ({
    default: module.default || module.ProjectsPage,
  })),
); // Handle default or named export
const DepartmentStudyMaterials = lazy(() => import('@/pages/DepartmentStudyMaterials'));
const StudyMaterialPage = lazy(() => import('@/pages/StudyMaterialPage'));
const SubjectContentPage = lazy(() => import('@/pages/SubjectContentPage'));
const ContentDetail = lazy(() =>
  import('@/pages/ContentDetail').then((module) => ({ default: module.ContentDetail })),
);
const Dashboard = lazy(() =>
  import('@/pages/Dashboard').then((module) => ({ default: module.Dashboard })),
);
const Wishlist = lazy(() =>
  import('@/pages/Wishlist').then((module) => ({ default: module.Wishlist })),
);
const Support = lazy(() =>
  import('@/pages/Support').then((module) => ({ default: module.Support })),
);
const HowToBuy = lazy(() =>
  import('@/pages/HowToBuy').then((module) => ({ default: module.HowToBuy })),
);
const PaymentHelp = lazy(() =>
  import('@/pages/PaymentHelp').then((module) => ({ default: module.PaymentHelp })),
);
const Login = lazy(() => import('@/pages/Login').then((module) => ({ default: module.Login })));
const Signup = lazy(() => import('@/pages/Signup').then((module) => ({ default: module.Signup })));
const FAQsPage = lazy(() =>
  import('@/pages/FAQsPage').then((module) => ({ default: module.FAQsPage })),
);
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/PrivacyPolicyPage').then((module) => ({ default: module.PrivacyPolicyPage })),
);
const TermsConditionsPage = lazy(() =>
  import('@/pages/TermsConditionsPage').then((module) => ({ default: module.TermsConditionsPage })),
);
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin Pages
const AdminLogin = lazy(() =>
  import('@/pages/admin/AdminLogin').then((module) => ({ default: module.AdminLogin })),
);
const AdminDashboard = lazy(() =>
  import('@/pages/admin/AdminDashboard').then((module) => ({ default: module.AdminDashboard })),
);
const AdminContent = lazy(() =>
  import('@/pages/admin/AdminContent').then((module) => ({ default: module.AdminContent })),
);
const AdminSubjects = lazy(() =>
  import('@/pages/admin/AdminSubjects').then((module) => ({ default: module.AdminSubjects })),
);
const AdminOrders = lazy(() =>
  import('@/pages/admin/AdminOrders').then((module) => ({ default: module.AdminOrders })),
);
const AdminUsers = lazy(() =>
  import('@/pages/admin/AdminUsers').then((module) => ({ default: module.AdminUsers })),
);
const AdminCoupons = lazy(() =>
  import('@/pages/admin/AdminCoupons').then((module) => ({ default: module.AdminCoupons })),
);
const AdminSupport = lazy(() =>
  import('@/pages/admin/AdminSupport').then((module) => ({ default: module.AdminSupport })),
);
const AdminSettings = lazy(() =>
  import('@/pages/admin/AdminSettings').then((module) => ({ default: module.AdminSettings })),
);

export const routes: RouteObject[] = [
  // Public Routes
  { path: '/', element: <HomePage /> },
  { path: '/notes', element: <NotesPage /> },

  // Consolidated Project Routes
  { path: '/projects/:projectType', element: <ProjectsPage /> },

  { path: '/department/:deptCode', element: <DepartmentStudyMaterials /> },
  { path: '/department/:deptCode/:materialType', element: <StudyMaterialPage /> },
  { path: '/department/:deptCode/:materialType/:subjectId', element: <SubjectContentPage /> },
  { path: '/content/:id', element: <ContentDetail /> },

  { path: '/support', element: <Support /> },
  { path: '/how-to-buy', element: <HowToBuy /> },
  { path: '/payment-help', element: <PaymentHelp /> },
  { path: '/faqs', element: <FAQsPage /> },
  { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
  { path: '/terms-conditions', element: <TermsConditionsPage /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },

  // Protected User Routes
  {
    element: <RequireAuth />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/wishlist', element: <Wishlist /> },
    ],
  },

  // Admin Routes
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: <RequireAdmin />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'content/:type', element: <AdminContent /> },
          { path: 'subjects', element: <AdminSubjects /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'coupons', element: <AdminCoupons /> },
          { path: 'support', element: <AdminSupport /> },
          { path: 'settings', element: <AdminSettings /> },
        ],
      },
    ],
  },

  // 404
  { path: '*', element: <NotFound /> },
];
