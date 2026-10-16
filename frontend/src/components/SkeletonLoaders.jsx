import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-800/80 w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
          <div className="h-5 w-20 bg-slate-800 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-slate-800 rounded-md" />
        <div className="space-y-1.5 pt-2">
          <div className="h-3.5 w-full bg-slate-800/60 rounded" />
          <div className="h-3.5 w-4/5 bg-slate-800/60 rounded" />
        </div>
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
          <div className="h-4 w-24 bg-slate-800/80 rounded" />
          <div className="h-8 w-20 bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetails() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-slate-800 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 bg-slate-800 rounded-2xl" />
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-800 rounded-full" />
            <div className="h-6 w-24 bg-slate-800 rounded-full" />
          </div>
          <div className="h-10 w-3/4 bg-slate-800 rounded-lg" />
          <div className="h-20 w-full bg-slate-800/60 rounded-lg" />
          <div className="h-12 w-full bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-800/60 border-b border-slate-800" />
      <div className="divide-y divide-slate-800/60 p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-slate-800 rounded" />
                <div className="h-3 w-48 bg-slate-800/60 rounded" />
              </div>
            </div>
            <div className="h-8 w-24 bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
