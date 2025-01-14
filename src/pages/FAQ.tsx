import { motion } from "framer-motion";
import NavigationBar from "@/components/NavigationBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is SousChef?",
    answer: "SousChef is your personal meal planning assistant that helps you make healthier food choices. It generates personalized meal plans and suggests healthy alternatives to your favorite dishes."
  },
  {
    question: "How does the meal planning work?",
    answer: "Our meal planning system takes into account your dietary preferences, restrictions, and goals to create a personalized meal plan. You can specify things like calories, cuisine preferences, and any allergies or restrictions."
  },
  {
    question: "Can I save my meal plans?",
    answer: "Yes! Pro and Enterprise plan users can save their generated meal plans and access them anytime from their profile. You can also give each saved plan a custom name for easy reference."
  },
  {
    question: "What are healthy swaps?",
    answer: "Healthy swaps are alternative ingredient suggestions that make your favorite recipes healthier while maintaining similar taste and texture. For example, replacing regular pasta with zucchini noodles."
  },
  {
    question: "How often are meal plans updated?",
    answer: "You can generate new meal plans as often as your subscription allows. Basic plans include 5 meal plans per month, Pro plans include 20, and Enterprise plans offer unlimited generations."
  },
  {
    question: "Can I customize my dietary preferences?",
    answer: "Absolutely! You can specify various dietary preferences including vegetarian, vegan, gluten-free, dairy-free, and many more. You can also set calorie goals and exclude specific ingredients."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from your billing settings. Your access will continue until the end of your current billing period."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about SousChef
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </main>
    </div>
  );
};

export default FAQ;