import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { checkPasswordRequirements } from '../utils/passwordUtils';
import { User, Mail, Lock, UserPlus, Sparkles, AlertCircle, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }

    // Strong password validation
    const reqs = checkPasswordRequirements(password);
    if (!reqs.isValid) {
      const missingCriteria = [];
      if (!reqs.minLength) missingCriteria.push('at least 8 characters');
      if (!reqs.hasUpper) missingCriteria.push('an uppercase letter');
      if (!reqs.hasLower) missingCriteria.push('a lowercase letter');
      if (!reqs.hasNumber) missingCriteria.push('a number');
      if (!reqs.hasSpecial) missingCriteria.push('a special character (!@#$%^&*)');

      setError(`Password must include ${missingCriteria.join(', ')}.`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both password fields.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <MainLayout>
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create an Account</h2>
            <p className="text-sm text-slate-400">Join AI GitHub Project Analyzer</p>
          </div>

          <Card className="p-8">
            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                icon={User}
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                required
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="alex.rivera@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                required
              />

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  rightElement={
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-400 hover:text-slate-200 focus:outline-none transition-colors p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  required
                />
                {/* Dynamic Password Strength Meter & Checklist */}
                <PasswordStrengthMeter password={password} showRequirements={true} />
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  rightElement={
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="text-slate-400 hover:text-slate-200 focus:outline-none transition-colors p-1"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  required
                />
                {/* Live Password Match Confirmation */}
                {passwordsMatch && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400 pl-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Passwords match</span>
                  </p>
                )}
                {passwordsMismatch && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-400 pl-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Passwords do not match</span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                icon={UserPlus}
                className="w-full mt-2"
              >
                Register
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
