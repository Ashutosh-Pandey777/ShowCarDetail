import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, FileText, Megaphone } from 'lucide-react';

const pages = {
 '/about-us': {
  title: 'About ShowCarDetail',
  intro: 'A simpler way to explore cars and make informed decisions.',
  icon: Building2,
  sections: [
   ['Our purpose', 'ShowCarDetail brings car discovery information together in one place. Explore available listings, review vehicle details and compare models before making your next decision.'],
   ['What you can explore', 'Browse new and pre-owned car listings, discover manufacturers, review specifications and use comparison tools to understand the differences between vehicles.'],
   ['Our commitment', 'We aim to present information clearly and make the car research process easier. Listing details and availability may change, so please verify important information with the seller or manufacturer.']
  ]
 },
 '/careers': {
  title: 'Careers at ShowCarDetail',
  intro: 'Help us make the car discovery experience better.',
  icon: BriefcaseBusiness,
  sections: [
   ['Build with us', 'We are interested in people who care about useful products, thoughtful design, reliable technology and great customer experiences.'],
   ['Opportunities', 'Our open roles will be published on this page when positions are available. Until then, please check back for updates.'],
   ['A fair hiring process', 'ShowCarDetail does not charge candidates any fee at any stage of recruitment. We will communicate through official contact channels only.']
  ]
 },
 '/terms-and-conditions': {
  title: 'Terms & Conditions',
  intro: 'Please read these terms before using ShowCarDetail.',
  icon: FileText,
  sections: [
   ['Use of this website', 'By accessing ShowCarDetail, you agree to use the website lawfully and not interfere with its operation, security or other users’ access.'],
   ['Information and listings', 'Vehicle specifications, prices, images, offers and availability are provided for general information and may change. We do not guarantee that every listing or detail is complete, current or error-free. Verify vehicle condition, ownership, documents, price and other material details independently before a transaction.'],
   ['Third-party sellers and services', 'Any purchase, sale, finance, insurance or other arrangement made with a seller or third party is between you and that party. ShowCarDetail is not a party to such transactions unless expressly stated.'],
   ['Intellectual property', 'Website text, design elements, branding and original materials belong to ShowCarDetail or their respective rights holders. They may not be copied or reused without permission.'],
   ['Changes and contact', 'We may update these terms as the website evolves. Continued use after an update means you accept the revised terms. For questions, use our Contact page.']
  ]
 },
 '/advertise': {
  title: 'Advertise with ShowCarDetail',
  intro: 'Reach people who are researching and comparing cars.',
  icon: Megaphone,
  sections: [
   ['Partner with us', 'ShowCarDetail is building a focused destination for people exploring cars. We welcome enquiries from automotive brands, dealerships and relevant service providers.'],
   ['Advertising enquiries', 'Please share your organisation name, campaign objective, target audience and preferred contact details through our Contact page. Our team can review the enquiry and respond when suitable opportunities are available.'],
   ['Transparency', 'Paid promotions and sponsored placements, where offered, should be clearly identified. Advertising does not guarantee editorial coverage or a particular listing position.']
  ]
 }
};

export default function CompanyInfoPage() {
 const { pathname } = useLocation();
 const page = pages[pathname] || pages['/about-us'];
 const Icon = page.icon;
 return <main className="min-h-[65vh] bg-[#f7f8fa] px-4 py-10 sm:px-6">
  <div className="mx-auto max-w-4xl">
   <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600"><ArrowLeft size={16}/> Back to home</Link>
   <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 bg-white px-6 py-9 sm:px-10">
     <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600"><Icon size={25}/></span>
     <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{page.title}</h1>
     <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{page.intro}</p>
    </div>
    <div className="space-y-7 px-6 py-8 sm:px-10">
     {page.sections.map(([heading, body])=><section key={heading}><h2 className="text-lg font-bold text-slate-900">{heading}</h2><p className="mt-2 text-sm leading-7 text-slate-600">{body}</p></section>)}
     <div className="rounded-xl bg-[#fff5f4] p-5"><h2 className="font-bold text-slate-900">Need to get in touch?</h2><p className="mt-1 text-sm text-slate-600">Send your question to the ShowCarDetail team.</p><Link to="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:underline">Contact us <ArrowRight size={16}/></Link></div>
    </div>
   </article>
  </div>
 </main>;
}
