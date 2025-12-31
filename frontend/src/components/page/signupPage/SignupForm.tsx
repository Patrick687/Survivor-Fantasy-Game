
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormInput from "../../ui/form/FormInput";
import FormButton from "../../ui/form/FormButton";
import FormContainer from "../../ui/form/FormContainer";
import { FormError } from "../../ui/form/FormError";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../../store";
import { signup } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";


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

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { loading: signupLoading, error: signupError } = useSelector((state: RootState) => state.auth);

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<Omit<SignupFormData, 'isPrivate'>>({
        mode: 'onChange',
        resolver: zodResolver(signupSchema),
    });

    const isDisabled = !isValid || isSubmitting || signupLoading;

    const onSubmit: SubmitHandler<Omit<SignupFormData, 'isPrivate'>> = async (formData) => {
        const { confirmPassword: _confirmPassword, ...rest } = formData; // eslint-disable-line @typescript-eslint/no-unused-vars

        try {
            const resultAction = await dispatch(signup({ ...rest, isPrivate: false }));
            if (signup.fulfilled.match(resultAction)) {
                navigate('/');
            } else if (signup.rejected.match(resultAction)) {
                console.error(resultAction);
            }
        } catch (error) {
            console.error('Unrecognized Error:', error);
        }
    };

    // const onSubmit: SubmitHandler<Omit<SignupFormData, 'isPrivate'>> = async (formData) => {
    //     try {
    //         // Omit confirmPassword before sending to backend
    //         const { confirmPassword, ...rest } = formData;
    //         const result = await doSignup(
    //             { ...rest, isPrivate: false },
    //             (serverErrors) => {
    //                 console.log('Server validation errors:', serverErrors);
    //                 Object.entries(serverErrors).forEach(([field, message]) => {
    //                     const msg = Array.isArray(message) ? message.join('\n') : message;
    //                     setError(field as keyof Omit<SignupFormData, 'isPrivate'>, { type: "server", message: msg });
    //                 });
    //                 // Exit early after setting errors
    //                 return;
    //             }
    //         );
    //         if (result === null) return;
    //     } catch (error) {
    //         // Optionally handle global errors here
    //     }
    // };

    return (
        <FormContainer maxWidth="max-w-md" padding="pt-6 pb-2 px-8">
            <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                    label={{ text: 'Email', textSize: 'text-md' }}
                    autoComplete="email"
                    {...register("email")}
                    error={{ text: errors.email?.message, textSize: 'text-sm' }}
                    disabled={signupLoading}
                />
                <FormInput
                    label={{ text: 'Username', textSize: 'text-md' }}
                    {...register("userName")}
                    error={{ text: errors.userName?.message, textSize: 'text-sm' }}
                    disabled={signupLoading}
                />
                <FormInput
                    label={{ text: 'Password', textSize: 'text-md' }}
                    type="password"
                    autoComplete="new-password"
                    {...register("password")}
                    error={{ text: errors.password?.message, textSize: 'text-sm' }}
                    disabled={signupLoading}
                />
                <FormInput
                    label={{ text: 'Confirm Password', textSize: 'text-md' }}
                    type="password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    error={{ text: errors.confirmPassword?.message, textSize: 'text-sm' }}
                    disabled={signupLoading}
                />
                <FormInput
                    label={{ text: 'First Name', textSize: 'text-md' }}
                    autoComplete="given-name"
                    {...register("firstName")}
                    error={{ text: errors.firstName?.message, textSize: 'text-sm' }}
                    disabled={signupLoading}
                />
                <FormInput
                    label={{ text: 'Last Name', textSize: 'text-md' }}
                    autoComplete="family-name"
                    {...register("lastName")}
                    error={{ text: errors.lastName?.message, textSize: 'text-sm' }}
                    disabled={signupLoading}
                />
                <FormButton disabled={isDisabled} loading={signupLoading} padding="py-3 w-full">Sign Up</FormButton>
                <FormError message={signupError?.message || 'Cannot parse messsage'} loading={signupLoading} />
            </form>
        </FormContainer>
    );
}
