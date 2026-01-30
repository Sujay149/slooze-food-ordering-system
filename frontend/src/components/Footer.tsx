import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} <span className="font-semibold text-white">Slooze</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
