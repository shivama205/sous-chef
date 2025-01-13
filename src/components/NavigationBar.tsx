import { Link, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">SousChef</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
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

          {/* Mobile menu */}
          <div className="md:hidden flex space-x-4">
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
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;