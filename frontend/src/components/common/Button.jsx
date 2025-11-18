import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Componente Button reutilizable con diferentes variantes y tamaños
 * @param {string} variant - primary, secondary, danger, success, outline
 * @param {string} size - sm, md, lg
 * @param {boolean} loading - muestra spinner de carga
 * @param {boolean} disabled - deshabilita el botón
 * @param {boolean} fullWidth - ocupa todo el ancho disponible
 * @param {React.ReactNode} icon - icono a mostrar antes del texto
 * @param {React.ReactNode} children - contenido del botón
 * @param {string} className - clases CSS adicionales
 */
export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon = null,
    children,
    className = '',
    type = 'button',
    onClick,
    ...props
}) {
    // Clases base del botón
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variantes de color
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:scale-105',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-md hover:shadow-lg',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md hover:shadow-lg',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-md hover:shadow-lg',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400 shadow-md hover:shadow-lg',
        outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
    };

    // Tamaños del botón
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    // Combinar clases
    const buttonClasses = `
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
    `;

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Cargando...</span>
                </>
            ) : (
                <>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
}

// Componente IconButton para botones solo con icono
export function IconButton({
    variant = 'ghost',
    size = 'md',
    disabled = false,
    icon,
    className = '',
    title,
    onClick,
    ...props
}) {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
    };

    const sizes = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-3'
    };

    const buttonClasses = `
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
    `;

    return (
        <button
            type="button"
            className={buttonClasses}
            disabled={disabled}
            onClick={onClick}
            title={title}
            {...props}
        >
            {icon}
        </button>
    );
}

// Componente ButtonGroup para agrupar botones
export function ButtonGroup({ children, className = '' }) {
    return (
        <div className={`inline-flex rounded-lg shadow-sm ${className}`}>
            {React.Children.map(children, (child, index) => {
                if (!child) return null;
                
                const isFirst = index === 0;
                const isLast = index === React.Children.count(children) - 1;
                
                return React.cloneElement(child, {
                    className: `
                        ${child.props.className || ''}
                        ${!isFirst ? 'border-l-0' : ''}
                        ${!isFirst && !isLast ? 'rounded-none' : ''}
                        ${isFirst ? 'rounded-r-none' : ''}
                        ${isLast ? 'rounded-l-none' : ''}
                    `
                });
            })}
        </div>
    );
}