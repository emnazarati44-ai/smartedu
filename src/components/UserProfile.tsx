import React, { useEffect, useState } from 'react';
import { User, Mail, Calendar, BookOpen, Award, ArrowRight, Loader2, Camera, X, Check, Link2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCourses } from '@/lib/database';
import type { Course } from '@/data/courses';

interface UserProfileProps {
  onSelectCourse: (courseId: string) => void;
}

const roleBadgeColors: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700 border-blue-200',
  professor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  admin: 'bg-purple-100 text-purple-700 border-purple-200',
};

const presetAvatars = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
];

const UserProfile: React.FC<UserProfileProps> = ({ onSelectCourse }) => {
  const { user, updateUserAvatar } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [avatarTab, setAvatarTab] = useState<'presets' | 'url'>('presets');

  useEffect(() => {
    if (user) loadEnrolled();
  }, [user]);

  const loadEnrolled = async () => {
    if (!user) return;
    setLoading(true);
    const allCourses = await fetchCourses();
    const enrolled = allCourses
      .filter((c) => user.enrolledCourses.includes(c.id))
      .map((c) => ({
        id: c.id,
        title: c.title,
        code: c.code,
        department: c.department,
        professor_name: c.professor_name,
        professor_avatar: c.professor_avatar,
        professor_id: c.professor_id,
        semester: c.semester,
        credits: c.credits,
        max_capacity: c.max_capacity,
        enrollment_count: c.enrollment_count || 0,
        description: c.description,
        image: c.image,
        level: c.level,
        rating: c.rating,
        modules: [],
        announcements: [],
      }));
    setEnrolledCourses(enrolled);
    setLoading(false);
  };

  const handleAvatarSave = async (url: string) => {
    if (!url.trim()) return;
    setAvatarSaving(true);
    setAvatarSuccess(false);
    const success = await updateUserAvatar(url.trim());
    if (success) {
      setAvatarSuccess(true);
      setTimeout(() => {
        setShowAvatarModal(false);
        setAvatarSuccess(false);
        setAvatarUrl('');
      }, 1000);
    }
    setAvatarSaving(false);
  };

  if (!user) return null;

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
          <div className="h-36 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
          </div>
          <div className="px-6 pb-6 -mt-14">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar with edit button */}
              <div className="relative group">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-28 h-28 rounded-2xl border-4 border-white object-cover shadow-xl"
                />
                <button
                  onClick={() => { setShowAvatarModal(true); setAvatarUrl(''); setAvatarSuccess(false); }}
                  className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200 cursor-pointer border-4 border-transparent"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
                    <Camera className="w-6 h-6 text-white" />
                    <span className="text-xs text-white font-medium">Change</span>
                  </div>
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border ${roleBadgeColors[user.role]}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{user.email}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  {user.role === 'professor' && user.subject && (
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{user.subject}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Change Modal */}
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAvatarModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Change Profile Photo
                  </h2>
                  <button onClick={() => setShowAvatarModal(false)} className="p-1 rounded-full hover:bg-white/20 transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Success message */}
                {avatarSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2 text-green-700 text-sm">
                    <Check className="w-4 h-4" />
                    Profile photo updated!
                  </div>
                )}

                {/* Current avatar preview */}
                <div className="flex justify-center mb-5">
                  <img
                    src={avatarUrl || user.avatar}
                    alt="Preview"
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-gray-100 shadow-lg"
                    onError={(e) => { (e.target as HTMLImageElement).src = user.avatar; }}
                  />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
                  <button
                    onClick={() => setAvatarTab('presets')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                      avatarTab === 'presets' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Choose Avatar
                  </button>
                  <button
                    onClick={() => setAvatarTab('url')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                      avatarTab === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    Image URL
                  </button>
                </div>

                {avatarTab === 'presets' ? (
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {presetAvatars.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setAvatarUrl(url)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200 hover:scale-105 ${
                          avatarUrl === url
                            ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                        {avatarUrl === url && (
                          <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Paste an image URL</label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/my-photo.jpg"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">Use a direct link to a .jpg, .png, or .webp image</p>
                  </div>
                )}

                {/* Save button */}
                <button
                  onClick={() => handleAvatarSave(avatarUrl)}
                  disabled={!avatarUrl.trim() || avatarSaving || avatarSuccess}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {avatarSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                  ) : avatarSuccess ? (
                    <><Check className="w-4 h-4" />Saved!</>
                  ) : (
                    <><Camera className="w-4 h-4" />Save Photo</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.enrolledCourses.length}</p>
            <p className="text-sm text-gray-500">Enrolled Courses</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 capitalize">{user.role}</p>
            <p className="text-sm text-gray-500">Account Type</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <User className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">Active</p>
            <p className="text-sm text-gray-500">Status</p>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {user.role === 'professor' ? 'Your Courses' : 'Enrolled Courses'}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div>
          ) : enrolledCourses.length > 0 ? (
            <div className="space-y-3">
              {enrolledCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => onSelectCourse(course.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all group text-left"
                >
                  <img src={course.image} alt={course.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition truncate">{course.title}</h3>
                    <p className="text-xs text-gray-500">{course.code} · {course.professor_name}</p>
                    <p className="text-xs text-gray-400 mt-1">{course.department} · {course.semester}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition flex-shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No courses enrolled yet. Browse the catalog to get started!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
