import React from "react";
import { MealPlan } from "@/types/mealPlan";
import { Utensils } from "lucide-react";

interface MealPlanDownloadViewProps {
  mealPlan: MealPlan;
  planName: string;
}

export const MealPlanDownloadView = React.forwardRef<HTMLDivElement, MealPlanDownloadViewProps>(
  ({ mealPlan, planName }, ref) => {
    // Get layout configuration based on number of days
    const getLayoutConfig = (dayCount: number) => {
      switch (dayCount) {
        case 1:
          return {
            gridCols: 1,
            width: '400px',
            dayClass: 'p-5'
          };
        case 2:
          return {
            gridCols: 2,
            width: '700px',
            dayClass: 'p-5'
          };
        case 3:
          return {
            gridCols: 3,
            width: '800px',
            dayClass: 'p-5'
          };
        case 4:
          return {
            gridCols: 2,
            width: '700px',
            dayClass: 'p-5',
            gridAreas: "'d1 d2' 'd3 d4'"
          };
        case 5:
          return {
            gridCols: 3,
            width: '800px',
            dayClass: 'p-4',
            gridAreas: "'d1 d2 d3' 'd4 d5 .'"
          };
        case 6:
          return {
            gridCols: 3,
            width: '800px',
            dayClass: 'p-4',
            gridAreas: "'d1 d2 d3' 'd4 d5 d6'"
          };
        case 7:
          return {
            gridCols: 3,
            width: '800px',
            dayClass: 'p-4',
            gridAreas: "'d1 d2 d3' 'd4 d5 d6' 'd7 . .'"
          };
        default:
          return {
            gridCols: 3,
            width: '800px',
            dayClass: 'p-4'
          };
      }
    };

    const layout = getLayoutConfig(mealPlan.days.length);

    return (
      <div 
        ref={ref}
        className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-sm"
        style={{ 
          fontFamily: 'Inter, system-ui, sans-serif',
          maxWidth: layout.width,
          width: '100%'
        }}
      >
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-2 rounded-lg">
              <Utensils className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Preview Meal Plan</h1>
              <p className="text-xs text-gray-500">This is how your meal plan will look when shared</p>
            </div>
          </div>
          <div className="text-xs text-right text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full">
            {mealPlan.days.length} days
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div 
          className="grid gap-4"
          style={{ 
            gridTemplateColumns: `repeat(${layout.gridCols}, minmax(0, 1fr))`,
            ...(layout.gridAreas && {
              gridTemplateAreas: layout.gridAreas
            })
          }}
        >
          {mealPlan.days.map((day, dayIndex) => (
            <div 
              key={dayIndex}
              className={`${layout.dayClass} rounded-lg bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] border border-primary/10 hover:border-primary/20 transition-colors`}
              style={layout.gridAreas ? { gridArea: `d${dayIndex + 1}` } : {}}
            >
              <div className="font-medium text-primary/90 mb-4 pb-2 border-b border-primary/10">
                {day.day}
              </div>
              <div className="grid gap-3">
                {day.meals.map((meal, mealIndex) => (
                  <div 
                    key={mealIndex} 
                    className="grid gap-1 group"
                  >
                    <span className={`text-gray-500 font-medium ${mealPlan.days.length <= 4 ? 'text-sm' : 'text-xs'}`}>
                      {meal.time}
                    </span>
                    <span className={`text-gray-900 group-hover:text-primary/90 transition-colors ${mealPlan.days.length <= 4 ? 'text-sm' : 'text-xs'}`}>
                      {meal.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Branded Footer */}
        <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-primary font-medium">SousChef AI</span>
          <span className="text-gray-400">sous-chef.in</span>
        </div>
      </div>
    );
  }
);

MealPlanDownloadView.displayName = "MealPlanDownloadView";

export default MealPlanDownloadView; 