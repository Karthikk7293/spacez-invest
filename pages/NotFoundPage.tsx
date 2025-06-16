
import React from 'react';
import { Link } from 'react-router-dom';
import { THEME_COLORS } from '../constants';

interface NotFoundPageProps {
  message?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ message }) => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-6 py-12">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-24 h-24 text-${THEME_COLORS.primary} mb-6`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
      <h1 className={`text-5xl font-bold text-${THEME_COLORS.textBase} mb-4`}>Oops! Page Not Found</h1>
      <p className={`text-xl text-${THEME_COLORS.textMuted} mb-8`}>
        {message || "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
      </p>
      <Link
        to="/"
        className={`bg-${THEME_COLORS.primary} text-white font-semibold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-colors shadow-md`}
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
