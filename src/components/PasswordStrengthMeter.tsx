
import React, { useEffect, useState } from 'react';
import { calculatePasswordStrength, getPasswordStrengthInfo } from '@/lib/encryptionUtils';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0);
  const [animation, setAnimation] = useState(false);
  
  useEffect(() => {
    const newStrength = calculatePasswordStrength(password);
    setStrength(newStrength);
    
    // Trigger animation on strength change
    setAnimation(true);
    const timeout = setTimeout(() => setAnimation(false), 300);
    
    return () => clearTimeout(timeout);
  }, [password]);
  
  const { label, color } = getPasswordStrengthInfo(strength);
  
  // Convert strength to percentage
  const strengthPercent = (strength / 5) * 100;
  
  // Don't show for empty passwords
  if (!password) return null;
  
  return (
    <div className="space-y-1 mt-1">
      <div className="flex justify-between items-center">
        <Progress 
          value={strengthPercent} 
          className={`h-1 transition-all ${animation ? 'scale-y-150' : ''} ${color} bg-secondary`}
          style={{ backgroundColor: 'var(--secondary)' }}
        />
      </div>
      <p className={`text-xs transition-all ${animation ? 'text-primary' : 'text-muted-foreground'}`}>
        Password strength: <span className="font-medium">{label}</span>
      </p>
      {strength < 3 && (
        <p className="text-xs text-amber-500">
          Try adding numbers, symbols, and varying character case
        </p>
      )}
    </div>
  );
}
