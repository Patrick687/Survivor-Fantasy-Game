
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useSignup from "../../../hooks/useSignup";
import { getGraphQLErrorMessage } from "../../../utils/getGraphQLErrorMessage";
import FormInput from "../../ui/form/FormInput";
import FormButton from "../../ui/form/FormButton";
import FormContainer from "../../ui/form/FormContainer";
import { FormError } from "../../ui/form/FormError";


const signupSchema = z.object({
    email: z.string().email("Invalid email").min(1, "Required"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    userName: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
    isPrivate: z.preprocess(val => val === 'on' || val === true, z.boolean()).default(false),
});

type SignupFormData = z.infer<typeof signupSchema>;


export default function SignupForm() {
    const { doSignup, loading, error } = useSignup();
    const { register, handleSubmit, formState: { errors, isValid, isSubmitting, submitCount } } = useForm<Omit<SignupFormData, 'isPrivate'>>({
        mode: 'onChange',
        resolver: zodResolver(signupSchema),
    });

    const isDisabled = !isValid || isSubmitting || loading;

    const onSubmit: SubmitHandler<Omit<SignupFormData, 'isPrivate'>> = async (formData) => {
        await doSignup({
            ...formData,
            isPrivate: false
        });
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
                <FormButton disabled={isDisabled} loading={loading} padding="py-3 w-full">Sign Up</FormButton>
                <FormError message={getGraphQLErrorMessage(error)} loading={loading} />
            </form>
        </FormContainer>
    );
}
