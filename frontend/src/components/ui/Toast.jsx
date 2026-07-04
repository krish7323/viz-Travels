import { motion, AnimatePresence } from 'framer-motion';

const toastStyles = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
};

export const Toast = ({ toasts, onRemove }) => {
  return (
    <AnimatePresence>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`
              ${toastStyles[toast.type] || toastStyles.info}
              px-4 py-3 rounded-lg shadow-lg
              flex items-center justify-between
              min-w-[300px]
            `}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-2 text-lg hover:opacity-70"
            >
              ×
            </button>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};