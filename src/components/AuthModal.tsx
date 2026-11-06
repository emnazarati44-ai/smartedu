import React, { useState } from 'react';
import { X, Eye, EyeOff, GraduationCap, BookOpen, Shield, Loader2, Beaker } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Business & Management',
  'Economics',
  'Arts & Humanities',
  'Law',
  'Medicine',
  'Psychology',
  'Data Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Other',
];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [subject, setSubject] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.success) {
          onClose();
          resetForm();
        } else {
          setError(result.error || 'Invalid email or password.');
        }
      } else {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        if (role === 'professor' && !subject) {
          setError('Please select the subject you teach.');
          setLoading(false);
          return;
        }
        const result = await signup(name, email, password, role, role === 'professor' ? subject : undefined);
        if (result.success) {
          setSuccess('Account created successfully! You are now signed in.');
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1500);
        } else {
          setError(result.error || 'Failed to create account.');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('student');
    setSubject('');
    setError('');
    setSuccess('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setSuccess('');
  };

  const roles: { value: UserRole; label: string; desc: string; icon: React.ReactNode; activeClasses: string }[] = [
    {
      value: 'student',
      label: 'Student',
      desc: 'Enroll & learn',
      icon: <GraduationCap className="w-5 h-5" />,
      activeClasses: 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-blue-100 shadow-md',
    },
    {
      value: 'professor',
      label: 'Professor',
      desc: 'Teach & manage',
      icon: <BookOpen className="w-5 h-5" />,
      activeClasses: 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 shadow-emerald-100 shadow-md',
    },
    {
      value: 'admin',
      label: 'Admin',
      desc: 'Full access',
      icon: <Shield className="w-5 h-5" />,
      activeClasses: 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 shadow-purple-100 shadow-md',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-t-2xl p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2 relative">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold">SmartEdu</span>
          </div>
          <h2 className="text-2xl font-bold relative">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-white/80 text-sm mt-1 relative">
            {mode === 'login' ? 'Sign in to continue your learning journey' : 'Join SmartEdu and start learning today'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <span className="text-red-400 mt-0.5">⚠</span>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              {success}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition pr-10"
                placeholder="Min. 6 characters"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => {
                        setRole(r.value);
                        if (r.value !== 'professor') setSubject('');
                      }}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 ${
                        role === r.value ? r.activeClasses : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {r.icon}
                      <span className="text-xs font-semibold">{r.label}</span>
                      <span className="text-[10px] opacity-70">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject selector for professors */}
              {role === 'professor' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Beaker className="w-4 h-4 text-emerald-600" />
                      What subject do you teach?
                    </span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm ${
                      subject ? 'border-emerald-300 bg-emerald-50/30' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Select your subject --</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {!subject && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <span>⚡</span> Required for professor accounts
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="text-center text-sm text-gray-600">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={switchMode} className="text-indigo-600 font-semibold hover:text-indigo-700">
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
