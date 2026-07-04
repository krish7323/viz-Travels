import { motion } from 'framer-motion';

export const StepIndicator = ({ currentStep, totalSteps, labels = [] }) => {
  return (
    <div className="flex justify-between items-center w-full">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = currentStep === step;
        const isCompleted = currentStep > step;

        return (
          <motion.div
            key={step}
            className="flex flex-col items-center flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                font-bold text-lg transition-all
                ${isCompleted ? 'bg-success text-white' : ''}
                ${isActive ? 'bg-primary text-white ring-4 ring-primary/30' : ''}
                ${!isActive && !isCompleted ? 'bg-gray-700 text-gray-400' : ''}
              `}
              whileScale={isActive ? [1, 1.1, 1] : {}}
              animate={{ scale: isActive ? 1 : 1 }}
            >
              {isCompleted ? '✓' : step}
            </motion.div>

            {labels[index] && (
              <p className="text-xs text-gray-400 mt-2 text-center max-w-20">
                {labels[index]}
              </p>
            )}

            {step < totalSteps && (
              <motion.div
                className={`
                  h-1 flex-1 mx-2 -mt-7 rounded-full
                  ${isCompleted ? 'bg-success' : 'bg-gray-700'}
                  transition-colors
                `}
                layoutId={`divider-${step}`}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};