
import React from "react";

type DiceIconProps = {
  className?: string;
  size?: number;
  color?: string;
};

export const DiceIcon = ({ className, size = 24, color = "currentColor" }: DiceIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <circle cx="15.5" cy="8.5" r="1.5" fill={color} />
      <circle cx="15.5" cy="15.5" r="1.5" fill={color} />
      <circle cx="8.5" cy="15.5" r="1.5" fill={color} />
    </svg>
  );
};
