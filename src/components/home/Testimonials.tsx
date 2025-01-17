import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Busy Parent",
    content: "SousChef has transformed how I plan meals for my family. The AI suggestions are spot-on!",
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
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}