import React from 'react';

const SkeletonRow = ({ columns }) => {
  return (
    <tr className="animate-pulse border-b border-stone-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className={`h-4 bg-stone-100 rounded-md w-${i === 0 ? '3/4' : '1/2'}`} />
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;
