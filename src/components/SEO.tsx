import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'blog';
  canonical?: string;
  author?: string;
  language?: string;
}

const defaults = {
  title: 'MySideChef - Your AI-Powered Kitchen Assistant',
  description: 'Transform your cooking experience with AI-powered meal planning, instant recipe suggestions, and personalized healthy alternatives.',
  url: 'https://mysidechef.com',
  author: 'MySideChef Team',
  language: 'en_US'
};

export function SEO({ 
  title = defaults.title,
  description = defaults.description,
  keywords = 'meal planning, recipe finder, healthy cooking, AI kitchen assistant, meal suggestions, cooking tips, personalized recipes, diet planning',
  image = '/og-image-square-large.jpg',
  type = 'website' as const,
  canonical,
  author = defaults.author,
  language = defaults.language
}: SEOProps) {
  const fullTitle = title === defaults.title ? title : `${title}`;
  const shortTitle = fullTitle.replace(' - Your AI-Powered Kitchen Assistant', ' - AI Kitchen Assistant');
  const shortDescription = description.split('.')[0];
  const url = canonical || defaults.url;
  const fullImage = image.startsWith('http') ? image : `${defaults.url}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language.split('_')[0]} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Essential Open Graph Tags for WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={shortTitle} />
      <meta property="og:description" content={shortDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="600" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content="MySideChef" />
      <meta property="og:locale" content={language} />

      {/* Additional Social Media Tags */}
      <meta property="og:image:secure_url" content={fullImage} />
      <meta property="og:image:alt" content={shortTitle} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@mysidechef" />
      <meta name="twitter:title" content={shortTitle} />
      <meta name="twitter:description" content={shortDescription} />
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
} 