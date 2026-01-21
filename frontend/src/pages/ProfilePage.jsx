import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Bell, Settings, Lock, Moon, Sun, Save } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    priceAlerts: true,
    marketUpdates: false,
    weeklyReports: true,
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // TODO: Call API to update profile
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleSavePreferences = async () => {
    try {
      // TODO: Call API to update preferences
      toast.success('Preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Settings className="w-7 h-7 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Account Settings
            </h1>
            <p className="text-gray-400">
              Manage your profile and preferences
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-gray-900/50 rounded-lg border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">
              Profile Information
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-black text-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-black text-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-black text-white focus:ring-2 focus:ring-cyan-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-white/10 rounded-lg bg-black text-white focus:ring-2 focus:ring-cyan-500"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Profile
            </button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="bg-gray-900/50 rounded-lg border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(preferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-400">
                    Receive notifications for {key.toLowerCase()}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handleSavePreferences}
            className="mt-6 flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Preferences
          </button>
        </div>

        {/* Appearance */}
        <div className="bg-gray-900/50 rounded-lg border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            {darkMode ? (
              <Moon className="w-6 h-6 text-cyan-400" />
            ) : (
              <Sun className="w-6 h-6 text-cyan-400" />
            )}
            <h2 className="text-xl font-semibold text-white">
              Appearance
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Dark Mode</p>
              <p className="text-sm text-gray-400">
                Use dark theme across the application
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-gray-900/50 rounded-lg border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">
              Security
            </h2>
          </div>

          <button className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
