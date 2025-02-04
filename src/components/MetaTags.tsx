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
    image: 'https://sous-chef.in/og-image-compressed.jpg'
  },
  '/blog': {
    title: 'Nutrition & Meal Planning Blog | SousChef',
    description: 'Discover expert tips, guides, and insights about nutrition, meal planning, and healthy living.',
    keywords: 'nutrition blog, meal planning, healthy recipes, cooking tips, diet advice, wellness guides',
    type: 'blog',
    image: 'https://sous-chef.in/og-image-compressed.jpg'
  },
  '/meal-plan': {
    title: 'AI-Powered Meal Planning | SousChef',
    description: 'Create personalized meal plans with our AI assistant. Get balanced, healthy meal suggestions tailored to your preferences.',
    keywords: 'meal planning, weekly meals, meal schedule, healthy eating, diet planning',
    type: 'website',
    image: 'https://sous-chef.in/og-image-compressed.jpg'
  },
  '/recipe-finder': {
    title: 'Recipe Finder | SousChef',
    description: 'Find the perfect recipe for any occasion. Search by ingredients, cuisine, or dietary requirements.',
    keywords: 'recipe search, cooking ideas, meal recipes, ingredient search, cuisine finder',
    type: 'website',
    image: 'https://sous-chef.in/og-image-compressed.jpg'
  },
  '/healthy-alternative': {
    title: 'Healthy Food Alternatives | SousChef',
    description: 'Discover healthy alternatives to your favorite foods. Make smarter food choices with AI-powered suggestions.',
    keywords: 'healthy alternatives, food substitutes, healthy eating, diet options, nutrition choices',
    type: 'website',
    image: 'https://sous-chef.in/og-image-compressed.jpg'
  }
};

export function MetaTags() {
  const location = useLocation();
  const config = metaConfigs[location.pathname] || metaConfigs['/'];

  useEffect(() => {
    document.title = config.title;
    
    const metaTags = {
      'description': config.description,
      'keywords': config.keywords || '',
      'og:title': config.title,
      'og:description': config.description,
      'og:type': config.type || 'website',
      'og:image': config.image || '/og-image-compressed.jpg',
      'og:url': `https://sous-chef.in${location.pathname}`,
      'twitter:title': config.title,
      'twitter:description': config.description,
      'twitter:image': config.image || '/og-image-compressed.jpg'
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      const selector = name.startsWith('og:') 
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content);
      }
    });
  }, [location.pathname, config]);

  return null;
} 