
import React from 'react';
import { EncryptionAlgorithm } from '@/lib/types';
import { algorithmDetails } from '@/lib/encryptionUtils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HelpCircle, Shield, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AlgorithmSelectorProps {
  selectedAlgorithm: EncryptionAlgorithm;
  onChange: (algorithm: EncryptionAlgorithm) => void;
}

export function AlgorithmSelector({ selectedAlgorithm, onChange }: AlgorithmSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Encryption Algorithm</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>Choose the encryption algorithm that best suits your security needs.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <RadioGroup
        value={selectedAlgorithm}
        onValueChange={(value) => onChange(value as EncryptionAlgorithm)}
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        {Object.entries(algorithmDetails).map(([algo, details]) => (
          <div key={algo} className="space-y-1">
            <RadioGroupItem
              value={algo}
              id={`algorithm-${algo}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`algorithm-${algo}`}
              className={`flex flex-col p-3 rounded-lg border-2 cursor-pointer hover:bg-secondary/50 transition-all
                ${selectedAlgorithm === algo ? 'border-primary bg-primary/10' : 'border-muted'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{details.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">
                    {Array(details.strengthLevel).fill('■').join('')}
                  </span>
                  <Shield className="h-3 w-3 text-primary" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground truncate max-w-[70%]">{details.useCase}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">
                    {Array(details.speed).fill('■').join('')}
                  </span>
                  <Zap className="h-3 w-3 text-amber-500" />
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
