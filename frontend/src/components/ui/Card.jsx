import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  onClick,
  hover = true,
  ...props
}) => {
  return (
    <motion.div
      className={`
        bg-gray-800/50 backdrop-blur
        border border-gray-700
        rounded-xl p-6
        ${hover ? 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10' : ''}
        transition-all duration-300
        ${className}
      `}
      whileHover={hover ? { y: -4 } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};