import { z } from "zod";

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
  submitError?: string;
}
export interface UseFormConfig<T> {
  initialValues: T;
  validationSchema?: z.ZodType<T>;
  onSubmit?: (values: T) => Promise<void> | void;
}
export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
  submitError?: string;

  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  resetForm: () => void;
  setValues: (values: Partial<T>) => void;
  validateForm: () => boolean;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
}
