import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface MetaConfig {
  title: string;
  description: string;
  type?: string;
  image?: string;
  keywords?: string;
}

const metaConfigs: Record<string, MetaConfig> = {
  '/': {
    title: 'SousChef - Your AI-Powered Kitchen Assistant',
    description: 'SousChef helps you plan meals, find recipes, and discover healthy alternatives. Get personalized meal suggestions and cooking tips from your AI kitchen assistant.',
    keywords: 'meal planning, recipe finder, healthy cooking, AI kitchen assistant, meal suggestions, cooking tips',
    type: 'website',
    image: '/og-image.png'
  },
  '/blog': {
    title: 'Nutrition & Meal Planning Blog | SousChef',
    description: 'Discover expert tips, guides, and insights about nutrition, meal planning, and healthy living.',
    keywords: 'nutrition blog, meal planning, healthy recipes, cooking tips, diet advice, wellness guides',
    type: 'blog',
    image: '/og-image.png'
  },
  '/meal-plan': {
    title: 'AI-Powered Meal Planning | SousChef',
    description: 'Create personalized meal plans with our AI assistant. Get balanced, healthy meal suggestions tailored to your preferences.',
    keywords: 'meal planning, weekly meals, meal schedule, healthy eating, diet planning',
    type: 'website',
    image: '/og-image.png'
  },
  '/recipe-finder': {
    title: 'Recipe Finder | SousChef',
    description: 'Find the perfect recipe for any occasion. Search by ingredients, cuisine, or dietary requirements.',
    keywords: 'recipe search, cooking ideas, meal recipes, ingredient search, cuisine finder',
    type: 'website',
    image: '/og-image.png'
  },
  '/healthy-alternative': {
    title: 'Healthy Food Alternatives | SousChef',
    description: 'Discover healthy alternatives to your favorite foods. Make smarter food choices with AI-powered suggestions.',
    keywords: 'healthy alternatives, food substitutes, healthy eating, diet options, nutrition choices',
    type: 'website',
    image: '/og-image.png'
  }
};

export function MetaTags() {
  const location = useLocation();
  const config = metaConfigs[location.pathname] || metaConfigs['/'];

  useEffect(() => {
    // Update meta tags
    document.title = config.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', config.description);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', config.keywords || '');

    // Update Open Graph tags
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', config.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', config.description);
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', config.type || 'website');
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', config.image || '/og-image.png');
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://sous-chef.in${location.pathname}`);

    // Update Twitter Card tags
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', config.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', config.description);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', config.image || '/og-image.png');

    // Update canonical URL
    const canonicalElement = document.querySelector('link[rel="canonical"]');
    if (canonicalElement) {
      canonicalElement.setAttribute('href', `https://sous-chef.in${location.pathname}`);
    }
  }, [location.pathname, config]);

  return null;
} 