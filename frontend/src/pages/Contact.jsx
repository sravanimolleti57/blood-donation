import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';

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

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900">Get in Touch</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Have questions about donor registration, hospital verification, or platform support? Our team is available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Info */}
        <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl space-y-8 shadow-xl">
          <div>
            <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
            <p className="text-xs text-slate-400">
              Reach out to our emergency support desk or administrative center directly.
            </p>
          </div>

          <div className="space-y-6 text-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-brand-400 flex items-center justify-center shrink-0 border border-slate-700">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Email Address</h4>
                <p className="text-slate-300 text-xs mt-0.5">support@bloodconnect.org</p>
                <p className="text-slate-400 text-[11px]">emergency@bloodconnect.org</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-brand-400 flex items-center justify-center shrink-0 border border-slate-700">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">24/7 Helpline</h4>
                <p className="text-slate-300 text-xs mt-0.5">+91 1800-123-BLOOD (25663)</p>
                <p className="text-slate-400 text-[11px]">Toll-free emergency helpline</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-brand-400 flex items-center justify-center shrink-0 border border-slate-700">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Headquarters</h4>
                <p className="text-slate-300 text-xs mt-0.5">BloodConnect Innovation Hub</p>
                <p className="text-slate-400 text-[11px]">Central Medical District, Tower B, Level 4</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-brand-400 flex items-center justify-center shrink-0 border border-slate-700">
                <FiClock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Operating Hours</h4>
                <p className="text-slate-300 text-xs mt-0.5">Emergency Desk: 24 Hours / 7 Days</p>
                <p className="text-slate-400 text-[11px]">Admin Support: Mon - Sat (9:00 AM - 6:00 PM)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>
            <p className="text-xs text-slate-500">Fill out the form below and we will respond promptly.</p>
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
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900"
              ></textarea>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg" icon={FiSend}>
              Send Message
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
