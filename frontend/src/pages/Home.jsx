import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BloodGroupBadge from '../components/BloodGroupBadge';
import Button from '../components/Button';
import {
  FiHeart,
  FiSearch,
  FiUserPlus,
  FiActivity,
  FiShield,
  FiPhoneCall,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiUsers,
  FiClock,
  FiAward,
} from 'react-icons/fi';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const stats = [
    { label: 'Registered Donors', value: '10,000+', icon: FiUsers, color: 'text-brand-600 bg-brand-50' },
    { label: 'Partner Hospitals', value: '500+', icon: FiActivity, color: 'text-blue-600 bg-blue-50' },
    { label: 'Successful Donations', value: '5,000+', icon: FiHeart, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Community Support', value: '24/7', icon: FiClock, color: 'text-amber-600 bg-amber-50' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Register Profile',
      desc: 'Sign up as a donor or hospital in less than 2 minutes with secure details.',
      icon: FiUserPlus,
    },
    {
      step: '02',
      title: 'Find or Request Blood',
      desc: 'Hospitals post urgent requests; donors view active requirements in real time.',
      icon: FiSearch,
    },
    {
      step: '03',
      title: 'Connect Quickly',
      desc: 'Instant matching enables rapid contact between donors and verified hospitals.',
      icon: FiActivity,
    },
    {
      step: '04',
      title: 'Donate & Save Lives',
      desc: 'Complete the donation safely and make an immediate impact on lives.',
      icon: FiHeart,
    },
  ];

  const whyDonate = [
    {
      title: 'Save Human Lives',
      desc: 'A single blood donation can save up to 3 lives in emergency situations.',
      icon: FiHeart,
    },
    {
      title: 'Help Your Community',
      desc: 'Ensure local blood banks and emergency centers are always equipped for crises.',
      icon: FiUsers,
    },
    {
      title: 'Simple & Safe Process',
      desc: 'Donation takes under 30 minutes under professional medical supervision.',
      icon: FiShield,
    },
    {
      title: 'Make a Direct Impact',
      desc: 'Experience the satisfaction of directly rescuing accident victims and patients.',
      icon: FiAward,
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Chief Medical Officer, City Hospital',
      quote:
        'BloodConnect has significantly cut down our emergency blood procurement turnaround time. It is an indispensable platform for medical teams.',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Priya Sharma',
      role: 'Regular O- Donor',
      quote:
        'Registering on BloodConnect allowed me to respond to urgent requests in my city. Knowing my donation saved a life is priceless.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Anil Verma',
      role: 'Recipient Family Member',
      quote:
        'When my father needed emergency B+ blood during surgery, BloodConnect donors answered our call within 20 minutes.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How do I become a donor?',
      a: 'Click "Become a Donor", fill out your basic personal details, blood group, location, and set your availability status. You can update your profile anytime.',
    },
    {
      q: 'How do I request blood?',
      a: 'Registered partner hospitals can create urgent blood requests specifying blood group, required units, and urgency level directly from their dashboard.',
    },
    {
      q: 'Can hospitals register?',
      a: 'Yes, hospitals and blood banks can register by submitting their facility license details. Accounts undergo verification by system administrators for safety.',
    },
    {
      q: 'Is my personal information secure?',
      a: 'Absolutely. BloodConnect enforces JWT authentication, encrypted passwords, and stringent data security standards to protect all user data.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="hero-gradient pt-12 pb-20 border-b border-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold border border-brand-200">
                <FiHeart className="w-3.5 h-3.5 fill-current" />
                <span>Real-Time Blood Matching Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Every Drop Can <span className="text-brand-600 underline decoration-brand-200">Save a Life</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                BloodConnect helps donors, hospitals, and communities connect quickly when blood is needed. Join our mission to bridge critical emergency supply gaps.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto shadow-md">
                    Become a Donor
                  </Button>
                </Link>
                <Link to="/register?role=hospital">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Register Hospital
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-500">
                <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Connecting people. Supporting communities. Saving lives.</span>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="relative flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100 rounded-full blur-3xl opacity-60"></div>
                
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                      🩸
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Urgent Request</h3>
                      <p className="text-xs text-slate-500">City Hospital Emergency Center</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 rounded-full border border-red-200 animate-pulse">
                    HIGH URGENCY
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-medium text-slate-600">Required Group:</span>
                    <BloodGroupBadge bloodGroup="O-" size="lg" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-medium text-slate-600">Units Needed:</span>
                    <span className="text-sm font-bold text-slate-900">3 Units</span>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-xs font-semibold text-emerald-800">
                      12 Verified Donors Available Nearby
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t text-center">
                  <Link to="/login" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                    Sign in to view active emergency requests →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow text-center space-y-3"
              >
                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600">Simple 4-Step Process</h2>
          <p className="text-3xl font-bold text-slate-900">How BloodConnect Works</p>
          <p className="text-sm text-slate-600">Connecting donors and healthcare facilities seamlessly in critical moments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative bg-white p-6 rounded-2xl border border-slate-200 space-y-4 hover:border-brand-300 transition-colors group">
                <span className="text-4xl font-extrabold text-slate-100 group-hover:text-brand-100 transition-colors">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Blood Groups Grid */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Compatible Blood Groups</h2>
            <p className="text-sm text-slate-600">All major blood groups supported on BloodConnect platform.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {bloodGroups.map((bg) => (
              <div
                key={bg}
                className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
              >
                <BloodGroupBadge bloodGroup={bg} size="lg" />
                <span className="text-xs text-slate-500 font-medium group-hover:text-brand-600">
                  Ready for matching
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900">Why Donate Blood?</h2>
          <p className="text-sm text-slate-600">Blood donation is a selfless act that transforms lives across communities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyDonate.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Trusted by Medical Professionals & Donors</h2>
            <p className="text-sm text-slate-400">Real stories from people making a difference every day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4 flex flex-col justify-between">
                <p className="text-xs text-slate-300 italic leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-brand-500" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-red-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Someone may need your blood today.</h2>
            <p className="text-sm text-brand-100 max-w-xl">
              Register as a donor now and stay available for emergency requests in your city.
            </p>
          </div>
          <Link to="/register">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-slate-100 border-none font-bold shadow-lg">
              Become a Donor Now
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-600">Find quick answers about the BloodConnect platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-colors">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-slate-900 focus:outline-none"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <FiChevronUp className="w-5 h-5 text-brand-600" /> : <FiChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
