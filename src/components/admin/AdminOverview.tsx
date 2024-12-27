import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { useStats } from '../../hooks/useStats';

export default function AdminOverview() {
  const navigate = useNavigate();
  const { stats, loading } = useStats();

  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'Total Assignments',
      value: stats?.totalAssignments || 0,
      icon: FileText,
      color: 'bg-green-500',
      onClick: () => navigate('/admin/assignments'),
    },
    {
      title: 'Completed Submissions',
      value: stats?.completedSubmissions || 0,
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Reviews',
      value: stats?.pendingReviews || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={card.onClick}
              className={`p-6 rounded-lg shadow-sm ${
                card.onClick ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''
              }`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}