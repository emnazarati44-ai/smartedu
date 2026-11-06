import React from 'react';
import { BookOpen, Users, BarChart3, MessageCircle, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Rich Course Catalog',
    description: 'Access 350+ courses across 8 departments with comprehensive materials, video lectures, and interactive assignments.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Collaborative Learning',
    description: 'Engage with peers and professors through discussion boards, study groups, and real-time messaging.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Progress Tracking',
    description: 'Monitor your academic journey with detailed analytics, completion rates, and performance insights.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Smart Support',
    description: 'Get instant help from our AI-powered chatbot assistant, available 24/7 to guide you through the platform.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Role-Based Access',
    description: 'Tailored experiences for students, professors, and administrators with appropriate tools and permissions.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-Time Updates',
    description: 'Stay informed with instant notifications for announcements, grades, and discussion replies.',
    color: 'bg-cyan-50 text-cyan-600',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Why SmartEdu?</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Everything You Need to Succeed</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            SmartEdu provides a comprehensive suite of tools designed to enhance the learning experience for everyone in the academic community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
