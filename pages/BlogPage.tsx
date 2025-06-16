
import React from 'react';
import PageTitle from '../components/PageTitle';
import { THEME_COLORS } from '../constants';

// Sample Blog Post Data (Placeholder)
const samplePosts = [
  {
    id: 1,
    title: "The Rise of Fractional Investment in Luxury Real Estate",
    date: "October 26, 2023",
    excerpt: "Fractional investment is changing the game for aspiring real estate investors. Discover how you can own a piece of luxury without the hefty price tag...",
    image: "https://picsum.photos/seed/blog1/400/250",
    category: "Investment Trends"
  },
  {
    id: 2,
    title: "Top 5 Locations for Villa Investments in India 2024",
    date: "November 5, 2023",
    excerpt: "Location is key in real estate. We explore the most promising Indian destinations for villa investments that offer both lifestyle and returns...",
    image: "https://picsum.photos/seed/blog2/400/250",
    category: "Market Insights"
  },
  {
    id: 3,
    title: "Understanding ROI in Fractional Villa Ownership",
    date: "November 15, 2023",
    excerpt: "Calculating your potential return on investment can seem complex. We break down the factors that contribute to ROI in fractional ownership...",
    image: "https://picsum.photos/seed/blog3/400/250",
    category: "Investor Education"
  }
];

const BlogCard: React.FC<typeof samplePosts[0]> = ({ title, date, excerpt, image, category }) => {
  return (
    <div className={`bg-${THEME_COLORS.cardBackground} rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}>
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <span className={`inline-block bg-secondary text-primary text-xs font-semibold px-2 py-0.5 rounded mb-2`}>{category}</span>
        <h3 className={`text-xl font-semibold text-${THEME_COLORS.primary} mb-2 hover:text-accent transition-colors cursor-pointer`}>{title}</h3>
        <p className={`text-sm text-${THEME_COLORS.textMuted} mb-1`}>{date}</p>
        <p className={`text-${THEME_COLORS.textMuted} text-sm leading-relaxed mb-4`}>{excerpt}</p>
        <a href="#" className={`text-${THEME_COLORS.accent} font-medium hover:underline text-sm`}>Read More &rarr;</a>
      </div>
    </div>
  )
}


const BlogPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 min-h-[calc(100vh-300px)]">
      <PageTitle title="Spacez Insights" subtitle="Your source for the latest news, trends, and advice in luxury real estate investment." />
      
      <div className={`bg-${THEME_COLORS.background} py-8`}>
        {samplePosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {samplePosts.map(post => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 bg-${THEME_COLORS.cardBackground} shadow rounded-lg`}>
            <h2 className={`text-2xl font-semibold text-${THEME_COLORS.textBase} mb-3`}>Our Blog is Coming Soon!</h2>
            <p className={`text-${THEME_COLORS.textMuted}`}>
              We're working on bringing you insightful articles, market analysis, and investment tips. Check back later for updates!
            </p>
          </div>
        )}
         <div className="mt-12 text-center">
            <p className={`text-lg text-${THEME_COLORS.textMuted}`}>
                (Note: Blog content is currently placeholder.)
            </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
