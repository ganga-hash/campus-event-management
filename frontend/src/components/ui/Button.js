import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none px-4 py-2.5 text-sm";
  
  const variants = {
    primary: "bg-gradient-to-br from-indigo-800 to-indigo-700 hover:from-indigo-900 hover:to-indigo-800 text-white shadow-glow-indigo",
    secondary: "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:border-stone-300",
    danger: "bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-sm ring-1 ring-rose-700/50",
    dangerOutline: "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50",
    ghost: "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
