import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Loader2, Upload, Star, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCourses } from '@/lib/database';
import type { DbCourse } from '@/lib/database';
import { departments, semesters, levels } from '@/data/courses';
import CourseCard from './CourseCard';

interface CourseCatalogProps {
  onSelectCourse?: (courseId: string) => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ onSelectCourse }) => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('All Semesters');
  const [level, setLevel] = useState('All Levels');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const data = await fetchCourses();
    setCourses(data);
    setLoading(false);
  };

  const filtered = courses.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === 'All Departments' || c.department === department;
    const matchSem = semester === 'All Semesters' || c.semester === semester;
    const matchLevel = level === 'All Levels' || c.level === level;
    return matchSearch && matchDept && matchSem && matchLevel;
  });

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Course Catalog</h1>
            <p className="text-gray-600">Browse and enroll in courses across departments</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen className="w-4 h-4" />
            <span>{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or code..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              {semesters.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              {levels.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No courses found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse?.(course.id)}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{course.level}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-700 shadow-sm">{course.code}</span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-indigo-600 font-medium mb-1">{course.department}</p>
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <img src={course.professor_avatar} alt={course.professor_name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs text-gray-600">{course.professor_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{course.rating}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrollment_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseCatalog;
