import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md shadow-sm py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h4 className="text-sm font-semibold mb-2 text-gray-600">Contact Us</h4>
          <div className="flex items-center space-x-4">
            <a href="https://wa.me/+919663187633" className="hover:text-primary" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faWhatsapp} className="text-gray-600" />
            </a>
            <a href="mailto:shivama205@gmail.com" className="hover:text-primary" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-600" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 