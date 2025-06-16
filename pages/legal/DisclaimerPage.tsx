import React from 'react';
import PageTitle from '../../components/PageTitle';
import { THEME_COLORS } from '../../constants';

const DisclaimerPage: React.FC = () => {
  return (
    <div className={`bg-neutral-50 py-12 md:py-16`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle title="Disclaimer" subtitle="Important information regarding our services." />
        <div className={`bg-white p-6 md:p-10 rounded-xl shadow-xl max-w-4xl mx-auto`}>
          <div className="prose prose-slate max-w-none text-neutral-700 leading-relaxed">
            <p className="text-sm text-neutral-500">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>The information provided by Spacez ("we," "us," or "our") on spacez.co (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>

            <h2>1. No Financial, Legal, or Tax Advice</h2>
            <p>The content on this Site, including but not limited to articles, property listings, financial projections, ROI calculators, and any other materials, is not intended to be a substitute for professional financial, legal, or tax advice. Always seek the advice of a qualified professional with any questions you may have regarding an investment decision, or legal or tax matters.</p>
            <p>Spacez is not a financial advisor, broker-dealer, or tax advisor. We do not provide personalized investment recommendations or advice. Any investment decisions you make based on information from this Site are made at your own risk.</p>

            <h2>2. Investment Risks</h2>
            <p>Investing in real estate, including fractional ownership, involves significant risks. These risks include, but are not limited to:</p>
            <ul>
              <li><strong>Market Risk:</strong> The value of real estate can fluctuate due to market conditions, economic factors, and other external influences.</li>
              <li><strong>Liquidity Risk:</strong> Fractional shares in real estate may not be easily or quickly convertible to cash. There may be limited secondary markets for these shares.</li>
              <li><strong>Loss of Principal:</strong> There is no guarantee of return on investment, and you may lose some or all of your principal investment.</li>
              <li><strong>Property-Specific Risks:</strong> Each property carries its own unique risks related to its condition, location, management, and potential for rental income.</li>
              <li><strong>Regulatory Risks:</strong> Changes in laws or regulations could impact your investment.</li>
            </ul>
            <p>Past performance is not indicative of future results. Projections and estimates provided on the Site are based on assumptions that may not materialize, and actual results can differ significantly.</p>
            
            <h2>3. Forward-Looking Statements</h2>
            <p>This Site may contain forward-looking statements that involve risks and uncertainties. These statements may include terms such as "anticipate," "believe," "estimate," "expect," "intend," "may," "plan," "project," "will," "would," and other words and terms of similar meaning. Such statements are based on current expectations and assumptions and are subject to known and unknown risks, uncertainties, and other factors that may cause actual results, performance, or achievements to be materially different from those expressed or implied by such forward-looking statements. We undertake no obligation to update or revise any forward-looking statements, whether as a result of new information, future events, or otherwise.</p>

            <h2>4. Third-Party Links and Content</h2>
            <p>The Site may contain links to third-party websites or services that are not owned or controlled by Spacez. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that Spacez shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.</p>

            <h2>5. Accuracy of Information</h2>
            <p>While we strive to provide accurate and up-to-date information, we make no warranties or representations as to the accuracy, completeness, or timeliness of the information on the Site. Property details, financial data, and other information are subject to change without notice.</p>
            <p>Calculators and tools provided on the Site are for illustrative purposes only and should not be relied upon as the sole basis for making investment decisions. Their outputs are based on user inputs and predefined assumptions which may not reflect actual market conditions or individual circumstances.</p>
            
            <h2>6. No Endorsement</h2>
            <p>Reference to any specific commercial product, process, or service by trade name, trademark, manufacturer, or otherwise does not necessarily constitute or imply its endorsement, recommendation, or favoring by Spacez.</p>

            <h2>7. Professional Consultation</h2>
            <p>Before making any investment decision, you should conduct your own due diligence and consult with your own independent financial, legal, and tax advisors to determine whether an investment is suitable for you based on your personal financial situation, investment objectives, and risk tolerance.</p>

            <h2>8. Changes to This Disclaimer</h2>
            <p>We reserve the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice. We may also update this Disclaimer from time to time. We will notify you of any changes by posting the new Disclaimer on this page and updating the "Last Updated" date.</p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Disclaimer, please contact us:</p>
            <ul>
              <li>By email: <a href="mailto:legal@spacez.co" className="text-primary hover:underline">legal@spacez.co</a></li>
              <li>By visiting this page on our website: <a href="/contact-support" className="text-primary hover:underline">spacez.co/contact-support</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;