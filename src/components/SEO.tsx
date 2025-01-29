import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title = 'SousChef - Share & Discover Recipes with a Global Community',
  description = 'Join a vibrant community of home chefs. Share your recipes, get inspired by others, and enhance your cooking with AI-powered features.',
  keywords = ['recipe sharing', 'food community', 'home chefs', 'cooking platform', 'social recipes', 'AI cooking assistant'],
  image = '/og-image.jpg',
  url = 'https://sous-chef.in',
  type = 'website'
}: SEOProps) {
  const siteTitle = title.includes('SousChef') ? title : `${title} | SousChef`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SousChef" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
} 