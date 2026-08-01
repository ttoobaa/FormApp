import type { ReactNode } from 'react';

interface ConditionalFieldProps {
  show: boolean;
  children: ReactNode;
}

export function ConditionalField({ show, children }: ConditionalFieldProps) {
  if (!show) return null;

  return <>{children}</>;
}
