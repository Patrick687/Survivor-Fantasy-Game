
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useSignup from "../../../hooks/useSignup";
import { getGraphQLErrorMessage } from "../../../utils/getGraphQLErrorMessage";
import FormInput from "../../ui/form/FormInput";
import FormButton from "../../ui/form/FormButton";
import FormContainer from "../../ui/form/FormContainer";
import { FormError } from "../../ui/form/FormError";


const alphaNoSpace = /^[A-Za-z]+$/;
const alphanumericNoSpace = /^[A-Za-z0-9]+$/;

const signupSchema = z.object({
    email: z.string()
        .min(1, "Required")
        .email("Invalid email"),
    firstName: z.string()
        .max(120, "Max 120 characters")
        .regex(alphaNoSpace, "Alphabetic characters (no spaces) only.")
        .optional()
        .or(z.literal('').transform(() => undefined)),
    lastName: z.string()
        .max(120, "Max 120 characters")
        .regex(alphaNoSpace, "Alphabetic characters (no spaces) only.")
        .optional()
        .or(z.literal('').transform(() => undefined)),
    userName: z.string()
        .min(6, "Must be at least 6 characters")
        .max(24, "Max 24 characters")
        .regex(alphanumericNoSpace, "Alphanumeric characters (no spaces) only."),
    password: z.string()
        .min(8, "Must be at least 8 characters long.")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Must contain at least one number.")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    isPrivate: z.preprocess(val => val === 'on' || val === true, z.boolean()).default(false),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;


export default function SignupForm() {
    const { doSignup, loading, error } = useSignup();
    const { register, handleSubmit, setError, formState: { errors, isValid, isSubmitting, submitCount } } = useForm<Omit<SignupFormData, 'isPrivate'>>({
        mode: 'onChange',
        resolver: zodResolver(signupSchema),
    });

    const isDisabled = !isValid || isSubmitting || loading;

    const onSubmit: SubmitHandler<Omit<SignupFormData, 'isPrivate'>> = async (formData) => {
        try {
            // Omit confirmPassword before sending to backend
            const { confirmPassword, ...rest } = formData;
            const result = await doSignup(
                { ...rest, isPrivate: false },
                (serverErrors) => {
                    console.log('Server validation errors:', serverErrors);
                    Object.entries(serverErrors).forEach(([field, message]) => {
                        const msg = Array.isArray(message) ? message.join('\n') : message;
                        setError(field as keyof Omit<SignupFormData, 'isPrivate'>, { type: "server", message: msg });
                    });
                    // Exit early after setting errors
                    return;
                }
            );
            if (result === null) return;
        } catch (error) {
            // Optionally handle global errors here
        }
    };

    return (
        <FormContainer maxWidth="max-w-md" padding="pt-6 pb-2 px-8">
            <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                    label={{ text: 'Email', textSize: 'text-md' }}
                    {...register("email")}
                    error={{ text: errors.email?.message, textSize: 'text-sm' }}
                    disabled={loading}
                />
                <FormInput
                    label={{ text: 'Username', textSize: 'text-md' }}
                    {...register("userName")}
                    error={{ text: errors.userName?.message, textSize: 'text-sm' }}
                    disabled={loading}
                />
                <FormInput
                    label={{ text: 'Password', textSize: 'text-md' }}
                    type="password"
                    {...register("password")}
                    error={{ text: errors.password?.message, textSize: 'text-sm' }}
                    disabled={loading}
                />
                <FormInput
                    label={{ text: 'Confirm Password', textSize: 'text-md' }}
                    type="password"
                    {...register("confirmPassword")}
                    error={{ text: errors.confirmPassword?.message, textSize: 'text-sm' }}
                    disabled={loading}
                />
                <FormInput
                    label={{ text: 'First Name', textSize: 'text-md' }}
                    {...register("firstName")}
                    error={{ text: errors.firstName?.message, textSize: 'text-sm' }}
                    disabled={loading}
                />
                <FormInput
                    label={{ text: 'Last Name', textSize: 'text-md' }}
                    {...register("lastName")}
                    error={{ text: errors.lastName?.message, textSize: 'text-sm' }}
                    disabled={loading}
                />
                <FormButton disabled={isDisabled} loading={loading} padding="py-3 w-full">Sign Up</FormButton>
                <FormError message={getGraphQLErrorMessage(error)} loading={loading} />
            </form>
        </FormContainer>
    );
}
