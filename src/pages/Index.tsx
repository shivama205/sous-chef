import { PreferencesForm } from "@/components/PreferencesForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
            The Hungry Hub
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create your personalized weekly meal plan tailored to your lifestyle and preferences.
            Get nutritious, delicious meals that match your goals.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <PreferencesForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;