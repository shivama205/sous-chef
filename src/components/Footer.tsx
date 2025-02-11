import { Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Contact Section */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-foreground">Contact Us</h4>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-primary/5 hover:text-primary"
              >
                <a 
                  href="https://wa.me/+919663187633" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Contact us on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-primary/5 hover:text-primary"
              >
                <a 
                  href="mailto:support@mysidechef.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Contact us via email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Links Section */}
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <Button variant="link" asChild className="text-sm text-muted-foreground hover:text-primary">
              <Link to="/about">About Us</Link>
            </Button>
            <Button variant="link" asChild className="text-sm text-muted-foreground hover:text-primary">
              <Link to="/privacy">Privacy Policy</Link>
            </Button>
            <Button variant="link" asChild className="text-sm text-muted-foreground hover:text-primary">
              <Link to="/terms">Terms of Service</Link>
            </Button>
            <span className="text-sm text-muted-foreground">© 2024 MySideChef. All rights reserved.</span>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 