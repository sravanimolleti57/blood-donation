import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import AnimatedSection from '../components/ui/AnimatedSection';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageSquare, FiShield } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setToast({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({
        type: 'success',
        message: 'Thank you for reaching out! Your message has been received by our support team.',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AnimatedSection className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-brand-200">
          <FiMessageSquare className="w-3.5 h-3.5" />
          24/7 Platform Support
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Get in Touch</h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Have questions about donor registration, hospital verification, or platform support? Our administrative desk is here to help.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Side: Info */}
        <AnimatedSection className="bg-slate-950 text-white p-8 sm:p-10 rounded-3xl space-y-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reach out to our platform support desk or emergency administrative coordination team.
            </p>
          </div>

          <div className="space-y-6 text-sm">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center shrink-0 border border-slate-800 shadow-inner">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Email Address</h4>
                <p className="text-slate-300 text-xs mt-0.5">support@bloodconnect.org</p>
                <p className="text-slate-400 text-[11px]">emergency@bloodconnect.org</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center shrink-0 border border-slate-800 shadow-inner">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Emergency Support Line</h4>
                <p className="text-slate-300 text-xs mt-0.5">+91 1800-123-BLOOD (25663)</p>
                <p className="text-slate-400 text-[11px]">24/7 Helpline for medical emergencies</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center shrink-0 border border-slate-800 shadow-inner">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Headquarters</h4>
                <p className="text-slate-300 text-xs mt-0.5">BloodConnect HealthTech Center</p>
                <p className="text-slate-400 text-[11px]">Central Medical District, Tower B, Level 4</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center shrink-0 border border-slate-800 shadow-inner">
                <FiClock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Operating Hours</h4>
                <p className="text-slate-300 text-xs mt-0.5">Emergency Dispatch: 24/7 Continuous</p>
                <p className="text-slate-400 text-[11px]">General Inquiries: Mon - Sat (9:00 AM - 6:00 PM)</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <FiShield className="w-4 h-4 text-emerald-400" />
            <span>Encrypted transmission & secure handling of support queries.</span>
          </div>
        </AnimatedSection>

        {/* Right Side: Form */}
        <AnimatedSection className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>
            <p className="text-xs text-slate-500">Fill out the form below and our team will get back to you promptly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                placeholder="10-digit mobile"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Subject"
              name="subject"
              placeholder="How can we help you?"
              value={formData.subject}
              onChange={handleChange}
            />

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                Message <span className="text-brand-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message or inquiry here..."
                required
                className="w-full rounded-xl border border-slate-300 p-3.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 transition-all outline-none"
              ></textarea>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg" icon={FiSend} className="shadow-md">
              Send Message
            </Button>
          </form>
        </AnimatedSection>

      </div>
    </div>
  );
};

export default Contact;
