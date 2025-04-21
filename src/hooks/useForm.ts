import { useState, useCallback, useRef } from "react";
import { z } from "zod";
import type { FormState, UseFormConfig, UseFormReturn } from "@/types/forms";

/**
 * A custom React hook for managing forms with validation using Zod
 *
 * @param config Configuration object containing initialValues, validationSchema, and onSubmit
 * @returns Form state and methods for handling the form
 */
export function useForm<T extends Record<string, any>>(
  config: UseFormConfig<T>
): UseFormReturn<T> {
  const { initialValues, validationSchema, onSubmit } = config;

  // Initialize form state
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    submitCount: 0,
    submitError: undefined,
  });

  // Store the latest validationSchema in a ref
  const schemaRef = useRef(validationSchema);
  schemaRef.current = validationSchema;

  // Store the latest onSubmit in a ref
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  /**
   * Validates the form using the provided Zod schema
   * @param values Form values to validate
   * @returns Object containing whether the form is valid and any errors
   */
  const validateWithSchema = useCallback((values: T) => {
    if (!schemaRef.current) {
      return { isValid: true, fieldErrors: {} };
    }

    try {
      schemaRef.current.parse(values);
      return { isValid: true, fieldErrors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};

        error.errors.forEach((err) => {
          const path = err.path[0] as keyof T;
          if (path) {
            fieldErrors[path] = err.message;
          }
        });

        return { isValid: false, fieldErrors };
      }
      return { isValid: false, fieldErrors: {} };
    }
  }, []);

  /**
   * Validates the entire form and updates the form state with validation results
   * @returns Whether the form is valid
   */
  const validateForm = useCallback(() => {
    const { isValid, fieldErrors } = validateWithSchema(formState.values);

    setFormState((prev) => ({
      ...prev,
      errors: fieldErrors,
      isValid,
    }));

    return isValid;
  }, [formState.values, validateWithSchema]);

  /**
   * Handles form field changes
   */
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      let fieldValue: any = value;

      if (type === "checkbox") {
        fieldValue = (e.target as HTMLInputElement).checked;
      } else if (type === "number") {
        fieldValue = value === "" ? "" : Number(value);
      }

      setFieldValue(name as keyof T, fieldValue);
    },
    []
  );

  /**
   * Sets the value of a specific form field
   */
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setFormState((prev) => {
      const newValues = { ...prev.values, [field]: value };

      if (schemaRef.current) {
        try {
          schemaRef.current.parse({ ...prev.values, [field]: value });

          const updatedErrors = { ...prev.errors, [field]: undefined };
          const hasErrors = Object.values(updatedErrors).some(
            (error) => !!error
          );

          return {
            ...prev,
            values: newValues,
            errors: updatedErrors,
            isValid: !hasErrors,
          };
        } catch (error) {
          if (error instanceof z.ZodError) {
            // Find errors related to this specific field
            const fieldError =
              error.errors.find((err) => err.path[0] === field)?.message ||
              undefined;

            // Update errors object with this field's error
            const updatedErrors = { ...prev.errors, [field]: fieldError };

            return {
              ...prev,
              values: newValues,
              errors: updatedErrors,
              isValid: false,
            };
          }
        }
      }

      return {
        ...prev,
        values: newValues,
      };
    });
  }, []);

  /**
   * Handles form field blur events
   */
  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name } = e.target;
      setFieldTouched(name as keyof T, true);
    },
    []
  );

  /**
   * Marks a field as touched
   */
  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: isTouched },
    }));
  }, []);

  /**
   * Sets multiple form values at once
   */
  const setValues = useCallback((values: Partial<T>) => {
    setFormState((prev) => ({
      ...prev,
      values: { ...prev.values, ...values },
    }));
  }, []);

  /**
   * Resets the form to its initial state
   */
  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
      submitCount: 0,
      submitError: undefined,
    });
  }, [initialValues]);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
      }

      setFormState((prev) => ({
        ...prev,
        submitCount: prev.submitCount + 1,
        touched: Object.keys(prev.values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as Partial<Record<keyof T, boolean>>
        ),
      }));

      const isValid = validateForm();

      if (!isValid || !onSubmitRef.current) {
        return;
      }

      try {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: true,
          submitError: undefined,
        }));

        await onSubmitRef.current(formState.values);

        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
        }));
      } catch (error) {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          submitError:
            error instanceof Error ? error.message : "Form submission failed",
        }));
      }
    },
    [formState.values, validateForm]
  );

  // Return form state and methods
  return {
    ...formState,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    resetForm,
    setValues,
    validateForm,
    handleSubmit,
  };
}
