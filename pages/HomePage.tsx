import React from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { AppContext, AppContextType } from '../App';
import { PropertyStatus, Property } from '../types';
import { THEME_COLORS } from '../constants';

// Icons for Homepage
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-accent"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.25 3.25-1.75-1.75a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l3.75-3.75Z" clipRule="evenodd" /></svg>;
const BuildingStorefrontIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0 0 11.25 11.25H8.25V21M3 21h18M3 10.5h18M3 3h18M3 21a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 3 4.5V21Z" /></svg>;
const ChartPieIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.243-3.72a9.094 9.094 0 0 1-.479 3.741M18 18.72v-3.75m-12 2.832a9.091 9.091 0 0 1-.479-3.741m0 0a9.107 9.107 0 0 1 3.741-.479m-.243 3.72a9.09 9.09 0 0 0 .479 3.741M12 18.75v-3.75m9-.75a9 9 0 0 0-9-9s-9 2.25-9 9s2.25 9 9 9s9-2.25 9-9Zm-9-7.5A2.25 2.25 0 0 1 9.75 9V9.75A2.25 2.25 0 0 1 7.5 12v0a2.25 2.25 0 0 1 2.25-2.25h.75A2.25 2.25 0 0 1 12.75 12v0a2.25 2.25 0 0 1 2.25-2.25h.75A2.25 2.25 0 0 1 18 12v0a2.25 2.25 0 0 1-2.25 2.25h-.75A2.25 2.25 0 0 1 12.75 12V9.75A2.25 2.25 0 0 1 15 7.5v0Z" /></svg>;
const MagnifyingGlassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const DocumentCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12.75h3m-6.75 3h6.75m-6.75-3v3.75c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125-1.125V12m-11.25-9H5.625A2.25 2.25 0 0 0 3.375 5.25v13.5A2.25 2.25 0 0 0 5.625 21h12.75c1.243 0 2.25-1.007 2.25-2.25V5.25A2.25 2.25 0 0 0 18.375 3H12.75m-2.625 3.375V6.75" /><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 10.862 1.647-1.647M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.5 4.5L21.75 6" /></svg>;


