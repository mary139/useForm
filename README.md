# React useForm Hook

A lightweight, type-safe form management hook for React applications with Zod schema validation.

## Features

- 📝 Type-safe form state management
- ✅ Zod schema validation integration
- 🔄 Form submission handling with loading states
- 🎯 Field-level validation and error messages
- 🔄 Easy form reset and initialization
- 🧪 Complete TypeScript support

## Usage

### Basic Setup

```tsx
import { z } from "zod";
import { useForm } from "./hooks/useForm";

// Define your form schema with Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

// Infer the type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  // Initialize the form with useForm hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      // Handle form submission
      await loginUser(values);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && (
          <div className="error">{errors.email}</div>
        )}
      </div>

      {/* Other form fields */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.password && errors.password && (
          <div className="error">{errors.password}</div>
        )}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="rememberMe"
            checked={values.rememberMe}
            onChange={handleChange}
          />
          Remember Me
        </label>
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
```

### API Reference

#### `useForm<T>(config: UseFormConfig<T>): UseFormReturn<T>`

The main hook for form management.

##### Config Options

- `initialValues: T` - Initial values for the form
- `validationSchema?: z.ZodType<T>` - Zod schema for validation
- `onSubmit?: (values: T) => Promise<void> | void` - Form submission handler

##### Return Object

**State**
- `values: T` - Current form values
- `errors: Partial<Record<keyof T, string>>` - Validation errors by field
- `touched: Partial<Record<keyof T, boolean>>` - Which fields have been touched
- `isSubmitting: boolean` - Whether the form is currently submitting
- `isValid: boolean` - Whether the form values are valid
- `submitCount: number` - Number of submission attempts
- `submitError?: string` - Error from submission if any

**Methods**
- `handleChange: (e: React.ChangeEvent<...>) => void` - Handle input changes
- `handleBlur: (e: React.FocusEvent<...>) => void` - Handle input blur
- `setFieldValue: (field: keyof T, value: any) => void` - Set a field value
- `setFieldTouched: (field: keyof T, isTouched?: boolean) => void` - Mark field as touched
- `resetForm: () => void` - Reset form to initial values
- `setValues: (values: Partial<T>) => void` - Update multiple values at once
- `validateForm: () => boolean` - Validate entire form
- `handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void` - Handle form submission
