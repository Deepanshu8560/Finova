import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Zap, 
  Check, 
  ChevronUp, 
  ChevronDown
} from 'lucide-react';

export default function FinanceDashboard() {
  return (
    <div className="font-[Inter] text-[#4b7a5e] bg-[#ffffff] min-h-screen">
      
      {/* --- NAV --- */}
      <nav className="bg-[#ffffff] border-b-[0.5px] border-[#E2EDE8] px-6 py-4 flex items-center justify-between sticky top-0 z-10 w-full">
        <div className="flex items-center gap-2">
          {/* Nav Logo */}
          <div className="w-8 h-8 flex items-center justify-center">
            <TrendingUp size={24} className="text-[#14532d]" />
          </div>
          <span className="text-[#14532d] font-[Inter] font-bold text-xl tracking-tight">Insight AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[#4b7a5e] text-sm font-[Inter] font-normal">
          <a href="#platform" className="hover:text-[#16a34a] transition-colors">Platform</a>
          <a href="#solutions" className="hover:text-[#16a34a] transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-[#16a34a] transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-[#16a34a] transition-colors">Docs</a>
        </div>
        <div>
          {/* Nav CTA (Solid) */}
          <button className="bg-[#166534] text-[#ffffff] px-5 py-2.5 rounded-md text-sm font-bold font-[Inter] hover:opacity-90 transition-opacity">
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="bg-[#f0faf4] px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center">
        <span className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#16a34a] mb-6 block">
          AI-Powered Financial Intelligence
        </span>
        <h1 className="text-[42px] md:text-[48px] text-[#14532d] font-['DM_Sans'] font-bold leading-tight max-w-3xl mb-6">
          Uncover insights hidden in your financial data instantly.
        </h1>
        <p className="text-[#4b7a5e] text-lg max-w-2xl mb-10 leading-relaxed font-[Inter] font-normal">
          The only finance SaaS dashboard using advanced AI to automate reporting, identify anomalies, and forecast with 99% accuracy.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Hero CTA (Solid) */}
          <button className="bg-[#166534] text-[#ffffff] px-8 py-3.5 rounded-md font-[Inter] font-bold text-base hover:opacity-90 transition-opacity w-full sm:w-auto">
            Get Started Now
          </button>
          {/* Hero CTA (Ghost) */}
          <button className="border border-[#16a34a] text-[#16a34a] px-8 py-3.5 rounded-md font-[Inter] font-bold text-base hover:bg-[#dcfce7] transition-colors w-full sm:w-auto">
            View Live Demo
          </button>
        </div>
      </section>

      {/* --- STAT CARDS & CHART SECTION --- */}
      <section className="bg-[#ffffff] px-6 py-20 border-b-[0.5px] border-[#E2EDE8]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center md:text-left mb-8">
             <h2 className="text-[26px] md:text-[28px] text-[#166534] font-['DM_Sans'] font-bold">
               Real-Time Analytics
             </h2>
             <p className="text-[#4b7a5e] text-sm mt-2 font-[Inter] font-normal">
               Monitor your key metrics and AI-driven predictions.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Stat Card 1 */}
             <div className="bg-[#f0faf4] border-[0.5px] border-[#E2EDE8] p-6 rounded-xl">
               <h3 className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#16a34a] mb-2 block">Total Revenue</h3>
               <div className="flex items-end justify-between">
                 <span className="text-[22px] md:text-[28px] text-[#14532d] font-[Inter] font-bold">2.4M</span>
                 <div className="flex items-center text-[#16a34a] text-sm font-[Inter] font-bold">
                   <ChevronUp size={16} /> 12.5%
                 </div>
               </div>
             </div>
             
             {/* Stat Card 2 */}
             <div className="bg-[#f0faf4] border-[0.5px] border-[#E2EDE8] p-6 rounded-xl">
               <h3 className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#16a34a] mb-2 block">Churn Rate</h3>
               <div className="flex items-end justify-between">
                 <span className="text-[22px] md:text-[28px] text-[#14532d] font-[Inter] font-bold">1.2%</span>
                 <div className="flex items-center text-[#dc2626] text-sm font-[Inter] font-bold">
                   <ChevronUp size={16} /> 0.3%
                 </div>
               </div>
             </div>

             {/* Stat Card 3 */}
             <div className="bg-[#f0faf4] border-[0.5px] border-[#E2EDE8] p-6 rounded-xl">
               <h3 className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#16a34a] mb-2 block">Active Users</h3>
               <div className="flex items-end justify-between">
                 <span className="text-[22px] md:text-[28px] text-[#14532d] font-[Inter] font-bold">45,291</span>
                 <div className="flex items-center text-[#16a34a] text-sm font-[Inter] font-bold">
                   <ChevronUp size={16} /> 4.1%
                 </div>
               </div>
             </div>
          </div>

          {/* --- CHART BARS --- */}
          <div className="bg-[#f0faf4] border-[0.5px] border-[#E2EDE8] p-6 rounded-xl mt-8">
            <h3 className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#16a34a] mb-8 block">Revenue Forecast (Millions)</h3>
            
            <div className="flex items-end gap-3 h-48 mt-4">
              {/* Bars (Active is #16a34a, Inactive is #bbf7d0) */}
              {[40, 60, 45, 80, 50, 70, 95, 65].map((val, idx) => {
                const isActive = idx === 6;
                return (
                  <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                     <div className={`w-full rounded-t-sm transition-all duration-300 ${isActive ? 'bg-[#16a34a]' : 'bg-[#bbf7d0]'}`} style={{ height: `${val}%` }}></div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-4 font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#6b9a7e]">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE CARDS --- */}
      <section className="bg-[#ffffff] px-6 py-20 border-b-[0.5px] border-[#E2EDE8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#16a34a] font-bold mb-4 block">
              Core Capabilities
            </span>
            <h2 className="text-[26px] md:text-[28px] text-[#166534] font-['DM_Sans'] font-bold">
              Built for Modern Finance Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#f8fffe] border-[0.5px] border-[#E2EDE8] p-8 rounded-2xl">
               <div className="w-12 h-12 bg-[#dcfce7] rounded-lg flex items-center justify-center mb-6">
                 <BarChart3 size={24} className="text-[#16a34a]" />
               </div>
               <h3 className="text-[26px] md:text-[28px] text-[#166534] font-[Inter] font-bold mb-3">Automated Reporting</h3>
               <p className="text-[#4b7a5e] text-base leading-relaxed font-[Inter] font-normal">
                 Generate board-ready financial reports in seconds with our AI-driven templating engine.
               </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#f8fffe] border-[0.5px] border-[#E2EDE8] p-8 rounded-2xl">
               <div className="w-12 h-12 bg-[#dcfce7] rounded-lg flex items-center justify-center mb-6">
                 <Shield size={24} className="text-[#16a34a]" />
               </div>
               <h3 className="text-[26px] md:text-[28px] text-[#166534] font-[Inter] font-bold mb-3">Anomaly Detection</h3>
               <p className="text-[#4b7a5e] text-base leading-relaxed font-[Inter] font-normal">
                 Instantly flag unusual expenses or revenue gaps before they impact your runway.
               </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#f8fffe] border-[0.5px] border-[#E2EDE8] p-8 rounded-2xl">
               <div className="w-12 h-12 bg-[#dcfce7] rounded-lg flex items-center justify-center mb-6">
                 <Zap size={24} className="text-[#16a34a]" />
               </div>
               <h3 className="text-[26px] md:text-[28px] text-[#166534] font-[Inter] font-bold mb-3">Real-Time Sync</h3>
               <p className="text-[#4b7a5e] text-base leading-relaxed font-[Inter] font-normal">
                 Connect seamlessly with Stripe, Plaid, and your existing accounting software.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="bg-[#f0faf4] px-6 py-20 pb-28 border-b-[0.5px] border-[#E2EDE8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-[26px] md:text-[28px] text-[#166534] font-['DM_Sans'] font-bold">
               Transparent Pricing
             </h2>
             <p className="text-[#4b7a5e] text-sm mt-3 font-[Inter] font-normal">
               Start for free, scale when you need to.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
             
             {/* Plan 1 */}
             <div className="bg-[#ffffff] border-[0.5px] border-[#E2EDE8] p-8 rounded-2xl flex flex-col h-full">
               <h3 className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#16a34a] mb-2 block">Starter</h3>
               <div className="text-[#14532d] font-bold text-4xl mb-1 font-[Inter]">0</div>
               <div className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#6b9a7e] mb-6 pb-6 border-b-[0.5px] border-[#E2EDE8]">per user / month</div>
               <ul className="space-y-4 mb-8 text-[#4b7a5e] text-sm font-[Inter] font-normal flex-grow">
                 <li className="flex items-center gap-3"><Check size={16} className="text-[#16a34a]" /> Basic Reporting</li>
                 <li className="flex items-center gap-3"><Check size={16} className="text-[#16a34a]" /> 1 Data Source</li>
                 <li className="flex items-center gap-3"><Check size={16} className="text-[#16a34a]" /> 1GB Storage</li>
               </ul>
               {/* Ghost CTA */}
               <button className="w-full border border-[#16a34a] text-[#16a34a] font-[Inter] font-bold py-3 rounded-md hover:bg-[#f0faf4] transition-colors mt-auto">
                 Choose Starter
               </button>
             </div>

             {/* Featured Plan */}
             <div className="bg-[#ffffff] border-2 border-[#16a34a] p-8 rounded-2xl relative shadow-sm transform md:-translate-y-4 flex flex-col h-full lg:min-h-[500px]">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#dcfce7] border-[0.5px] border-[#16a34a] text-[#14532d] font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[10px] py-1 px-3 rounded-full font-bold">
                 Recommended
               </div>
               <h3 className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#16a34a] mb-2 mt-2 block">Professional</h3>
               <div className="text-[#14532d] font-bold text-4xl mb-1 font-[Inter]">49</div>
               <div className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#6b9a7e] mb-6 pb-6 border-b-[0.5px] border-[#E2EDE8]">per user / month</div>
               <ul className="space-y-4 mb-8 text-[#4b7a5e] text-sm font-[Inter] font-normal flex-grow">
                 <li className="flex items-center gap-3"><Check size={16} className="text-[#16a34a]" /> AI-Powered Analytics</li>
                 <li className="flex items-center gap-3"><Check size={16} className="text-[#16a34a]" /> Unlimited Integrations</li>
                 <li className="flex items-center gap-3"><Check size={16} className="text-[#16a34a]" /> Custom Dashboards</li>
                 <li className="flex items-center gap-3"><Check size={16} className="text-[#16a34a]" /> Anomaly Detection</li>
               </ul>
               {/* Solid CTA */}
               <button className="w-full bg-[#166534] text-[#ffffff] font-[Inter] font-bold py-3 rounded-md hover:opacity-90 transition-opacity mt-auto">
                 Get Started
               </button>
             </div>

             {/* Plan 3 */}
             <div className="bg-[#ffffff] border-[0.5px] border-[#E2EDE8] p-8 rounded-2xl flex flex-col h-full">
               <h3 className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#16a34a] mb-2 block">Enterprise</h3>
               <div className="text-[#14532d] font-bold text-4xl mb-1 font-[Inter]">Custom</div>
               <div className="font-['JetBrains_Mono'] uppercase tracking-[0.1em] text-[11px] text-[#6b9a7e] mb-6 pb-6 border-b-[0.5px] border-[#E2EDE8]">contact for pricing</div>
               <ul className="space-y-4 mb-8 text-[#4b7a5e] text-sm font-[Inter] font-normal flex-grow">
                 <li className="flex items-center gap-3"><Check size={16} className="text-[#16a34a]" /> Dedicated Account Manager</li>
                 <li className="flex items-center gap-3"><Check size={16} className="text-[#16a34a]" /> SSO & Advanced Security</li>
                 <li className="flex items-center gap-3"><Check size={16} className="text-[#16a34a]" /> On-premise Deployment</li>
               </ul>
               <button className="w-full border border-[#16a34a] text-[#16a34a] font-[Inter] font-bold py-3 rounded-md hover:bg-[#f0faf4] transition-colors mt-auto">
                 Contact Sales
               </button>
             </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#14532d] px-6 py-12">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
               {/* Footer icon background uses Mint 100 per rules? Let's check rule: "Footer: Forest 900 bg, Mint 100 logo text." No specific rule for footer icon bg, so I will match logo text. */}
               <TrendingUp size={24} className="text-[#dcfce7]" />
               <span className="text-[#dcfce7] font-[Inter] font-bold text-xl tracking-tight">Insight AI</span>
            </div>
            <div className="flex items-center gap-6 text-[#6b9a7e] text-sm font-[Inter] font-normal">
               <a href="#" className="hover:text-[#dcfce7] transition-colors">Terms</a>
               <a href="#" className="hover:text-[#dcfce7] transition-colors">Privacy</a>
               <a href="#" className="hover:text-[#dcfce7] transition-colors">Contact</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
