interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

export function Logo({ size = 'md', className = '', showText = false }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo - tentando carregar a imagem real primeiro, fallback para SVG */}
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <img 
          src="/logo.png" 
          alt="MatriFIC Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Se a imagem não carregar, mostra o SVG como fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="8" width="16" height="16" fill="#22c55e"/>
                  <rect x="24" y="8" width="16" height="16" fill="#22c55e"/>
                  <circle cx="16" cy="16" r="8" fill="#ef4444"/>
                  <rect x="8" y="24" width="16" height="16" fill="#22c55e"/>
                  <rect x="24" y="24" width="16" height="16" fill="#22c55e"/>
                  <rect x="40" y="24" width="16" height="16" fill="#22c55e"/>
                  <rect x="8" y="40" width="16" height="16" fill="#22c55e"/>
                  <rect x="24" y="40" width="16" height="16" fill="#22c55e"/>
                  <rect x="40" y="40" width="16" height="16" fill="#22c55e"/>
                </svg>
              `;
            }
          }}
        />
      </div>
      
      {/* Texto opcional */}
      {showText && (
        <span className={`font-bold text-green-800 ${textSizeClasses[size]}`}>
          MatriFIC
        </span>
      )}
    </div>
  )
}
