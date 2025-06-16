import React from 'react';
import PageTitle from '../../components/PageTitle';
import { THEME_COLORS } from '../../constants';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className={`bg-neutral-50 py-12 md:py-16`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle title="Privacy Policy" subtitle="Your privacy is important to us." />
        <div className={`bg-white p-6 md:p-10 rounded-xl shadow-xl max-w-4xl mx-auto`}>
          <div className="prose prose-slate max-w-none text-neutral-700 leading-relaxed">
            <p className="text-sm text-neutral-500">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>Spacez ("us", "we", or "our") operates the Spacez website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

            <h2>1. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
            
            <h3>Types of Data Collected</h3>
            <h4>Personal Data</h4>
            <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
            <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, State, Province, ZIP/Postal code, City</li>
              <li>Cookies and Usage Data</li>
              <li>Financial information for investment purposes (handled with utmost security and often through third-party payment processors)</li>
            </ul>

            <h4>Usage Data</h4>
            <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>

            <h4>Tracking & Cookies Data</h4>
            <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>

            <h2>2. Use of Data</h2>
            <p>Spacez uses the collected data for various purposes:</p>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To process your investments and manage your account</li>
              <li>To comply with legal and regulatory obligations</li>
              <li>To send you newsletters, marketing or promotional materials and other information that may be of interest to you, if you have opted in.</li>
            </ul>

            <h2>3. Legal Basis for Processing Personal Data (GDPR)</h2>
            <p>If you are from the European Economic Area (EEA), Spacez's legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Data we collect and the specific context in which we collect it. Spacez may process your Personal Data because:</p>
            <ul>
              <li>We need to perform a contract with you (e.g., to process an investment)</li>
              <li>You have given us permission to do so</li>
              <li>The processing is in our legitimate interests and it's not overridden by your rights</li>
              <li>For payment processing purposes</li>
              <li>To comply with the law</li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>Spacez will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>

            <h2>5. Data Transfer</h2>
            <p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction. If you are located outside India and choose to provide information to us, please note that we transfer the data, including Personal Data, to India and process it there.</p>
            <p>Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>

            <h2>6. Disclosure of Data</h2>
            <h3>Legal Requirements</h3>
            <p>Spacez may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
            <ul>
              <li>To comply with a legal obligation</li>
              <li>To protect and defend the rights or property of Spacez</li>
              <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
              <li>To protect the personal safety of users of the Service or the public</li>
              <li>To protect against legal liability</li>
            </ul>

            <h2>7. Security of Data</h2>
            <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. We implement a variety of security measures including encryption and access controls to maintain the safety of your personal information.</p>

            <h2>8. Your Data Protection Rights</h2>
            <p>Depending on your location, you may have certain data protection rights. Spacez aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.</p>
            <p>If you wish to be informed about what Personal Data we hold about you and if you want it to be removed from our systems, please contact us. In certain circumstances, you have the following data protection rights:</p>
            <ul>
              <li>The right to access, update or delete the information we have on you.</li>
              <li>The right of rectification.</li>
              <li>The right to object.</li>
              <li>The right of restriction.</li>
              <li>The right to data portability.</li>
              <li>The right to withdraw consent.</li>
            </ul>

            <h2>9. Service Providers</h2>
            <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services or assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>

            <h2>10. Links to Other Sites</h2>
            <p>Our Service may contain links to other sites that are not operated by us. If you click a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.</p>

            <h2>11. Children's Privacy</h2>
            <p>Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>

            <h2>12. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.</p>

            <h2>13. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>By email: <a href="mailto:privacy@spacez.co" className="text-primary hover:underline">privacy@spacez.co</a></li>
              <li>By visiting this page on our website: <a href="/contact-support" className="text-primary hover:underline">spacez.co/contact-support</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;