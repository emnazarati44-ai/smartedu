import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star, Users, Clock, BookOpen, CheckCircle2, Circle, Bell, Calendar, Award, Loader2 } from 'lucide-react';
import { fetchCourseById } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import type { Course } from '@/data/courses';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
}

const levelColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, onBack }) => {
  const { user, isAuthenticated, enrollInCourse, unenrollFromCourse } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    setLoading(true);
    const data = await fetchCourseById(courseId);
    if (data) {
      setCourse({
        id: data.id,
        title: data.title,
        code: data.code,
        department: data.department,
        professor_name: data.professor_name,
        professor_avatar: data.professor_avatar,
        professor_id: data.professor_id,
        semester: data.semester,
        credits: data.credits,
        max_capacity: data.max_capacity,
        enrollment_count: data.enrollment_count || 0,
        description: data.description,
        image: data.image,
        level: data.level,
        rating: data.rating,
        modules: (data.modules || []).map((m) => ({ id: m.id, title: m.title, duration: m.duration, order_index: m.order_index })),
        announcements: (data.announcements || []).map((a) => ({ id: a.id, title: a.title, content: a.content, created_at: a.created_at })),
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-20 text-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Course not found.</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 font-medium hover:text-indigo-700">Go back</button>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses.includes(course.id) || false;

  const handleEnroll = async () => {
    setEnrolling(true);
    await enrollInCourse(course.id);
    setCourse((prev) => prev ? { ...prev, enrollment_count: prev.enrollment_count + 1 } : null);
    setEnrolling(false);
  };

  const handleUnenroll = async () => {
    setEnrolling(true);
    await unenrollFromCourse(course.id);
    setCourse((prev) => prev ? { ...prev, enrollment_count: Math.max(0, prev.enrollment_count - 1) } : null);
    setEnrolling(false);
  };

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Courses</span>
        </button>

        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img src={course.image} alt={course.title} className="w-full h-64 sm:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[course.level]}`}>{course.level}</span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-700">{course.code}</span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">{course.department}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" />{course.rating}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.enrollment_count} enrolled</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.modules.length} modules</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.credits} credits</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Course</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Modules</h2>
              <div className="space-y-3">
                {course.modules.map((module, i) => (
                  <div key={module.id} className="flex items-center gap-3 p-3 rounded-xl border bg-gray-50 border-gray-200">
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Module {i + 1}: {module.title}</p>
                      <p className="text-xs text-gray-500">{module.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {course.announcements.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-500" />Announcements
                </h2>
                <div className="space-y-4">
                  {course.announcements.map((ann) => (
                    <div key={ann.id} className="border-l-4 border-indigo-400 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{ann.title}</h3>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{new Date(ann.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <img src={course.professor_avatar} alt={course.professor_name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-900">{course.professor_name}</p>
                  <p className="text-sm text-gray-500">Course Instructor</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Semester</span><span className="font-medium text-gray-700">{course.semester}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Credits</span><span className="font-medium text-gray-700">{course.credits}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Capacity</span><span className="font-medium text-gray-700">{course.enrollment_count}/{course.max_capacity}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Level</span><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[course.level]}`}>{course.level}</span></div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Enrollment</span><span>{Math.round((course.enrollment_count / course.max_capacity) * 100)}% full</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${course.enrollment_count / course.max_capacity > 0.9 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, (course.enrollment_count / course.max_capacity) * 100)}%` }} />
                </div>
              </div>
              {isAuthenticated ? (
                isEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <Award className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-700">You're enrolled!</span>
                    </div>
                    <button onClick={handleUnenroll} disabled={enrolling} className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 flex items-center justify-center gap-2">
                      {enrolling && <Loader2 className="w-4 h-4 animate-spin" />}Unenroll
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEnroll} disabled={enrolling} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2">
                    {enrolling && <Loader2 className="w-4 h-4 animate-spin" />}Enroll Now
                  </button>
                )
              ) : (
                <p className="text-sm text-gray-500 text-center py-3 bg-gray-50 rounded-xl">Sign in to enroll in this course</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetail;
