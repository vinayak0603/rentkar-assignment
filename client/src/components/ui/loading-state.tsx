
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState = ({ 
  message = "Loading...", 
  className = "",
  size = "md" 
}: LoadingStateProps) => {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <Loader className={cn("animate-spin text-primary mb-2", sizeClass[size])} />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
};
