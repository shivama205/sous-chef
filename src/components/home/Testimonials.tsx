import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Busy Parent",
    content: "MySideChef has transformed how I plan meals for my family. The AI suggestions are spot-on!",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Fitness Enthusiast",
    content: "The macro tracking and healthy alternatives feature helps me stay on track with my fitness goals.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Home Cook",
    content: "I love how it suggests recipes based on ingredients I already have. No more food waste!",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-8 sm:py-12">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{testimonial.content}</p>
              <div>
                <p className="font-semibold text-sm sm:text-base">{testimonial.name}</p>
                <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}