import { Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h4 className="text-sm font-semibold mb-2 text-foreground">Contact Us</h4>
          <div className="flex items-center space-x-4">
            <a href="https://wa.me/+919663187633" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="mailto:shivama205@gmail.com" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          <span className="text-sm text-muted-foreground">© 2025 MySideChef. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 