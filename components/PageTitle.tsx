import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`mb-8 md:mb-10 ${className}`}>
      <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-1.5">{title}</h1>
      {subtitle && <p className="text-md md:text-lg text-neutral-500 max-w-2xl">{subtitle}</p>}
    </div>
  );
};

export default PageTitle;