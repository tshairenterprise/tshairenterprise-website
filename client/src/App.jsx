import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Public Pages & Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductSection from './components/ProductSection';
import ProductDetails from './components/ProductDetails';
import MostSelling from './components/MostSelling';
import ClientReviews from './components/ClientReviews';
import ReviewUs from './pages/ReviewUs';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import SearchPage from './pages/SearchPage';
import SEO from './components/SEO';
import Gallery from './pages/Gallery';

// Blog Imports
import BlogSection from './components/BlogSection';
import BlogsPage from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';

// Admin Pages & Layouts
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Faqs from './pages/admin/Faqs';
import Reviews from './pages/admin/Reviews';
import Settings from './pages/admin/Settings';
import Quotes from './pages/admin/Quotes';
import BlogsAdmin from './pages/admin/Blogs';
import Messages from './pages/admin/Messages';
import AdminGallery from './pages/admin/AdminGallery';
import GalleryPreview from './components/GalleryPreview';

// --- LAYOUTS ---

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      {/* ✅ FIX: Removed 'pt-20'. 
         Ab Hero section ka background directly top (0px) se start hoga 
         aur Navbar ke piche beautifully blend karega.
         Components (Hero, Shop etc.) apni spacing khud handle karenge.
      */}
      <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

// Home Page Component
const Home = () => (
  <>
    {/* Injecting Homepage SEO Strategy (As per your request, No Changes) */}
    <SEO
      title="Best Human Hair Exporter in Beldanga | Manufacturer & Supplier"
      description="Direct from factory in Beldanga, Murshidabad. TS Hair Enterprise exports premium Bulk, Weft, and Temple hair globally. Wholesale prices for salons & distributors."
      keywords="Best human hair exporter in Beldanga, Human hair manufacturer Beldanga, Hair supplier Murshidabad, Raw Indian hair factory West Bengal, Bulk hair wholesale India"
    />

    <Hero />
    <ProductSection />
    <MostSelling />
    <ClientReviews />
    <FaqSection />
    <GalleryPreview />
    <BlogSection />
    <ContactSection />
  </>
);

function App() {
  return (
    <Routes>

      {/* --- PUBLIC ROUTES (With Navbar/Footer) --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Product & Reviews */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/review-us" element={<ReviewUs />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Blog ROUTES */}
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />

        {/* Gallery ROUTES */}
        <Route path="/gallery" element={<Gallery />} />
      </Route>

      {/* --- AUTH ROUTES (Standalone) --- */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/forgotpassword" element={<Forgot />} />
      <Route path="/resetpassword/:resetToken" element={<Reset />} />

      {/* --- ADMIN ROUTES --- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="faqs" element={<Faqs />} />
        <Route path="blogs" element={<BlogsAdmin />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
      </Route>

    </Routes>
  );
}

export default App;