import React from 'react';
import { Check, X, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { checkPasswordRequirements, calculatePasswordStrength } from '../utils/passwordUtils';

const PasswordStrengthMeter = ({ password = '', showRequirements = true }) => {
  if (!password) return null;

  const reqs = checkPasswordRequirements(password);
  const strength = calculatePasswordStrength(password);

  const criteriaItems = [
    { label: 'At least 8 characters', met: reqs.minLength },
    { label: 'One uppercase letter (A-Z)', met: reqs.hasUpper },
    { label: 'One lowercase letter (a-z)', met: reqs.hasLower },
    { label: 'One number (0-9)', met: reqs.hasNumber },
    { label: 'One special character (!@#$%^&*)', met: reqs.hasSpecial },
  ];

  return (
    <div className="w-full space-y-3 pt-1 text-left animate-fadeIn">
      {/* Strength indicator bar and badge */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            {strength.level === 'strong' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : strength.level === 'medium' ? (
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            )}
            Password Strength:
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${strength.badgeBg}`}>
            {strength.label}
          </span>
        </div>

        {/* 3-Segment Progress Bar */}
        <div className="grid grid-cols-3 gap-1.5 h-1.5">
          <div
            className={`rounded-full transition-all duration-300 ${
              strength.score >= 1
                ? strength.score === 1
                  ? 'bg-rose-500'
                  : strength.score === 2
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
                : 'bg-slate-800'
            }`}
          />
          <div
            className={`rounded-full transition-all duration-300 ${
              strength.score >= 2
                ? strength.score === 2
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
                : 'bg-slate-800'
            }`}
          />
          <div
            className={`rounded-full transition-all duration-300 ${
              strength.score >= 3 ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          />
        </div>
      </div>

      {/* Dynamic Requirements Checklist */}
      {showRequirements && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
          <p className="text-[11px] font-medium text-slate-400 mb-1">Password must contain:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
            {criteriaItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
                  item.met ? 'text-emerald-400 font-medium' : 'text-slate-400'
                }`}
              >
                {item.met ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
