import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, UserCheck, X } from 'lucide-react';
import type { User } from '../types';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (user: User) => void;
  onOpenQrUpload?: () => void;
}

const DEMO_ACCOUNTS: User[] = [
  {
    id: 'usr-naga-1',
    name: 'Naga Founder',
    email: 'naga.founder@contraboard.ai',
    role: 'Founder & CEO',
    avatarInitials: 'NF'
  },
  {
    id: 'usr-david-2',
    name: 'David Chen',
    email: 'david.chen@enterprise.io',
    role: 'Lead Architect',
    avatarInitials: 'DC'
  },
  {
    id: 'usr-rachel-3',
    name: 'Rachel Vance',
    email: 'rachel@vancecapital.vc',
    role: 'Venture Investor',
    avatarInitials: 'RV'
  },
  {
    id: 'usr-alex-4',
    name: 'Alex Thorne',
    email: 'alex.thorne@infosec.gov',
    role: 'Chief Security Officer',
    avatarInitials: 'AT'
  }
];

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onOpenQrUpload
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<User['role']>('Founder & CEO');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'credentials' | 'demo'>('credentials');

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide an email and password to access the boardroom.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email.trim(),
      role: selectedRole,
      avatarInitials: email.substring(0, 2).toUpperCase()
    };

    onSignIn(newUser);
  };

  const handleQuickLogin = (user: User) => {
    onSignIn(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0f121d] border border-slate-800 rounded-2xl shadow-2xl shadow-rose-950/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-950/50 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Sign In to ContraBoard
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Access the Adversarial AI Boardroom & Executive Pre-Mortem Studio
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-lg bg-slate-900/80 p-1 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => { setActiveTab('credentials'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'credentials'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Email Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('demo'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'demo'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1-Click Demo Logins
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'credentials' ? (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@venture.com"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300">Your Primary Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as User['role'])}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                >
                  <option value="Founder & CEO">Founder & CEO (Pitch Author)</option>
                  <option value="Lead Architect">Lead Architect (Technical RFC)</option>
                  <option value="Venture Investor">Venture Investor (Due Diligence)</option>
                  <option value="Chief Security Officer">Chief Security Officer (Risk Review)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all"
              >
                <span>Enter Boardroom</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-400 text-left">
                Select a pre-configured role to immediately enter the boardroom with calibrated permissions:
              </p>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleQuickLogin(account)}
                    className="w-full p-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/40 text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center justify-center font-bold text-xs">
                        {account.avatarInitials}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-rose-400 transition-colors">
                          {account.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{account.role}</div>
                      </div>
                    </div>
                    <UserCheck className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Idea QR Scan link */}
          {onOpenQrUpload && (
            <div className="pt-3 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQrUpload();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 inline-flex items-center gap-1.5 transition-colors font-medium"
              >
                <span>Have an idea to scan? Open QR Idea Upload</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
