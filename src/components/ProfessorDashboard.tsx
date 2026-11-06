import React, { useState, useEffect, useCallback } from 'react';
import { Users, BookOpen, TrendingUp, Award, BarChart3, CheckCircle2, Clock, Plus, X, Loader2, Trash2, Star, GraduationCap, Sparkles, Upload, FileText, Layers } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCourses, createCourse, deleteCourse } from '@/lib/database';
import type { DbCourse } from '@/lib/database';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, Area, AreaChart } from 'recharts';

const weeklyEngagement = [
  { week: 'W1', views: 450, submissions: 120, discussions: 85 },
  { week: 'W2', views: 520, submissions: 145, discussions: 92 },
  { week: 'W3', views: 480, submissions: 130, discussions: 78 },
  { week: 'W4', views: 610, submissions: 160, discussions: 105 },
  { week: 'W5', views: 550, submissions: 155, discussions: 98 },
  { week: 'W6', views: 680, submissions: 180, discussions: 120 },
  { week: 'W7', views: 720, submissions: 195, discussions: 135 },
  { week: 'W8', views: 690, submissions: 188, discussions: 128 },
];

const gradeDistribution = [
  { grade: 'A+', count: 15, color: '#6366f1' },
  { grade: 'A', count: 25, color: '#818cf8' },
  { grade: 'A-', count: 20, color: '#a5b4fc' },
  { grade: 'B+', count: 18, color: '#c7d2fe' },
  { grade: 'B', count: 12, color: '#e0e7ff' },
  { grade: 'C+', count: 5, color: '#f59e0b' },
  { grade: 'C', count: 3, color: '#fbbf24' },
];

const ProfessorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    code: '',
    department: user?.subject || 'Computer Science',
    semester: 'Fall 2025',
    credits: 3,
    max_capacity: 100,
    description: '',
    image: '',
    level: 'Beginner' as const,
    modules: '',
  });

  const loadCourses = useCallback(async () => {
    setLoading(true);
    const data = await fetchCourses();
    const filtered = user?.role === 'admin' ? data : data.filter((c) => c.professor_name === user?.name || c.professor_id === user?.id);
    setCourses(filtered);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('courses-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        loadCourses();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments' }, () => {
        loadCourses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadCourses]);

  const handleCreate = async () => {
    if (!user || !newCourse.title || !newCourse.code) return;
    setCreating(true);
    const modules = newCourse.modules.split('\n').filter(Boolean).map((m) => ({ title: m.trim(), duration: '2 weeks' }));
    const result = await createCourse({
      title: newCourse.title,
      code: newCourse.code,
      department: newCourse.department,
      professor_id: user.id,
      professor_name: user.name,
      professor_avatar: user.avatar,
      semester: newCourse.semester,
      credits: newCourse.credits,
      max_capacity: newCourse.max_capacity,
      description: newCourse.description,
      image: newCourse.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
      level: newCourse.level,
      rating: 4.5,
    }, modules);
    if (result) {
      setCourses((prev) => [{ ...result, enrollment_count: 0 }, ...prev]);
      setShowCreate(false);
      setNewCourse({
        title: '', code: '', department: user?.subject || 'Computer Science',
        semester: 'Fall 2025', credits: 3, max_capacity: 100,
        description: '', image: '', level: 'Beginner', modules: '',
      });
    }
    setCreating(false);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const success = await deleteCourse(courseId);
    if (success) setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollment_count || 0), 0);
  const avgRating = courses.length ? (courses.reduce((s, c) => s + c.rating, 0) / courses.length).toFixed(1) : '0';

  const stats = [
    { label: 'Total Students', value: totalStudents.toLocaleString(), icon: <Users className="w-5 h-5" />, gradient: 'from-blue-500 to-cyan-500', bgGlow: 'shadow-blue-200' },
    { label: 'Active Courses', value: courses.length.toString(), icon: <BookOpen className="w-5 h-5" />, gradient: 'from-emerald-500 to-teal-500', bgGlow: 'shadow-emerald-200' },
    { label: 'Avg. Rating', value: avgRating, icon: <Star className="w-5 h-5" />, gradient: 'from-amber-500 to-orange-500', bgGlow: 'shadow-amber-200' },
    { label: 'Total Capacity', value: courses.reduce((s, c) => s + c.max_capacity, 0).toLocaleString(), icon: <Layers className="w-5 h-5" />, gradient: 'from-purple-500 to-pink-500', bgGlow: 'shadow-purple-200' },
  ];

  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                {user?.role === 'admin' ? <GraduationCap className="w-7 h-7 text-white" /> : <BookOpen className="w-7 h-7 text-white" />}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {user?.role === 'admin' ? 'Admin Dashboard' : 'Professor Dashboard'}
                </h1>
                <p className="text-white/70 text-sm">
                  Welcome back, <span className="text-white font-medium">{user?.name}</span>
                  {user?.subject && <span className="text-white/50"> • {user.subject}</span>}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition shadow-lg group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              Create Course
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-200 ${stat.bgGlow} group`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Weekly Engagement</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={weeklyEngagement}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} fill="url(#colorViews)" name="Page Views" />
                <Area type="monotone" dataKey="submissions" stroke="#10b981" strokeWidth={2} fill="url(#colorSubs)" name="Submissions" />
                <Line type="monotone" dataKey="discussions" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Discussions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Grade Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="grade" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Students">
                  {gradeDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Your Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Your Courses
            </h2>
            <span className="text-sm text-gray-500">{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm text-gray-500">Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-indigo-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-4">Create your first course and start teaching!</p>
              <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-200">
                <Plus className="w-4 h-4" />Create Course
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 group shadow-sm">
                  {/* Course Image */}
                  <div className="relative h-36 overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{course.level}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(course.id); }}
                      className="absolute top-3 right-3 p-1.5 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all backdrop-blur-sm"
                      title="Delete course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xs text-white/70 font-medium">{course.code}</p>
                      <h3 className="text-sm font-bold text-white truncate">{course.title}</h3>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-bold text-blue-700">{course.enrollment_count || 0}</p>
                        <p className="text-[10px] text-blue-600 font-medium">Students</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-bold text-amber-700">{course.rating}</p>
                        <p className="text-[10px] text-amber-600 font-medium">Rating</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-bold text-purple-700">{course.credits}</p>
                        <p className="text-[10px] text-purple-600 font-medium">Credits</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{course.department}</span>
                      <span>{course.semester}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Course Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-t-2xl px-6 py-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center justify-between relative">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Create New Course
                    </h2>
                    <p className="text-white/60 text-xs mt-1">Fill in the details to publish a new course</p>
                  </div>
                  <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-full hover:bg-white/20 transition"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                  <input type="text" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="e.g. Introduction to Machine Learning" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                    <input type="text" value={newCourse.code} onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })} placeholder="e.g. CS 101" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select value={newCourse.department} onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition">
                      {['Computer Science','Mathematics','Physics','Business','Engineering','Arts & Humanities','Biology','Chemistry','Data Science','Economics','Psychology'].map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select value={newCourse.semester} onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition">
                      {['Fall 2025','Spring 2026','Summer 2026'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select value={newCourse.level} onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value as any })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition">
                      {['Beginner','Intermediate','Advanced'].map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                    <input type="number" value={newCourse.credits} onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) || 3 })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                  <input type="number" value={newCourse.max_capacity} onChange={(e) => setNewCourse({ ...newCourse, max_capacity: parseInt(e.target.value) || 100 })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="Describe what students will learn..." rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                  <input type="text" value={newCourse.image} onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })} placeholder="https://... (optional, default image will be used)" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      Modules (one per line)
                    </span>
                  </label>
                  <textarea value={newCourse.modules} onChange={(e) => setNewCourse({ ...newCourse, modules: e.target.value })} placeholder={"e.g.\nIntroduction\nVariables & Data Types\nFunctions\nFinal Project"} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition font-mono" />
                </div>

                <button onClick={handleCreate} disabled={!newCourse.title || !newCourse.code || creating} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {creating ? 'Publishing...' : 'Publish Course'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfessorDashboard;
