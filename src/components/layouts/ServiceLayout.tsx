import { useAuth } from "@/providers/AuthProvider";
import { BaseLayout } from "./BaseLayout";

interface ServiceLayoutProps {
  children: React.ReactNode;
}

export function ServiceLayout({ children }: ServiceLayoutProps) {
  const { user } = useAuth();

  return (
    <BaseLayout>
      <div className="min-h-screen relative">
        {/* Show background only for non-logged-in users */}
        {!user && (
          <div className="fixed inset-0 z-0">
            <picture>
              <source
                srcSet="/assets/hero-bg.webp"
                type="image/webp"
              />
              <img
                src="/assets/hero-bg.jpg"
                alt=""
                role="presentation"
                loading="eager"
                decoding="async"
                width="1920"
                height="1080"
                className="absolute inset-0 w-full h-full object-cover opacity-[0.15]"
                onError={(e) => {
                  console.error('Error loading image:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </picture>
          </div>
        )}

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </BaseLayout>
  );
} 