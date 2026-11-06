import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import Hero from './Hero';
import FeaturedCourses from './FeaturedCourses';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import CourseCatalog from './CourseCatalog';
import CourseDetail from './CourseDetail';
import Discussion from './Discussion';
import ProfessorDashboard from './ProfessorDashboard';
import UserProfile from './UserProfile';
import Chatbot from './Chatbot';
import Footer from './Footer';
import AuthModal from './AuthModal';

const AppLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState(false);

  const navigate = useCallback((view: string) => {
    setCurrentView(view);
    setSelectedCourseId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectCourse = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('courseDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderView = () => {
    // Course detail view
    if (currentView === 'courseDetail' && selectedCourseId) {
      return (
        <CourseDetail
          courseId={selectedCourseId}
          onBack={() => navigate('courses')}
        />
      );
    }

    switch (currentView) {
      case 'courses':
        return <CourseCatalog onSelectCourse={selectCourse} />;

      case 'discussions':
        return <Discussion />;

      case 'dashboard':
        if (isAuthenticated && (user?.role === 'professor' || user?.role === 'admin')) {
          return <ProfessorDashboard />;
        }
        return (
          <div className="py-20 text-center min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Restricted</h2>
              <p className="text-gray-500 mb-4">The dashboard is available for professors and administrators only.</p>
              <button
                onClick={() => navigate('home')}
                className="text-indigo-600 font-medium hover:text-indigo-700"
              >
                Return to Home
              </button>
            </div>
          </div>
        );

      case 'profile':
        if (isAuthenticated) {
          return <UserProfile onSelectCourse={selectCourse} />;
        }
        navigate('home');
        return null;

      case 'home':
      default:
        return (
          <>
            <Hero
              onNavigate={navigate}
              onOpenAuth={() => setAuthModal(true)}
              isAuthenticated={isAuthenticated}
            />
            <FeaturedCourses
              onSelectCourse={selectCourse}
              onViewAll={() => navigate('courses')}
            />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection
              onOpenAuth={() => setAuthModal(true)}
              isAuthenticated={isAuthenticated}
              onNavigate={navigate}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar currentView={currentView} onNavigate={navigate} />
      <main className="flex-1 pt-16">
        {renderView()}
      </main>
      <Footer onNavigate={navigate} />
      <Chatbot />
      <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} initialMode="signup" />
    </div>
  );
};

export default AppLayout;
