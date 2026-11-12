import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-base-content/10 bg-base-100 mt-10">
      <div className="w-full px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-base-content/60">
        <p className="font-semibold">
          <span className="brand-text">DevTinder</span> · Find your next collaborator
        </p>
        <p>© {new Date().getFullYear()} DevTinder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
