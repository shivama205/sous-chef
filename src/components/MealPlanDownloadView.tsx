import React from "react";
import { MealPlan } from "@/types/mealPlan";
import { Utensils } from "lucide-react";

interface MealPlanDownloadViewProps {
  mealPlan: MealPlan;
  planName: string;
}

interface LayoutConfig {
  gridCols: number;
  width: string;
  maxWidth: string;
  dayClass: string;
  gridAreas?: string;
}

export const MealPlanDownloadView = React.forwardRef<HTMLDivElement, MealPlanDownloadViewProps>(
  ({ mealPlan, planName }, ref) => {
    // Get layout configuration based on number of days
    const getLayoutConfig = (dayCount: number): LayoutConfig => {
      switch (dayCount) {
        case 1:
          return {
            gridCols: 1,
            width: '100%',
            maxWidth: '400px',
            dayClass: 'p-4'
          };
        case 2:
          return {
            gridCols: 1,
            width: '100%',
            maxWidth: '600px',
            dayClass: 'p-4',
            gridAreas: "'d1' 'd2'"
          };
        case 3:
          return {
            gridCols: 1,
            width: '100%',
            maxWidth: '600px',
            dayClass: 'p-4',
            gridAreas: "'d1' 'd2' 'd3'"
          };
        case 4:
          return {
            gridCols: 2,
            width: '100%',
            maxWidth: '700px',
            dayClass: 'p-4',
            gridAreas: "'d1 d2' 'd3 d4'"
          };
        case 5:
          return {
            gridCols: 2,
            width: '100%',
            maxWidth: '700px',
            dayClass: 'p-4',
            gridAreas: "'d1 d2' 'd3 d4' 'd5 .'"
          };
        case 6:
          return {
            gridCols: 2,
            width: '100%',
            maxWidth: '700px',
            dayClass: 'p-4',
            gridAreas: "'d1 d2' 'd3 d4' 'd5 d6'"
          };
        case 7:
          return {
            gridCols: 2,
            width: '100%',
            maxWidth: '700px',
            dayClass: 'p-4',
            gridAreas: "'d1 d2' 'd3 d4' 'd5 d6' 'd7 .'"
          };
        default:
          return {
            gridCols: 2,
            width: '100%',
            maxWidth: '700px',
            dayClass: 'p-4'
          };
      }
    };

    const layout = getLayoutConfig(mealPlan.days.length);

    return (
      <div 
        ref={ref}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-sm"
        style={{ 
          fontFamily: 'Inter, system-ui, sans-serif',
          width: layout.width,
          maxWidth: layout.maxWidth,
          margin: '0 auto'
        }}
      >
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900">{planName}</h1>
              <p className="text-[10px] sm:text-xs text-gray-500">{mealPlan.days.length} Day Meal Plan</p>
            </div>
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div 
          className="grid gap-3 sm:gap-4"
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
              className={`${layout.dayClass} rounded-lg bg-primary/5 border border-primary/10`}
              style={layout.gridAreas ? { gridArea: `d${dayIndex + 1}` } : {}}
            >
              <div className="font-medium text-primary mb-3 pb-2 border-b border-primary/10 text-sm">
                {day.day}
              </div>
              <div className="grid gap-2 sm:gap-3">
                {day.meals.map((meal, mealIndex) => (
                  <div 
                    key={mealIndex} 
                    className="grid gap-1"
                  >
                    <span className="text-gray-500 font-medium text-xs">
                      {meal.time}
                    </span>
                    <span className="text-gray-900 text-xs sm:text-sm line-clamp-2">
                      {meal.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Branded Footer */}
        <div className="mt-4 sm:mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-xs">
          <span className="text-primary font-medium">SousChef AI</span>
          <span className="text-gray-400">sous-chef.in</span>
        </div>
      </div>
    );
  }
);

MealPlanDownloadView.displayName = "MealPlanDownloadView";

export default MealPlanDownloadView; 