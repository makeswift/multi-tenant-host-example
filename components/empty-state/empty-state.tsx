import { cn } from '@/lib/makeswift/utils/cn';

interface MSEmptyStateProps {
  className?: string;
  children?: React.ReactNode;
}

export function MSEmptyState({ className, children }: MSEmptyStateProps) {
  return (
    <div className={cn(className, 'p-4 rounded-md text-center text-secondary body-sm')}>
      {children}
    </div>
  );
}
