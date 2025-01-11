import { useState } from "react";
import { PreferencesForm } from "@/components/PreferencesForm";

const Index = () => {
  const handlePreferencesSubmit = (preferences: any) => {
    console.log("Preferences submitted:", preferences);
    // Here you would typically generate the meal plan based on preferences
  };

  return (
    <div className="min-h-screen bg-accent/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">The Hungry Hub</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your personalized weekly meal plan tailored to your lifestyle and preferences.
          </p>
        </div>
        
        <div className="flex justify-center">
          <PreferencesForm onSubmit={handlePreferencesSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Index;