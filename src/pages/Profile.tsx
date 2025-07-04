import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
}

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    display_name: '',
    avatar_url: null,
    bio: null,
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, avatar_url, bio')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: profile.display_name,
        bio: profile.bio,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: error.message,
      });
    } else {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    }
    setUpdating(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // For now, we'll use a placeholder for avatar upload
    // In a real app, you'd upload to Supabase Storage
    toast({
      title: 'Avatar upload not implemented',
      description: 'Avatar upload feature will be added in the next update.',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const initials = profile.display_name
    ? profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Button>
        </div>

        <Card className="bg-chat-sidebar border-border shadow-sidebar">
          <CardHeader>
            <CardTitle className="text-foreground">Edit Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Click the camera icon to upload a new profile picture
                </p>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={profile.display_name}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  placeholder="Enter your display name"
                  className="bg-chat-message-bg border-border"
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="bg-chat-message-bg border-border resize-none"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};