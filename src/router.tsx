import { createBrowserRouter, Navigate } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import DocumentUpload from './pages/DocumentUpload';
import Profile from './pages/Profile';
import LenderSelection from './components/Onboarding/LenderSelection';
import { UserDetailsPage } from './components/Onboarding/UserDetails';
import AddressSearch from './components/Onboarding/AddressSearch';
import ContactDetails from './components/Onboarding/ContactDetails';
import SignatureStep from './components/Onboarding/SignatureStep';
import SearchingAgreements from './components/Onboarding/Searching';
import OtpVerify from './components/Onboarding/OtpVerify';
import MissingAgreements from './components/Onboarding/MissingAgreements';
import NotFound from './pages/NotFound';
import ReferPage from './pages/Refer';
import PreviousAddresses from './components/Onboarding/PreviousAddresses';
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LenderSelection /> },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'lenderselection', element: <LenderSelection /> },
          { path: 'userdetails', element: <UserDetailsPage /> },
          { path: 'addresssearch', element: <AddressSearch /> },
          { path: 'contactdetails', element: <ContactDetails /> },
          { path: 'signature', element: <SignatureStep /> },
          { path: 'searching', element: <SearchingAgreements /> },
          { path: 'otpverify', element: <OtpVerify /> },
          { path: 'missingagreements', element: <MissingAgreements /> },
          { path: 'previousaddresses', element: <PreviousAddresses /> },
        ],
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'profile', element: <Profile /> },
          { path: 'documentupload', element: <DocumentUpload /> },
          { path: 'refer', element: <ReferPage /> },
        ],
      },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);

export default router;
