import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-slate-50 text-center">
      <div className="max-w-md space-y-6">
        <div className="text-8xl font-black text-brand-600 tracking-tighter">404</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page you are searching for does not exist or has been moved within the BloodConnect platform.
          </p>
        </div>
        <Link to="/" className="inline-block">
          <Button icon={FiHome} size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
