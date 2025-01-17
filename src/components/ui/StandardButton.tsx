import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@radix-ui/react-button";
import { forwardRef } from "react";

export interface StandardButtonProps extends ButtonProps {
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const StandardButton = forwardRef<HTMLButtonElement, StandardButtonProps>(
  ({ className, size = "default", variant = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "text-xs px-3 py-1.5",
      default: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3",
      icon: "h-9 w-9",
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "font-medium transition-colors",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

StandardButton.displayName = "StandardButton";

export { StandardButton };