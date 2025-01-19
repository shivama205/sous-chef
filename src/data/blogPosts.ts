import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "understanding-macros",
    title: "Understanding Macros: A Beginner's Guide",
    excerpt: "Learn the basics of macronutrients and how they affect your body. Discover how to balance proteins, carbs, and fats for optimal health.",
    content: `
      Macronutrients are the building blocks of nutrition. They include proteins, carbohydrates, and fats - the three main categories of nutrients that your body needs in large amounts to function properly.

      ## Proteins
      Proteins are essential for building and repairing tissues, making enzymes and hormones, and maintaining muscle mass. Good sources include:
      - Lean meats
      - Fish
      - Eggs
      - Legumes
      
      ## Carbohydrates
      Carbohydrates are your body's main source of energy. They come in two main forms:
      - Simple carbs (sugars)
      - Complex carbs (starches and fiber)
      
      ## Fats
      Healthy fats are crucial for:
      - Brain function
      - Hormone production
      - Nutrient absorption
      
      Choose sources like avocados, nuts, and olive oil for optimal health benefits.
    `,
    author: "Nutrition Expert",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Nutrition",
    imageUrl: "/blog/macros-guide.jpg",
    tags: ["nutrition", "macros", "health"]
  },
  {
    id: "2",
    slug: "meal-prep-101",
    title: "Meal Prep 101: Save Time and Eat Better",
    excerpt: "Master the art of meal preparation with these time-saving tips and strategies. Learn how to plan, shop, and cook efficiently.",
    content: `
      Meal preparation is one of the most effective ways to maintain a healthy diet while saving time and money. This guide will help you get started with meal prepping.

      ## Why Meal Prep?
      - Saves time during busy weekdays
      - Reduces food waste
      - Helps maintain portion control
      - Makes healthy eating easier
      
      ## Getting Started
      1. Plan your meals for the week
      2. Make a detailed shopping list
      3. Choose a prep day
      4. Invest in good storage containers
      
      ## Tips for Success
      - Start small with 2-3 days worth of meals
      - Choose recipes with overlapping ingredients
      - Prep ingredients that take longest first
      - Label everything with dates
    `,
    author: "Meal Planning Expert",
    date: "2024-01-12",
    readTime: "7 min read",
    category: "Meal Planning",
    imageUrl: "/blog/meal-prep.jpg",
    tags: ["meal prep", "planning", "organization"]
  }
];