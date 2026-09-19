import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import {
  FiUserPlus,
  FiSearch,
  FiFileText,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiHeart,
  FiArrowRight,
  FiCheckSquare,
  FiClock,
  FiActivity,
} from 'react-icons/fi';

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Register',
      desc: 'Donors create an account and provide their blood group, location, availability, and basic profile information.',
      icon: FiUserPlus,
      color: 'bg-red-50 text-red-600 border-red-200',
    },
    {
      num: '02',
      title: 'Find Blood Requests',
      desc: 'Hospitals create real emergency blood requests. Available donors can see active requests matching their requirements.',
      icon: FiSearch,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      num: '03',
      title: 'Respond to a Request',
      desc: 'A donor selects a blood request and submits the donor response form with age, weight, blood group, last donation information, availability, and health declaration.',
      icon: FiFileText,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      num: '04',
      title: 'Admin Verification',
      desc: 'The response is sent to the BloodConnect admin portal. The admin reviews the donor information, donation history, eligibility information, and blood request.',
      icon: FiShield,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      hasOutcome: true,
    },
  ];

  const workflowFlow = [
    { title: 'Hospital', desc: 'Medical center logged in' },
    { title: 'Creates Blood Request', desc: 'Saved to MongoDB Atlas as pending' },
    { title: 'Donor Views Request', desc: 'Filtered active requests displayed' },
    { title: 'Donor Submits Response', desc: 'Eligibility form sent to Admin' },
    { title: 'Admin Reviews', desc: 'Software checks interval & criteria' },
    { title: 'Approved', desc: 'Request closed & fulfilled' },
    { title: 'Donation Completed', desc: 'Logged in system records' },
    { title: 'Donor History Updated', desc: 'Reflected on donor profile' },
  ];

  return (
    <div className="space-y-16 pb-16 bg-slate-50">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 text-red-400 text-xs font-bold border border-red-500/30 uppercase tracking-wider">
            <FiHeart className="w-3.5 h-3.5 fill-current" />
            <span>BloodConnect Step-By-Step Guide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            How <span className="text-brand-500 underline decoration-brand-400">BloodConnect</span> Works
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Connecting donors, hospitals, and patients through a simple, transparent, and secure blood donation process powered by real MongoDB Atlas APIs.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700 font-bold shadow-lg">
                Become a Donor
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="bg-slate-800 text-white hover:bg-slate-700 border-slate-700">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 STEPS PROCESS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600">Simple 4-Step Process</h2>
          <p className="text-3xl font-extrabold text-slate-900">Four Steps to Save a Life</p>
          <p className="text-xs sm:text-sm text-slate-600">
            From registration to verified fulfillment, BloodConnect ensures safe and rapid blood donation matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Step {step.num}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{step.desc}</p>
                </div>

                {step.hasOutcome && (
                  <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] font-semibold">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-start gap-1.5">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>If Approved:</strong> Donor Approved • Request Fulfilled • Donation Logged
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-1.5">
                      <FiXCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>If Rejected:</strong> Response Rejected • Request Remains Active
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FROM REQUEST TO DONATION WORKFLOW */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600">System Lifecycle</h2>
            <p className="text-3xl font-extrabold text-slate-900">From Request to Donation</p>
            <p className="text-xs sm:text-sm text-slate-600">
              Complete end-to-end data lifecycle managed transparently by system administrators.
            </p>
          </div>

          {/* Workflow Sequence */}
          <div className="max-w-4xl mx-auto space-y-3">
            {workflowFlow.map((item, index) => (
              <React.Fragment key={index}>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <FiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                </div>

                {index < workflowFlow.length - 1 && (
                  <div className="flex justify-center my-1 text-brand-600 font-bold text-lg">
                    ↓
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-red-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-3xl font-extrabold">Ready to Save a Life?</h2>
            <p className="text-xs sm:text-sm text-brand-100 max-w-xl leading-relaxed">
              Register as a donor or hospital today and join our real-time emergency blood donation network.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-white text-brand-700 hover:bg-slate-100 border-none font-bold shadow-lg">
                Become a Donor
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full bg-slate-900 text-white hover:bg-slate-800 border-slate-800 font-semibold">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HowItWorks;
