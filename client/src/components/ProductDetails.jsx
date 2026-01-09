import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "@/lib/axios";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from '../components/SEO';
import ProductInfo from './product/ProductInfo';
import ProductReviews from './product/ProductReviews';
import RelatedProducts from './product/RelatedProducts';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- GLOBAL STATES ---
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);

        // 1. Get User Info
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        setUserInfo(storedUser);

        // 2. Fetch Current Product
        const { data: currentProduct } = await api.get(`/products/${id}`);
        setProduct(currentProduct);

        // 3. Fetch All Products (for Related logic)
        const { data: allProds } = await api.get('/products');

        // 4. Filter Related Products (Same category, exclude current)
        const related = allProds
          .filter((p) => p.category === currentProduct.category && p._id !== currentProduct._id)
          .slice(0, 4);
        setRelatedProducts(related);

        // 5. Fetch Site Settings
        const { data: settings } = await api.get('/settings');
        setSiteSettings(settings);

        setLoading(false);

      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --- RENDER HELPERS ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-500">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 dark:text-slate-400 font-bold animate-pulse">Loading Product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-500">
        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/20 text-center">
          <h2 className="text-2xl font-extrabold text-red-600 dark:text-red-400 mb-2">Product Not Found</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6">The item you are looking for might have been removed.</p>
          <Button onClick={() => navigate('/shop')} variant="outline" className="rounded-full">
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  // --- SEO & SCHEMA GENERATION ---
  const minPrice = product?.variants?.length
    ? Math.min(...product.variants.map(v => Number(v.price)))
    : 0;

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const priceValidUntil = nextYear.toISOString().split('T')[0];

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description?.substring(0, 160) || "Premium Quality Human Hair from Beldanga.",
    "brand": { "@type": "Brand", "name": "TS Hair Enterprise" },
    "sku": product._id,
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "USD",
      "price": minPrice,
      "priceValidUntil": priceValidUntil,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "USD" },
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "d" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 7, "unitCode": "d" }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "US",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 5,
      "reviewCount": product.reviewCount || 1
    }
  };

  const seoTitle = `${product.name} - Best Manufacturer Price in Beldanga, India`;
  const seoDesc = `Buy ${product.name} directly from factory in Beldanga. 100% Raw Indian ${product.category}, single donor, unprocessed. Worldwide shipping available.`;
  const seoKeywords = `${product.name}, ${product.category} exporter India, Best human hair Beldanga, Raw hair supplier Murshidabad, ${product.name} wholesale price`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">

      {product && (
        <SEO
          title={seoTitle}
          description={seoDesc}
          keywords={seoKeywords}
          image={product.image}
          url={window.location.href}
          type="product"
          schema={productSchema}
        />
      )}

      {/* --- AMBIENT BACKGROUND BLOBS (Hero Consistent) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>

      {/* ✅ FIX: Increased top padding (pt-32) to clear Floating Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 relative z-10">

        {/* --- NAVIGATION --- */}
        <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 gap-2 text-gray-500 dark:text-slate-400 pl-2 pr-4 h-10"
          >
            <div className="p-1.5 bg-white dark:bg-slate-900 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
              <ArrowLeft className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-sm">Back to Collection</span>
          </Button>
        </div>

        {/* --- CONTENT STACK --- */}
        <div className="flex flex-col gap-24">

          {/* 1. Main Product Info */}
          <ProductInfo
            product={product}
            siteSettings={siteSettings}
            userInfo={userInfo}
          />

          {/* 2. Reviews Section */}
          <div className="relative border-t border-gray-100 dark:border-slate-800 pt-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-950 px-4 text-gray-300 dark:text-slate-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <ProductReviews
              product={product}
              userInfo={userInfo}
            />
          </div>

          {/* 3. Related Products */}
          <div className="border-t border-gray-100 dark:border-slate-800 pt-16">
            <RelatedProducts
              products={relatedProducts}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;