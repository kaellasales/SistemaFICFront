import * as React from 'react';
import { cn } from '@/shared/utils/cn';
import { FieldError } from 'react-hook-form';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError; 
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Estilos base para a caixa de texto
          'flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm',
          // Estilos de foco
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500',
          // Estilos quando desabilitado
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Estilos de erro: se a prop 'error' existir, aplica a borda vermelha
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };