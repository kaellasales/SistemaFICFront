import { forwardRef, ReactNode } from 'react'

interface ValidatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  label?: string
  required?: boolean
  options?: { value: string | number; label: string }[] // <<< MUDANÇA 1: 'options' agora é opcional (?)
  children?: ReactNode // <<< MUDANÇA 2: Aceita 'children' explicitamente
  placeholder?: string
}

export const ValidatedSelect = forwardRef<HTMLSelectElement, ValidatedSelectProps>(
  ({ error, label, required, options = [], children, placeholder, className, ...props }, ref) => {
    // <<< MUDANÇA 3: 'options = []' define um array vazio como padrão se a prop não for passada.
    // Isso por si só já evita o erro '.map of undefined'.
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          } ${className || ''}`}
          {...props}
        >
          {/* Se um placeholder for passado, ele aparece primeiro */}
          {placeholder && (
            <option value="">
              {placeholder}
            </option>
          )}

          {/* <<< MUDANÇA 4: LÓGICA INTELIGENTE DE RENDERIZAÇÃO >>> */}
          
          {/* Prioriza a renderização dos 'children' se eles forem passados */}
          {children}
          
          {/* Se NÃO houver 'children', ele mapeia e renderiza as 'options' */}
          {!children && options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          
        </select>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

ValidatedSelect.displayName = 'ValidatedSelect'