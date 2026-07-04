import { motion } from 'framer-motion';
import { Spinner } from './Spinner'; // Ensure Spinner.jsx is in the same folder

export const LoadingOverlay = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gray-800 rounded-xl p-8 flex flex-col items-center gap-4"
      >
        <Spinner size="lg" />
        <p className="text-white text-center">{message}</p>
      </motion.div>
    </motion.div>
  );
};