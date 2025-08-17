import { forwardRef } from 'react'

const GlassCard = forwardRef(({ 
  children, 
  className = '', 
  blur = 'backdrop-blur-md', 
  opacity = 'bg-white/10', 
  border = 'border border-white/20',
  shadow = 'shadow-xl',
  rounded = 'rounded-2xl',
  ...props 
}, ref) => {
  const glassClasses = `
    ${blur}
    ${opacity}
    ${border}
    ${shadow}
    ${rounded}
    backdrop-saturate-150
    transition-all
    duration-300
    hover:bg-white/15
    hover:border-white/30
    hover:shadow-2xl
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div 
      ref={ref}
      className={glassClasses}
      {...props}
    >
      {children}
    </div>
  )
})

GlassCard.displayName = 'GlassCard'

export default GlassCard