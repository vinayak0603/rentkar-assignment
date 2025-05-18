
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CircleX } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry,
  className = ""
}: ErrorStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <CircleX className="h-12 w-12 text-destructive mb-2" />
      <h3 className="font-semibold text-lg mb-2">Error</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Retry
        </Button>
      )}
    </div>
  );
};
