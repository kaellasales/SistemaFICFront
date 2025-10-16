import { forwardRef } from 'react'
import { Input } from './Input'
import { FieldError } from 'react-hook-form';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?:  FieldError;
  label?: string
  required?: boolean
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ error, label, required, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <Input
          ref={ref}
          className={`${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className || ''}`}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-xs mt-1">{error.message}</p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'
