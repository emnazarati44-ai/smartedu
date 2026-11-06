import React from 'react';
import { ArrowRight, GraduationCap } from 'lucide-react';

interface CTASectionProps {
  onOpenAuth: () => void;
  isAuthenticated: boolean;
  onNavigate: (view: string) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onOpenAuth, isAuthenticated, onNavigate }) => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
          }} />
          
          <div className="relative px-8 py-14 sm:px-12 sm:py-16 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of students and professors already using SmartEdu. 
              Sign up today and get instant access to all courses and features.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => isAuthenticated ? onNavigate('courses') : onOpenAuth()}
                className="group flex items-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                {isAuthenticated ? 'Browse Courses' : 'Get Started Free'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('discussions')}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Join the Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
