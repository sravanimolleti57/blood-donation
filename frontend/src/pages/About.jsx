import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { FiHeart, FiEye, FiShield, FiUsers, FiLock, FiCheckCircle } from 'react-icons/fi';

const About = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* About Hero */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 bg-brand-600/30 text-brand-400 rounded-full text-xs font-semibold uppercase tracking-wider border border-brand-500/30">
            About BloodConnect
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Connecting Donors & Hospitals <span className="text-brand-500">When Every Second Matters</span>
          </h1>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            BloodConnect was founded with a singular purpose: to eliminate delays in emergency blood procurement through modern healthcare technology and real-time community engagement.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <FiHeart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To build a seamless, transparent digital ecosystem that empowers willing blood donors and connects them instantly with hospitals and patients facing critical medical emergencies.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiEye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A world where no patient suffers or succumbs to preventable delays in obtaining safe blood supplies, supported by a proactive, nationwide network of registered donors.
            </p>
          </div>
        </div>
      </section>

      {/* Why Blood Donation Matters */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Why Blood Donation Matters</h2>
            <p className="text-sm text-slate-600">Blood cannot be manufactured synthetically; human donors are the sole source.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-lg">Emergency Trauma Care</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Accident victims and emergency surgery patients frequently require immediate blood transfusions within the golden hour.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-lg">Chronic Conditions</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Patients with Thalassemia, Anemia, and Cancer depend on continuous blood and platelet donations for survival.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-lg">Maternal Healthcare</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complications during childbirth often demand emergency blood units to safeguard mothers and newborns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Core Values & Security */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Platform Security & Values</h2>
          <p className="text-sm text-slate-600">Built with rigorous data protection standards and healthcare compliance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiShield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verified Healthcare Providers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every hospital account is verified by our administration team using official facility registration licenses before issuing blood requests.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <FiLock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Data Privacy Guarantee</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Donor contact information is protected and strictly disclosed only for genuine emergency blood matches.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiUsers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Community Driven</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Powered by thousands of compassionate individuals dedicated to supporting their local medical facilities.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 text-center text-white space-y-6">
          <h2 className="text-3xl font-bold">Ready to make a life-saving impact?</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of registered donors and verified partner hospitals today.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="shadow-lg">
                Become a Donor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
