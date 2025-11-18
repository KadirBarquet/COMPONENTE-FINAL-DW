import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Componente Input reutilizable con validación y diferentes variantes
 */
export default function Input({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    success,
    helperText,
    icon,
    disabled = false,
    required = false,
    className = '',
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const inputClasses = `
        w-full px-4 py-3 border rounded-lg 
        transition-all duration-200
        focus:outline-none focus:ring-2
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${icon ? 'pl-10' : ''}
        ${type === 'password' ? 'pr-10' : ''}
        ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : success 
                ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }
        ${isFocused ? 'ring-2' : ''}
        ${className}
    `;

    return (
        <div className="w-full">
            {label && (
                <label 
                    htmlFor={name} 
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur && onBlur(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputClasses}
                    {...props}
                />

                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}

                {error && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                )}

                {success && !error && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                )}
            </div>

            {(error || helperText || success) && (
                <div className="mt-1">
                    {error && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </p>
                    )}
                    {success && !error && (
                        <p className="text-green-500 text-sm flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {success}
                        </p>
                    )}
                    {helperText && !error && !success && (
                        <p className="text-gray-500 text-sm">{helperText}</p>
                    )}
                </div>
            )}
        </div>
    );
}

// Componente TextArea
export function TextArea({
    label,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    helperText,
    disabled = false,
    required = false,
    rows = 4,
    maxLength,
    className = '',
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);

    const textareaClasses = `
        w-full px-4 py-3 border rounded-lg 
        transition-all duration-200
        focus:outline-none focus:ring-2
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }
        ${isFocused ? 'ring-2' : ''}
        ${className}
    `;

    return (
        <div className="w-full">
            {label && (
                <label 
                    htmlFor={name} 
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={(e) => {
                    setIsFocused(false);
                    onBlur && onBlur(e);
                }}
                onFocus={() => setIsFocused(true)}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                maxLength={maxLength}
                className={textareaClasses}
                {...props}
            />

            <div className="flex justify-between items-center mt-1">
                <div className="flex-1">
                    {error && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </p>
                    )}
                    {helperText && !error && (
                        <p className="text-gray-500 text-sm">{helperText}</p>
                    )}
                </div>
                {maxLength && (
                    <p className="text-gray-400 text-xs">
                        {value?.length || 0}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    );
}

// Componente Select
export function Select({
    label,
    name,
    value,
    onChange,
    options = [],
    error,
    helperText,
    disabled = false,
    required = false,
    placeholder = 'Selecciona una opción',
    className = '',
    ...props
}) {
    const selectClasses = `
        w-full px-4 py-3 border rounded-lg 
        transition-all duration-200
        focus:outline-none focus:ring-2
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }
        ${className}
    `;

    return (
        <div className="w-full">
            {label && (
                <label 
                    htmlFor={name} 
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={selectClasses}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option 
                        key={option.value} 
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            {(error || helperText) && (
                <div className="mt-1">
                    {error && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </p>
                    )}
                    {helperText && !error && (
                        <p className="text-gray-500 text-sm">{helperText}</p>
                    )}
                </div>
            )}
        </div>
    );
}

// Componente Checkbox
export function Checkbox({
    label,
    name,
    checked,
    onChange,
    disabled = false,
    className = '',
    ...props
}) {
    return (
        <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                {...props}
            />
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}

// Componente Radio
export function Radio({
    label,
    name,
    value,
    checked,
    onChange,
    disabled = false,
    className = '',
    ...props
}) {
    return (
        <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                {...props}
            />
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}