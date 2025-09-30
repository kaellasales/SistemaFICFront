import { useState, useCallback } from 'react'
import { validateStep, validateEnrollmentData, type ValidationError, type ValidationResult } from '@/shared/utils/validation'

export interface UseValidationReturn {
  errors: ValidationError[]
  validateCurrentStep: (step: number, data: any, files: File[]) => boolean
  validateAllSteps: (data: any, files: File[]) => boolean
  clearErrors: () => void
  getFieldError: (fieldName: string) => string | null
  hasErrors: boolean
}

export const useValidation = (): UseValidationReturn => {
  const [errors, setErrors] = useState<ValidationError[]>([])

  const validateCurrentStep = useCallback((step: number, data: any, files: File[]): boolean => {
    const result: ValidationResult = validateStep(step, data, files)
    setErrors(result.errors)
    return result.isValid
  }, [])

  const validateAllSteps = useCallback((data: any, files: File[]): boolean => {
    const result: ValidationResult = validateEnrollmentData(data, files)
    setErrors(result.errors)
    return result.isValid
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const getFieldError = useCallback((fieldName: string): string | null => {
    const error = errors.find(err => err.field === fieldName)
    return error ? error.message : null
  }, [errors])

  const hasErrors = errors.length > 0

  return {
    errors,
    validateCurrentStep,
    validateAllSteps,
    clearErrors,
    getFieldError,
    hasErrors
  }
}
