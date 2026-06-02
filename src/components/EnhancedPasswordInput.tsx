
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

interface EnhancedPasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showGenerator?: boolean;
  showStrength?: boolean;
}

export function EnhancedPasswordInput({
  password,
  setPassword,
  label = "Password",
  placeholder = "Enter encryption password...",
  required = true,
  showGenerator = true,
  showStrength = true
}: EnhancedPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const generatePassword = () => {
    // Generate a strong random password
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
    let newPassword = "";
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    
    setPassword(newPassword);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="password">{label}</Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="pr-20" // Extra space for both buttons
        />
        <div className="absolute right-0 top-0 h-full flex">
          {showGenerator && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-full aspect-square"
              onClick={generatePassword}
              title="Generate strong password"
            >
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Generate password</span>
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-full aspect-square"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
      </div>
      {showStrength && <PasswordStrengthMeter password={password} />}
    </div>
  );
}
