import { motion } from 'framer-motion';

export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-2">
          {label}
        </label>
      )}
      <motion.div
        className="relative"
        animate={{ scale: error ? 0.98 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {Icon && (
          <Icon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        )}
        <input
          className={`
            w-full px-4 py-3
            ${Icon ? 'pl-10' : ''}
            bg-gray-800 border-2 border-gray-700
            text-white placeholder-gray-500
            rounded-lg transition-all
            focus:outline-none focus:border-primary focus:bg-gray-750
            ${error ? 'border-error bg-error/10' : ''}
            ${className}
          `}
          {...props}
        />
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-error text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};