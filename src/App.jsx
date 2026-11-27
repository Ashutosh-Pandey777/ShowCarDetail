import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import AdminLogin from '@/pages/AdminLogin';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Browse from '@/pages/Browse';
import CarDetails from '@/pages/CarDetails';
import Compare from '@/pages/Compare';
import Brand from '@/pages/Brand';
import FindNewVehicles from '@/pages/FindNewVehicles';
import Finance from '@/pages/Finance';
import Admin from '@/pages/Admin';
import Contact from '@/pages/Contact';
import NewsReviews from '@/pages/NewsReviews';
import CompanyInfoPage from '@/pages/CompanyInfoPage';
import Bike from '@/pages/Bike/Bike';
import BikeCompare from '@/pages/Bike/BikeCompare';
import ElectricVehicle from '@/pages/ElectricVehicle/ElectricVehicle';
import CommercialVehicle from '@/pages/CommercialVehicle/CommercialVehicle';
import VehicleDiscovery from '@/pages/VehicleDiscovery';

const AuthenticatedApp = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route element={<ProtectedRoute requireAdmin unauthenticatedElement={<Navigate to="/admin/login" replace />} />}>
      <Route path="/admin" element={<Admin />} />
    </Route>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/car" element={<Home />} />
      <Route path="/bike" element={<Bike />} />
      <Route path="/compare/bikes" element={<BikeCompare />} />
      <Route path="/electric-vehicle" element={<ElectricVehicle />} />
      <Route path="/commercial-vehicle" element={<CommercialVehicle />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/news-reviews" element={<NewsReviews />} />
      <Route path="/about-us" element={<CompanyInfoPage />} />
      <Route path="/careers" element={<CompanyInfoPage />} />
      <Route path="/terms-and-conditions" element={<CompanyInfoPage />} />
      <Route path="/advertise" element={<CompanyInfoPage />} />
      <Route path="/car/:id" element={<CarDetails />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/brand/:slug" element={<Brand />} />
      <Route path="/vehicle-category/find-new-cars" element={<FindNewVehicles vehicle="Car" />} />
      <Route path="/vehicle-category/find-new-bikes" element={<FindNewVehicles vehicle="Bike" />} />
      <Route path="/vehicle-category/find-used-cars" element={<FindNewVehicles vehicle="Car" mode="Used" />} />
      <Route path="/vehicle-category/find-electric-cars" element={<FindNewVehicles vehicle="Car" mode="Electric" />} />
      <Route path="/vehicle-category/popular-bikes" element={<VehicleDiscovery vehicle="Bike" section="popular" />} />
      <Route path="/vehicle-category/upcoming-bikes" element={<VehicleDiscovery vehicle="Bike" section="upcoming" />} />
      <Route path="/vehicle-category/bikes-by-budget" element={<VehicleDiscovery vehicle="Bike" section="budget" />} />
      <Route path="/vehicle-category/bikes-by-brand" element={<VehicleDiscovery vehicle="Bike" section="brand" />} />
      <Route path="/vehicle-category/cars-by-budget" element={<VehicleDiscovery vehicle="Car" section="budget" />} />
      <Route path="/vehicle-category/cars-by-brand" element={<VehicleDiscovery vehicle="Car" section="brand" />} />
      <Route path="/vehicle-category/cars-by-body-type" element={<VehicleDiscovery vehicle="Car" section="body" />} />
      <Route path="/vehicle-category/cars-by-fuel-type" element={<VehicleDiscovery vehicle="Car" section="fuel" />} />
      <Route path="/vehicle-category/scooty" element={<VehicleDiscovery vehicle="Scooty" section="all" />} />
      <Route path="/vehicle-category/find-new-scooty" element={<VehicleDiscovery vehicle="Scooty" section="all" />} />
      <Route path="/vehicle-category/popular-scooty" element={<VehicleDiscovery vehicle="Scooty" section="popular" />} />
      <Route path="/vehicle-category/upcoming-scooty" element={<VehicleDiscovery vehicle="Scooty" section="upcoming" />} />
      <Route path="/vehicle-category/scooty-by-budget" element={<VehicleDiscovery vehicle="Scooty" section="budget" />} />
      <Route path="/vehicle-category/scooty-by-brand" element={<VehicleDiscovery vehicle="Scooty" section="brand" />} />
      <Route path="/emi" element={<Finance />} />
      <Route path="/contact" element={<Contact />} />
    </Route>
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}
export default App