const HomePage: React.FC = () => {
  const appContext = React.useContext(AppContext) as AppContextType;
  const { properties, investors } = appContext;

  const liveProperties = properties.filter(p => p.status === PropertyStatus.Live || p.status === PropertyStatus.FullyFunded);
  const featuredProperties = liveProperties.slice(0, 3);

  const totalFundedPropertiesCount = properties.filter(p => p.status === PropertyStatus.FullyFunded).length;
  const totalInvestorCount = investors.length; 
  const averageProjectedROI = "18-22%"; // Placeholder

  const stats = [
    { value: totalFundedPropertiesCount, label: 'Properties Funded', icon: <BuildingStorefrontIcon/> },
    { value: `${averageProjectedROI}`, label: 'Avg. Projected Returns', icon: <ChartPieIcon/> },
    { value: `${totalInvestorCount}+`, label: 'Happy Investors', icon: <UsersIcon/> },
  ];
  
  const benefits = [
    { text: "Exclusive Access: Handpicked luxury villas in prime, high-growth locations.", icon: <CheckCircleIcon /> },
    { text: "Fractional Ownership, Full Perks: Enjoy the benefits of luxury property ownership without the sole burden.", icon: <CheckCircleIcon /> },
    { text: "Consistent Passive Income: Earn reliable monthly returns from professionally managed rentals.", icon: <CheckCircleIcon /> },
    { text: "Full Transparency: Track your investments, earnings, and property performance with ease.", icon: <CheckCircleIcon /> },
    { text: "Hassle-Free Management: Our experts handle everything from acquisition to guest services.", icon: <CheckCircleIcon /> }
  ];

  const howItWorksSteps = [
    { title: "Discover Opportunities", description: "Explore our curated selection of luxury villas with detailed financial projections and high ROI potential.", icon: <MagnifyingGlassIcon /> },
    { title: "Invest Seamlessly", description: "Secure your share with a transparent, straightforward investment process. Minimums designed for accessibility.", icon: <DocumentCheckIcon /> },
    { title: "Earn & Grow", description: "Receive regular passive income from rental yields and benefit from potential capital appreciation.", icon: <TrendingUpIcon /> }
  ];
  
  const testimonials = [
    { quote: "Investing with Spacez was the best decision for diversifying my portfolio. The returns are consistent, and the process was incredibly smooth!", author: "Aarav Patel", location: "Investor, Goa Villa" },
    { quote: "I always dreamed of owning a luxury property. Spacez made it possible and profitable. Their team is top-notch.", author: "Priya Sharma", location: "Investor, Lonavala Retreat" },
  ];

  return (
    <div className={`bg-neutral-50 text-neutral-800`}>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center text-white py-36 md:py-56" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')" }}
      >
        <div className="absolute inset-0 bg-neutral-900 opacity-60"></div> {/* Darker overlay */}
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">Unlock a World of Luxury: Invest in Exclusive Villas.</h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-neutral-100 drop-shadow-sm">
            Spacez makes fractional ownership of premium, income-generating properties simple and rewarding. Start building your portfolio and earning passive income today.
          </p>
          <Link
            to="/properties"
            className={`bg-secondary text-primary-dark font-bold py-4 px-10 rounded-lg text-lg hover:bg-secondary-dark transition-all transform hover:scale-105 duration-300 ease-in-out shadow-xl inline-block focus:outline-none focus:ring-4 focus:ring-secondary/50`}
          >
            Explore Properties
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className={`text-3xl lg:text-4xl font-bold text-primary mb-3`}>Your Journey to Effortless Villa Investment</h2>
            <p className={`text-lg text-neutral-600 max-w-2xl mx-auto`}>Investing in luxury real estate has never been easier. Follow our simple three-step process.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center p-8 bg-neutral-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-6 text-primary">{React.cloneElement(step.icon, { className: "w-14 h-14 text-primary"})}</div>
                <h3 className={`text-xl font-semibold text-neutral-800 mb-2`}>{step.title}</h3>
                <p className={`text-neutral-600 text-sm leading-relaxed`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Properties Section */}
      {featuredProperties.length > 0 && (
        <section className="py-16 lg:py-24 bg-neutral-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
                <h2 className={`text-3xl lg:text-4xl font-bold text-primary mb-3`}>Featured Investment Opportunities</h2>
                <p className={`text-lg text-neutral-600 max-w-2xl mx-auto`}>Explore our currently available high-return villa investments, handpicked for you.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="text-center mt-12 lg:mt-16">
              <Link
                to="/properties"
                className={`bg-primary text-white font-semibold py-3.5 px-8 rounded-lg text-md hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary/50`}
              >
                View All Properties
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className={`text-3xl lg:text-4xl font-bold text-primary mb-3`}>The Spacez Advantage: Invest with Confidence</h2>
            <p className={`text-lg text-neutral-600 max-w-2xl mx-auto`}>Unlock the potential of real estate investment with unparalleled benefits tailored for savvy investors.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Luxury Villa Interior" className="rounded-xl shadow-2xl w-full h-auto object-cover"/>
              <div className="absolute -bottom-5 -right-5 w-28 h-28 bg-secondary/30 rounded-full z-0 transform rotate-45"></div>
              <div className="absolute -top-5 -left-5 w-20 h-20 bg-primary/20 rounded-lg z-0 transform rotate-12"></div>
            </div>
            <ul className="space-y-5">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start p-4 bg-neutral-50 rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div className="flex-shrink-0 mr-4 mt-1">{React.cloneElement(benefit.icon, { className: "w-6 h-6 text-accent"})}</div>
                  <span className="text-md text-neutral-700 leading-relaxed">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-3">Our Proven Performance</h2>
                <p className="text-lg text-neutral-200 max-w-2xl mx-auto">Numbers speak louder than words. See our impact in the fractional investment space.</p>
            </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-8 bg-primary-dark/70 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
                <div className="flex justify-center mb-5 text-secondary">{React.cloneElement(stat.icon, { className: "w-14 h-14 text-secondary"})}</div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg text-neutral-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Snippet Section */}
      <section className="py-16 lg:py-24 bg-neutral-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className={`text-3xl lg:text-4xl font-bold text-primary mb-3`}>Hear From Our Investors</h2>
            <p className={`text-lg text-neutral-600 max-w-2xl mx-auto`}>We're proud to have earned the trust of investors who are now enjoying the benefits of fractional ownership.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`bg-white p-8 rounded-xl shadow-xl border-l-4 border-accent`}>
                <svg className={`w-10 h-10 text-accent mb-4 opacity-70`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391A3.285 3.285 0 0 0 6.728 13.5H3.228V21h3.5c3.717 0 6.728-3.012 6.728-6.728V3H9.983zm10.017 0v7.391A3.285 3.285 0 0 0 16.745 13.5h-3.5V21h3.5c3.717 0 6.728-3.012 6.728-6.728V3h-3.517z" />
                </svg>
                <p className={`text-neutral-600 italic text-lg mb-6 leading-relaxed`}>"{testimonial.quote}"</p>
                <p className={`font-semibold text-primary text-md`}>{testimonial.author}</p>
                <p className={`text-sm text-neutral-500`}>{testimonial.location}</p>
              </div>
            ))}
          </div>
           <div className="text-center mt-12">
              <Link
                to="/success-stories"
                className={`text-primary font-semibold hover:text-accent transition-colors`}
              >
                Read More Success Stories &rarr;
              </Link>
            </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Investment Portfolio?</h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-neutral-200">
            Join Spacez today. Discover exclusive villa investments, earn passive income, and build long-term wealth.
          </p>
          <Link
            to="/properties"
            className={`bg-secondary text-primary-dark font-bold py-4 px-10 rounded-lg text-lg hover:bg-secondary-dark transition-all transform hover:scale-105 duration-300 ease-in-out shadow-xl inline-block focus:outline-none focus:ring-4 focus:ring-secondary/50`}
          >
            Find Your Next Investment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;