import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const NavigationBar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">SousChef</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/meal-plan"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/meal-plan") ? "text-primary" : "text-gray-600"
              }`}
            >
              Meal Plan
            </Link>
            <Link
              to="/healthy-swap"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/healthy-swap") ? "text-primary" : "text-gray-600"
              }`}
            >
              Healthy Swap
            </Link>
          </div>

          {/* Hamburger Icon for Mobile */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="focus:outline-none">
              <span className="block w-6 h-0.5 bg-primary mb-1"></span>
              <span className="block w-6 h-0.5 bg-primary mb-1"></span>
              <span className="block w-6 h-0.5 bg-primary"></span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col items-start space-y-4 mt-4 mb-4 p-8 rounded-md shadow-lg">
            <Link
              to="/meal-plan"
              className={`text-sm font-medium ${
                isActive("/meal-plan") ? "text-primary" : "text-gray-600"
              }`}
            >
              Meal Plan
            </Link>
            <Link
              to="/healthy-swap"
              className={`text-sm font-medium ${
                isActive("/healthy-swap") ? "text-primary" : "text-gray-600"
              }`}
            >
              Healthy Swap
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;