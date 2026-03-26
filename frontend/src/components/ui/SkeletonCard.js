import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden h-[240px] flex flex-col relative animate-pulse">
      <div className="absolute top-0 right-0 w-3/5 h-1 bg-stone-100 rounded-bl-sm" />
      <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-stone-100" />
      
      <div className="p-5 flex-1 flex flex-col pt-8">
        <div className="w-16 h-4 bg-stone-100 rounded-md mb-3" />
        <div className="w-3/4 h-5 bg-stone-100 rounded-md mb-2" />
        <div className="w-1/2 h-5 bg-stone-100 rounded-md mb-4" />
        
        <div className="space-y-2 mb-4 flex-1">
          <div className="w-1/2 h-3 bg-stone-100 rounded-md" />
        </div>
        
        <div className="w-full h-12 bg-stone-50 rounded-xl mt-auto border border-stone-100" />
      </div>
    </div>
  );
};

export default SkeletonCard;
