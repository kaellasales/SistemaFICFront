import { forwardRef } from 'react';
import InputMask from 'react-input-mask';
import { FieldError } from 'react-hook-form';

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  mask: string;
  error?: FieldError;
}

export const MaskedValidatedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ label, name, mask, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <InputMask
          id={name}
          name={name}
          mask={mask}
          inputRef={ref} // react-input-mask usa inputRef para a ref
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
          } ${className || ''}`}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-xs mt-1">{error.message}</p>
        )}
      </div>
    );
  }
);
MaskedValidatedInput.displayName = 'MaskedValidatedInput';