/**
 * Validates individual password requirements
 * @param {string} password 
 * @returns {object} Breakdown of requirement compliance
 */
export const checkPasswordRequirements = (password = '') => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaMet = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const isValid = minLength && hasUpper && hasLower && hasNumber && hasSpecial;

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    criteriaMet,
    totalCriteria: 5,
    isValid
  };
};

/**
 * Calculates overall password strength level: Weak, Medium, or Strong
 * @param {string} password 
 * @returns {object} { level, label, color, barColor, score, percent }
 */
export const calculatePasswordStrength = (password = '') => {
  if (!password) {
    return {
      level: 'none',
      label: '',
      color: 'text-slate-500',
      barColor: 'bg-slate-700',
      badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
      score: 0,
      percent: 0,
      isStrong: false
    };
  }

  const { minLength, hasUpper, hasLower, hasNumber, hasSpecial, isValid } = checkPasswordRequirements(password);

  if (isValid) {
    return {
      level: 'strong',
      label: 'Strong',
      color: 'text-emerald-400',
      barColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
      score: 3,
      percent: 100,
      isStrong: true
    };
  }

  // Count character diversity (uppercase, lowercase, number, special)
  const typeDiversity = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  // Medium: at least 8 characters AND at least 3 character types, OR 4 character types
  if ((minLength && typeDiversity >= 3) || typeDiversity >= 4) {
    return {
      level: 'medium',
      label: 'Medium',
      color: 'text-amber-400',
      barColor: 'bg-amber-500',
      badgeBg: 'bg-amber-950/80 text-amber-400 border-amber-500/40',
      score: 2,
      percent: 66,
      isStrong: false
    };
  }

  // Weak: fewer than 3 character types or fewer than 8 characters
  return {
    level: 'weak',
    label: 'Weak',
    color: 'text-rose-400',
    barColor: 'bg-rose-500',
    badgeBg: 'bg-rose-950/80 text-rose-400 border-rose-500/40',
    score: 1,
    percent: 33,
    isStrong: false
  };
};
