import { motion } from 'framer-motion';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      className={`
        border-4 border-gray-700 border-t-primary
        rounded-full
        ${sizes[size]}
        ${className}
      `}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: 'linear',
      }}
    />
  );
};