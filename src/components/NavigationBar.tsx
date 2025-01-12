const NavigationBar = () => {
    return (
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">
            <h1>SousChef</h1>
          </a>
          {/* Add more navigation items here if needed */}
        </div>
      </div>
    );
  };

  export default NavigationBar;