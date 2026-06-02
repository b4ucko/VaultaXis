
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlgorithmSelector } from './AlgorithmSelector';
import { EncryptionProfile, EncryptionAlgorithm } from '@/lib/types';
import { getEncryptionProfiles, saveEncryptionProfile } from '@/lib/encryptionUtils';
import { PlusCircle, Save, Trash2 } from 'lucide-react';

interface ProfileSelectorProps {
  selectedProfile: EncryptionProfile;
  onProfileChange: (profile: EncryptionProfile) => void;
}

export function ProfileSelector({
  selectedProfile,
  onProfileChange
}: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<EncryptionProfile[]>(getEncryptionProfiles());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingProfile, setEditingProfile] = useState<EncryptionProfile>({
    id: '',
    name: '',
    algorithm: 'AES-256',
    compressionEnabled: true
  });
  
  const handleSelectProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      onProfileChange(profile);
    }
  };
  
  const openNewProfileDialog = () => {
    setIsCreatingNew(true);
    setEditingProfile({
      id: `profile-${Date.now()}`,
      name: 'New Profile',
      algorithm: 'AES-256',
      compressionEnabled: true
    });
    setEditDialogOpen(true);
  };
  
  const openEditProfileDialog = () => {
    setIsCreatingNew(false);
    setEditingProfile({...selectedProfile});
    setEditDialogOpen(true);
  };
  
  const handleSaveProfile = () => {
    // Validate
    if (!editingProfile.name.trim()) {
      return; // Don't save without a name
    }
    
    saveEncryptionProfile(editingProfile);
    
    // Refresh profiles list
    const updatedProfiles = getEncryptionProfiles();
    setProfiles(updatedProfiles);
    
    // Select the newly created/edited profile
    onProfileChange(editingProfile);
    
    // Close dialog
    setEditDialogOpen(false);
  };
  
  return (
    <>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="encryption-profile" className="text-sm font-medium mb-1 block">
            Encryption Profile
          </Label>
          <Select value={selectedProfile.id} onValueChange={handleSelectProfile}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a profile" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={openEditProfileDialog} title="Edit Profile">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={openNewProfileDialog} title="New Profile">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isCreatingNew ? 'Create New Profile' : 'Edit Profile'}
            </DialogTitle>
            <DialogDescription>
              Configure your encryption settings and preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Profile Name</Label>
              <Input 
                id="profile-name" 
                value={editingProfile.name} 
                onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})}
                placeholder="My Profile"
              />
            </div>
            
            <AlgorithmSelector 
              selectedAlgorithm={editingProfile.algorithm}
              onChange={(algorithm: EncryptionAlgorithm) => 
                setEditingProfile({...editingProfile, algorithm})
              }
            />
            
            <div className="flex items-center justify-between">
              <Label htmlFor="compression-toggle" className="text-sm font-medium">
                Enable Compression
              </Label>
              <Switch 
                id="compression-toggle"
                checked={editingProfile.compressionEnabled}
                onCheckedChange={(checked) => 
                  setEditingProfile({...editingProfile, compressionEnabled: checked})
                }
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              {isCreatingNew ? 'Create Profile' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
