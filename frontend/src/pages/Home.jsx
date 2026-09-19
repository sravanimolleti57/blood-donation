import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Button from '../components/Button';
import Blood3DVisual from '../components/3d/Blood3DVisual';
import BloodParticles from '../components/3d/BloodParticles';
import AnimatedSection from '../components/ui/AnimatedSection';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import BloodGroupCard from '../components/ui/BloodGroupCard';
import {
  FiHeart,
  FiSearch,
  FiUserPlus,
  FiActivity,
  FiShield,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiUsers,
  FiClock,
  FiAward,
  FiDroplet,
  FiCheckSquare,
  FiFileText,
  FiArrowRight,
} from 'react-icons/fi';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [apiStats, setApiStats] = useState({
    totalDonors: 0,
    totalHospitals: 0,
    totalDonations: 0,
    activeBloodRequests: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchLiveStats();
  }, []);

  const fetchLiveStats = async () => {
    try {
      // Try admin dashboard stats API if token present or fallback to stats query
      const { data } = await API.get('/admin/dashboard/stats');
      if (data.success) {
        setApiStats({
          totalDonors: data.data.totalDonors || 0,
          totalHospitals: data.data.totalHospitals || 0,
          totalDonations: data.data.totalDonations || 0,
          activeBloodRequests: data.data.activeBloodRequests || data.data.pendingBloodRequests || 0,
        });
      }
    } catch (err) {
      // Fetch public count fallback if non-admin token
      try {
        const reqRes = await API.get('/blood-requests?status=active');
        if (reqRes.data.success) {
          setApiStats((prev) => ({
            ...prev,
            activeBloodRequests: reqRes.data.count || reqRes.data.data?.length || 0,
          }));
        }
      } catch (e) {
        console.error('Stats load error:', e);
      }
    } finally {
      setStatsLoading(false);
    }
  };

  const steps = [
    {
      step: '01',
      title: 'Register',
      desc: 'Donors create an account providing blood group, location, availability, and basic profile info.',
      icon: FiUserPlus,
      color: 'bg-red-50 text-red-600 border-red-200',
    },
    {
      step: '02',
      title: 'Find Blood Request',
      desc: 'Hospitals post real emergency blood requests. Donors see active requirements matching their criteria.',
      icon: FiSearch,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      step: '03',
      title: 'Respond',
      desc: 'Donor selects a request and submits response form with age, weight, donation interval, and health status.',
      icon: FiFileText,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      step: '04',
      title: 'Admin Verification',
      desc: 'System admins review donor response, donation history, and software eligibility prior to acceptance.',
      icon: FiShield,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
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
      desc: 'Ensure local blood banks and emergency centers are equipped for critical moments.',
      icon: FiUsers,
    },
    {
      title: 'Simple & Safe Process',
      desc: 'Donation takes under 30 minutes under professional medical supervision.',
      icon: FiShield,
    },
    {
      title: 'Make a Direct Impact',
      desc: 'Experience the deep satisfaction of directly rescuing accident victims and patients.',
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
      q: 'How do hospitals post blood requests?',
      a: 'Registered partner hospitals log into their dashboard and specify blood group, required units, urgency, address, and contact details.',
    },
    {
      q: 'How does admin verification work?',
      a: 'Admin reviews submitted donor responses against software eligibility rules (age 18-65, weight >= 45kg, 6-month interval, active account, available status) before approving.',
    },
    {
      q: 'Is my personal information secure?',
      a: 'Yes. BloodConnect enforces JWT authentication, encrypted passwords, and strict authorization standards to protect user data.',
    },
  ];

  return (
    <div className="space-y-20 pb-16 bg-slate-50 overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. HERO SECTION WITH 3D BLOOD VISUAL */}
      {/* ============================================================ */}
      <section className="relative pt-10 pb-20 border-b border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white overflow-hidden">
        <BloodParticles density={35} opacity={0.3} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/30 uppercase tracking-widest backdrop-blur-xs">
                <FiHeart className="w-3.5 h-3.5 fill-current" />
                <span>REAL-TIME BLOOD DONATION PLATFORM</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Every Drop Can <br />
                <span className="text-brand-500 underline decoration-brand-400">Save a Life</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connecting donors, hospitals, and communities when every second matters. Real-time emergency blood matching with verified administrator oversight.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-brand-600 hover:bg-brand-700 font-bold shadow-lg shadow-brand-600/30 border-none transition-transform hover:-translate-y-0.5">
                    Become a Donor
                  </Button>
                </Link>
                <Link to="/register?role=hospital" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full bg-slate-800 text-white hover:bg-slate-700 border-slate-700 font-semibold">
                    Register Hospital
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-400">
                <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Verified healthcare network • JWT secure • Real-time notifications</span>
              </div>
            </div>

            {/* Hero Right 3D Scene Container */}
            <div className="relative">
              <Blood3DVisual />
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. REAL DATA ANIMATED STATISTICS SECTION */}
      {/* ============================================================ */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all text-center space-y-3 group">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiUsers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900">
                <AnimatedCounter value={apiStats.totalDonors} />
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Donors</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all text-center space-y-3 group">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiActivity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900">
                <AnimatedCounter value={apiStats.totalHospitals} />
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Partner Hospitals</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all text-center space-y-3 group">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiCheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900">
                <AnimatedCounter value={apiStats.totalDonations} />
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Completed Donations</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all text-center space-y-3 group">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiDroplet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900">
                <AnimatedCounter value={apiStats.activeBloodRequests} />
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active Requests</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/* 3. HOW IT WORKS SECTION WITH CONNECTING FLOW */}
      {/* ============================================================ */}
      <AnimatedSection id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-600">Transparent Lifecycle</h2>
          <p className="text-3xl font-extrabold text-slate-900">How BloodConnect Works</p>
          <p className="text-xs sm:text-sm text-slate-600">
            Four simple steps connecting healthcare facilities with verified community donors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-brand-400 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-200 group-hover:text-brand-200 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Lifecycle Diagram */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-center">
            System Workflow Sequence
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-700">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800">Hospital</span>
            <FiArrowRight className="text-brand-600" />
            <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200">Creates Blood Request</span>
            <FiArrowRight className="text-brand-600" />
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">Donor Views Request</span>
            <FiArrowRight className="text-brand-600" />
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">Donor Submits Response</span>
            <FiArrowRight className="text-brand-600" />
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">Admin Reviews</span>
            <FiArrowRight className="text-brand-600" />
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">Approved & Donation Completed</span>
            <FiArrowRight className="text-brand-600" />
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white">Donor History Updated</span>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/* 4. INTERACTIVE 3D BLOOD GROUP CARDS */}
      {/* ============================================================ */}
      <AnimatedSection className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900">Supported Blood Groups</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Interactive matching directory for all major blood group classifications.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {bloodGroups.map((bg) => (
              <BloodGroupCard key={bg} bloodGroup={bg} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/* 5. WHY DONATE SECTION */}
      {/* ============================================================ */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900">Why Donate Blood?</h2>
          <p className="text-xs sm:text-sm text-slate-600">Blood donation is a selfless contribution that transforms lives across communities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyDonate.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{card.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/* 6. TESTIMONIALS */}
      {/* ============================================================ */}
      <AnimatedSection className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black">Trusted by Medical Teams & Donors</h2>
            <p className="text-xs sm:text-sm text-slate-400">Real feedback from healthcare workers and donor volunteers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 space-y-4 flex flex-col justify-between">
                <p className="text-xs text-slate-300 italic leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-brand-500" />
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{t.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/* 7. STRONG DONOR CALL TO ACTION */}
      {/* ============================================================ */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-red-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <BloodParticles density={25} opacity={0.25} />
          
          <div className="space-y-3 text-center md:text-left relative z-10">
            <h2 className="text-3xl font-black">Your Donation Can Save a Life</h2>
            <p className="text-xs sm:text-sm text-brand-100 max-w-xl leading-relaxed font-medium">
              One donation can make a meaningful difference when someone needs blood. Join our verified donor network today.
            </p>
          </div>

          <div className="relative z-10">
            <Link to="/register">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-slate-100 border-none font-extrabold shadow-xl hover:-translate-y-0.5 transition-transform">
                Become a Donor
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================ */}
      {/* 8. FAQ ACCORDION SECTION */}
      {/* ============================================================ */}
      <AnimatedSection className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-600">Quick answers about the BloodConnect platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-colors">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-slate-900 text-sm focus:outline-none"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <FiChevronUp className="w-5 h-5 text-brand-600 shrink-0" /> : <FiChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </AnimatedSection>

    </div>
  );
};

export default Home;
