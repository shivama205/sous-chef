export const colors = {
  primary: {
    light: "from-primary/30",
    DEFAULT: "from-primary",
    dark: "from-primary/80",
  },
  secondary: {
    light: "from-secondary/30",
    DEFAULT: "from-secondary",
    dark: "from-secondary/80",
  },
  accent: {
    light: "from-accent/30",
    DEFAULT: "from-accent",
    dark: "from-accent/80",
  },
  background: {
    light: "bg-background/50",
    DEFAULT: "bg-background",
    dark: "bg-background/90",
  }
};

export const gradients = {
  primary: "bg-gradient-to-r from-primary to-primary/80",
  secondary: "bg-gradient-to-r from-secondary to-secondary/80",
  accent: "bg-gradient-to-r from-accent to-accent/10",
  glass: "bg-white/80 backdrop-blur-sm",
};

export const typography = {
  heading: {
    h1: "text-4xl font-bold tracking-tight",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-bold",
    h4: "text-xl font-bold",
  },
  body: {
    large: "text-lg",
    base: "text-base",
    small: "text-sm",
    tiny: "text-xs",
  },
};

export const spacing = {
  section: "py-8 sm:py-12",
  container: "px-4 sm:px-6",
  stack: "space-y-4 sm:space-y-6",
};

export const layout = {
  maxWidth: {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
  },
  grid: {
    cols2: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    cols3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    cols4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  },
};

export const effects = {
  hover: "transition-all duration-200 hover:shadow-md",
  active: "active:shadow-sm",
  glass: "bg-white/80 backdrop-blur-sm border-0 shadow-lg",
};