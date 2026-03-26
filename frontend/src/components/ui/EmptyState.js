import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-stone-100 shadow-sm col-span-full mx-auto w-full max-w-lg"
    >
      <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-4 border border-stone-100">
        <Icon className="w-8 h-8 text-stone-300" />
      </div>
      <h3 className="text-lg font-display font-semibold text-stone-800 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </motion.div>
  );
};

export default EmptyState;
