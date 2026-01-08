import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, type = 'website', schema = null }) => {

    const siteTitle = "TS Hair Enterprise";
    const currentUrl = url || window.location.href;
    const defaultImage = "https://tshairenterprise.com/logo.webp";
    const defaultDescription = "TS Hair Enterprise (Est. 2016) is the best human hair manufacturer & wholesaler in Beldanga, Murshidabad. We export premium Bulk Hair, Remy Hair, and Temple Hair globally.";

    // Default Keywords if none provided
    const defaultKeywords = [
        "Best human hair exporter in Beldanga",
        "Best human hair manufactures in beldanga",
        "best human hair supplier in beldanga",
        "best human hair wholeseller in beldanga",
        "Best Bulk Hair supplier in Beldanga",
        "Best Curly Hair supplier in Beldanga",
        "Best Blonde Hair supplier in Beldanga",
        "Best Human Wig Hair supplier in Beldanga",
        "Best Frontal Hair supplier in Beldanga",
        "Best I-Tip Extension supplier in Beldanga",
        "Best Baby Curly Extension supplier in Beldanga",
        "Best Single Doner Extension supplier in Beldanga",
        "Best Double Doner Extension supplier in Beldanga",
        "Best Weft Extension supplier in Beldanga",
        "Best Double Drawn Extension supplier in Beldanga",
        "Best Clouser Extension supplier in Beldanga",
        "Best Remy Extension supplier in Beldanga",
        "Best Temple Hair Extension supplier in Beldanga",
        "Best Guti Hair Extension supplier in Beldanga",
        "Raw Indian Hair",
        "Temple Hair India"
    ].join(", ");

    // --- 1. HOME / LOCAL BUSINESS SCHEMA (For Root Domain) ---
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "TS Hair Enterprise",
        "alternateName": "TS Hair Beldanga",
        "image": [
            "https://tshairenterprise.com/logo.webp"
        ],
        "url": "https://tshairenterprise.com",
        "telephone": "+917047163936",
        "email": "support@tshairenterprise.com",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Begun bari",
            "addressLocality": "Beldanga",
            "addressRegion": "Murshidabad, West Bengal",
            "postalCode": "742133",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 23.9333,
            "longitude": 88.2500
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "09:00",
            "closes": "22:00"
        },
        "sameAs": [
            "https://www.facebook.com/tshairenterprise",
            "https://www.instagram.com/tshairenterprise"
        ],
        // AI Knowledge Graph Signals
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 23.9333, "longitude": 88.2500 },
            "geoRadius": "50000"
        },
        "knowsAbout": [
            "Human Hair Export",
            "Bulk Hair Manufacturing",
            "Machine Weft Extensions",
            "Raw Indian Temple Hair"
        ]
    };

    // --- 2. SELECT DYNAMIC SCHEMA ---
    let finalSchema = schema;

    // Agar Product Page hai aur specific schema pass nahi hua, toh basic product schema banayein (Fallback)
    if (!finalSchema && type === 'product') {
        finalSchema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": title,
            "image": image || defaultImage,
            "description": description || defaultDescription,
            "brand": {
                "@type": "Brand",
                "name": "TS Hair Enterprise"
            },
            "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "price": "0", // Default, should be overridden by prop
                "availability": "https://schema.org/InStock"
            }
        };
    }

    // Default to LocalBusiness only on Home Page
    if (!finalSchema && type === 'website') {
        finalSchema = localBusinessSchema;
    }

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{title ? `${title} | ${siteTitle}` : `Best Human Hair Exporter in Beldanga | ${siteTitle}`}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <link rel="canonical" href={currentUrl} />
            <meta name="author" content="MD Sabir Ahamed" />
            <meta name="robots" content="index, follow" />

            {/* Open Graph */}
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content={type} />

            {/* JSON-LD Schema */}
            {finalSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(finalSchema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;