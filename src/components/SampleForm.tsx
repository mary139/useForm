import { useState } from "react";
import { z } from "zod";
import { useForm } from "@/hooks/useForm";
import { Flex, Button, Text, Checkbox, Card, Separator, createListCollection, Field, Stack, HStack, Input, Portal, NativeSelect } from "@chakra-ui/react"
import SuccessCard from "./SuccessCard";

const roles = createListCollection({
    items: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "User", value: "user" },
    ],
})

// Define the form schema using Zod
const userFormSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    role: z.enum(["user", "admin", "editor"], {
        errorMap: () => ({ message: "Please select a role" }),
    }),
    agreeToTerms: z.boolean().refine(val => val === true, {
        message: "You must agree to the terms and conditions",
    }),
});

// Infer the type from the schema
type UserFormValues = z.infer<typeof userFormSchema>;

const SampleFrom = () => {
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Initial values for the form
    const initialValues: UserFormValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user",
        agreeToTerms: false,
    };

    // Form submission handler (simulating an API call)
    const onSubmit = async (values: UserFormValues) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Form submitted:", values);
        setFormSubmitted(true);
    };

    // Initialize our form hook
    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
        resetForm,
        setValues,
    } = useForm<UserFormValues>({
        initialValues,
        validationSchema: userFormSchema,
        onSubmit,
    });

    // For demo purposes - prefill form values
    const handleDemoData = () => {
        resetForm()
        setValues({
            firstName: "Mary",
            lastName: "Alishahi",
            email: "Alishahi.m2591@gmail.com",
            password: "Password123",
            role: "editor",
            agreeToTerms: true,
        });
    };

    // Function to check if a field has an error that should be shown
    const showError = (field: keyof UserFormValues) =>
        touched[field] && errors[field];

    // Reset the form and form submission state
    const handleReset = () => {
        resetForm();
        setFormSubmitted(false);
    };

    return (
        <>
            {formSubmitted ? (
                <SuccessCard handleReset={handleReset} />
            ) : (
                <Card.Root variant={'subtle'} justifyContent={'center'} alignItems={'center'} maxW={{ base: 'full', md: 'lg' }} overflow="hidden" bgColor={'white'} color={'black'} padding={6} gap={6}>
                    <Flex direction={'column'} justifyContent={'center'}>
                        <Text fontSize="3xl">Create an Account</Text>
                        <Text fontSize={'md'} color={'gray.600'}>
                            Enter your information to register
                        </Text>
                    </Flex>
                    <Flex>
                        <form onSubmit={handleSubmit}>
                            <Stack direction={'row'} mb={4}>
                                <Field.Root invalid={!!showError("firstName")}>
                                    <Field.Label>First Name</Field.Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        borderColor={'gray.300'}
                                    />
                                    {showError("firstName") && (
                                        <Field.ErrorText>{errors.firstName}</Field.ErrorText>
                                    )}
                                </Field.Root>
                                <Field.Root invalid={!!showError("lastName")}>
                                    <Field.Label>Last Name</Field.Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        borderColor={'gray.300'}
                                    />
                                    {showError("lastName") && (
                                        <Field.ErrorText>{errors.lastName}</Field.ErrorText>
                                    )}
                                </Field.Root>
                            </Stack>
                            <Stack mb={4}>
                                <Field.Root invalid={!!showError("email")}>
                                    <Field.Label>Email</Field.Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        borderColor={'gray.300'}
                                    />
                                    {showError("email") && (
                                        <Field.ErrorText>{errors.email}</Field.ErrorText>
                                    )}
                                </Field.Root>
                            </Stack>
                            <Stack mb={4}>
                                <Field.Root invalid={!!showError("password")}>
                                    <Field.Label>Password</Field.Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        borderColor={'gray.300'}
                                    />
                                    {showError("password") && (
                                        <Field.ErrorText>{errors.password}</Field.ErrorText>
                                    )}
                                </Field.Root>
                            </Stack>
                            <Stack mb={6}>
                                <Field.Root invalid={!!showError("role")} >
                                    <Field.Label>Role</Field.Label>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field placeholder="Select a Role" bgColor={'white'} borderColor={'gray.300'} value={values.role}
                                            onChange={(e) => setFieldValue("role", e.currentTarget.value)}>
                                            {roles.items.map((role) => (
                                                <option key={role.value} value={role.value} className="bg-white text-black border-gray-300">{role.label}</option>
                                            ))}
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                    {showError("role") && (
                                        <Field.ErrorText>{errors.role}</Field.ErrorText>
                                    )}
                                </Field.Root>
                            </Stack >
                            <Stack mb={4}>
                                <Field.Root invalid={!!showError("agreeToTerms")}>
                                    <Checkbox.Root
                                        variant={'solid'}
                                        id="agreeToTerms"
                                        checked={values.agreeToTerms}
                                        onCheckedChange={(e) =>
                                            setFieldValue("agreeToTerms", !!e.checked)
                                        }
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label> I agree to the terms and conditions</Checkbox.Label>
                                    </Checkbox.Root>
                                    {showError("agreeToTerms") && (
                                        <Field.ErrorText>{errors.agreeToTerms}</Field.ErrorText>
                                    )}
                                </Field.Root>
                            </Stack>
                            <Stack my={4}>
                                <Button type="submit" loading={isSubmitting} loadingText="Submitting..." variant="outline" bgColor={'black'} color={'white'}>
                                    Register
                                </Button>
                            </Stack>
                            <HStack>
                                <Separator flex="1" />
                                <Text flexShrink="0">Or</Text>
                                <Separator flex="1" />
                            </HStack>
                            <Stack mt={1}>
                                <Button variant="ghost" bgColor={'white'} color={'black'} onClick={handleDemoData} fontSize={'xs'} >
                                    Fill with Demo Data
                                </Button>
                            </Stack>
                        </form>
                    </Flex>
                </Card.Root >
            )}
        </>
    );
};

export default SampleFrom;