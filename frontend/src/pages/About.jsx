import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import AnimatedSection from '../components/ui/AnimatedSection';
import { 
  FiHeart, 
  FiEye, 
  FiShield, 
  FiUsers, 
  FiLock, 
  FiActivity, 
  FiCheckCircle, 
  FiUserPlus, 
  FiPlusCircle,
  FiZap,
  FiAward
} from 'react-icons/fi';

const About = () => {
  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* About Hero */}
      <section className="relative bg-slate-950 text-white py-20 overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 text-brand-400 rounded-full text-xs font-semibold uppercase tracking-wider border border-brand-500/20 backdrop-blur-md">
            <FiActivity className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
            About BloodConnect Platform
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Bridging Emergency Medicine & <span className="bg-gradient-to-r from-brand-500 via-rose-400 to-red-600 bg-clip-text text-transparent">Digital Innovation</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            BloodConnect was established to eliminate life-threatening delays in emergency blood procurement by deploying modern healthcare technology and real-time donor networking.
          </p>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-brand-500/30">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <FiHeart className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Our Mission</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To build a seamless, transparent digital ecosystem that empowers willing blood donors and connects them instantly with accredited hospitals and patients facing critical medical emergencies.
            </p>
          </div>

          <div className="group bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-500/30">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <FiEye className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Our Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A healthcare landscape where no individual suffers or succumbs to preventable blood shortage delays, backed by a nationwide, responsive network of verified voluntary blood donors.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Why BloodConnect */}
      <AnimatedSection className="bg-slate-50 py-16 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900">Why BloodConnect</h2>
            <p className="text-sm text-slate-600">
              Traditional blood bank searches are often slow and manual. BloodConnect automates critical matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <FiZap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Real-Time Dispatch</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant notification pathways ensure emergency blood requests reach matching compatible donors immediately.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiShield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Admin Verification</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hospital requests and donor responses undergo systematic admin verification to prevent fraud and maintain safety.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiLock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Privacy Guaranteed</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Donor personal data is stored securely and only shared with verified healthcare facilities during approved requests.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* How We Connect People */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900">How We Connect People</h2>
          <p className="text-sm text-slate-600">
            A synchronized workflow connecting three critical pillars of emergency healthcare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/20 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
            <div className="text-brand-400 font-mono font-bold text-xs uppercase tracking-widest">Pillar 01</div>
            <h3 className="text-xl font-bold">Verified Hospitals</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hospitals post emergency blood requirements with specific units, blood groups, and target dates.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
            <div className="text-blue-400 font-mono font-bold text-xs uppercase tracking-widest">Pillar 02</div>
            <h3 className="text-xl font-bold">Active Donors</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Donors view live requests, confirm availability, and respond directly to emergency hospital calls.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
            <div className="text-emerald-400 font-mono font-bold text-xs uppercase tracking-widest">Pillar 03</div>
            <h3 className="text-xl font-bold">Admin Quality Control</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              System administrators review completed donations and log them securely into verified donation history records.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* For Donors vs For Hospitals */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* For Donors */}
          <div className="bg-gradient-to-br from-rose-50/50 via-white to-white p-8 sm:p-10 rounded-3xl border border-rose-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md">
                <FiUserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">For Donors</h3>
                <p className="text-xs text-brand-600 font-semibold">Save Lives In Your Community</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>Receive notification alerts for matching emergency blood groups.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>Manage availability status with one-click toggles.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>Track verified donation history and community contributions.</span>
              </li>
            </ul>

            <Link to="/register" className="inline-block pt-2">
              <Button size="md" className="shadow-sm">Become a Donor</Button>
            </Link>
          </div>

          {/* For Hospitals */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-10 rounded-3xl text-white shadow-lg space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <FiPlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">For Hospitals</h3>
                <p className="text-xs text-blue-400 font-semibold">Streamline Emergency Procurement</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Post verified blood requests with urgency ratings and required dates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Monitor active donor responses in real-time.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Fulfill emergency shortages faster during critical medical events.</span>
              </li>
            </ul>

            <Link to="/register?type=hospital" className="inline-block pt-2">
              <Button size="md" variant="secondary" className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700">
                Register Hospital
              </Button>
            </Link>
          </div>

        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-10 text-center text-white space-y-6 border border-brand-900/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to make a life-saving impact?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join registered voluntary donors and verified partner hospitals across the platform today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="shadow-lg hover:shadow-brand-500/20">
                Become a Donor
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                Explore Process
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default About;
