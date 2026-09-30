import React from 'react';

const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] ${className}`}
      style={{
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...props.style
      }}
      {...props}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

const ProjectCardSkeleton = () => (
  <div className="project-card opacity-100 translate-y-0 relative group" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1rem' }}>
    <Skeleton className="w-full h-48 rounded-t-2xl" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
      <div className="flex gap-3 pt-4">
        <Skeleton className="flex-1 h-10 rounded-lg" />
        <Skeleton className="flex-1 h-10 rounded-lg" />
      </div>
    </div>
  </div>
);

const ContactSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
      ))}
    </div>
    <div className="space-y-6">
      <Skeleton className="h-12 w-full rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
      <Skeleton className="h-12 w-full rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
      <Skeleton className="h-24 w-full rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
      <Skeleton className="h-14 w-full rounded-full" />
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-black pt-20 px-4 sm:px-8 pb-8">
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-10 w-48 rounded" />
          <Skeleton className="h-4 w-64 rounded mt-1" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
        ))}
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1.5rem' }}>
        <Skeleton className="h-12 px-4 rounded-t-2xl" />
        <div className="divide-y divide-white/10 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)' }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export { Skeleton, ProjectCardSkeleton, ContactSkeleton, DashboardSkeleton };