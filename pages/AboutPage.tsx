
import React from 'react';
import PageTitle from '../components/PageTitle';
import { THEME_COLORS } from '../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 min-h-[calc(100vh-300px)]">
      <PageTitle title="About Spacez" subtitle="Revolutionizing Real Estate Investment, Together." />
      <div className={`bg-${THEME_COLORS.cardBackground} p-8 md:p-12 rounded-lg shadow-xl`}>
        <div className="prose prose-lg max-w-none text-${THEME_COLORS.textMuted}">
          <h2 className={`text-2xl font-semibold text-${THEME_COLORS.primary} mb-4`}>Our Mission</h2>
          <p>
            At Spacez, our mission is to democratize access to luxury real estate investment. We believe that everyone should have the opportunity to own a piece of high-value property and benefit from its potential returns, without the traditional barriers of high capital requirements and complex management. We strive to make villa ownership simple, transparent, and profitable.
          </p>
          
          <h2 className={`text-2xl font-semibold text-${THEME_COLORS.primary} mt-8 mb-4`}>Our Vision</h2>
          <p>
            We envision a future where investing in global luxury properties is as easy as investing in stocks. Spacez aims to be the leading platform for fractional real estate, connecting discerning investors with exceptional, income-generating villas worldwide, all powered by cutting-edge technology and unparalleled market expertise.
          </p>

          <h2 className={`text-2xl font-semibold text-${THEME_COLORS.primary} mt-8 mb-4`}>The Spacez Difference</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Curated Selection:</strong> Every property is meticulously vetted for location, quality, and income potential.</li>
            <li><strong>Transparent Process:</strong> From initial investment to monthly payouts, every step is clear and trackable.</li>
            <li><strong>Expert Management:</strong> We handle all aspects of property management, ensuring a truly passive investment for you.</li>
            <li><strong>Community Focused:</strong> Join a network of like-minded investors and property enthusiasts.</li>
          </ul>
          
          <p className="mt-8 text-center text-lg">
            More about our journey, our dedicated team, and the values that drive us will be shared here soon. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
