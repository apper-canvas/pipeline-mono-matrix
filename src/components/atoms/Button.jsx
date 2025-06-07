import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className, disabled, type = 'button', whileHover, whileTap }) => {
  const motionProps = {};
  if (whileHover) motionProps.whileHover = whileHover;
  if (whileTap) motionProps.whileTap = whileTap;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;