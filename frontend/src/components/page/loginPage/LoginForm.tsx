import { useForm, type SubmitHandler } from "react-hook-form";
import type { LoginInput } from "../../../graphql/generated";
import useLogin from "../../../hooks/useLogin";
import FormInput from "../../ui/form/FormInput";
import FormButton from "../../ui/form/FormButton";
import FormContainer from "../../ui/form/FormContainer";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormError } from "../../ui/form/FormError";

type LoginFormData = LoginInput;

const loginSchema = z.object({
    userNameOrEmail: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
});

export default function LoginForm() {
    const { doLogin, data: loginResponseData, loading: loginLoading, error: loginError } = useLogin();
    const { register, handleSubmit, formState: { errors, isValid, isSubmitting, submitCount } } = useForm<LoginFormData>({
        mode: 'onChange',
        resolver: zodResolver(loginSchema),
    });

    const isDisabled = !isValid || isSubmitting || loginLoading;

    const onSubmit: SubmitHandler<LoginFormData> = async (formData) => {
        await doLogin(formData);
    };

    return (
        <FormContainer maxWidth="max-w-md" padding="pt-6 pb-2 px-8">
            <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                    label={{
                        text: 'UserName or Email',
                        textSize: 'text-md',
                    }}
                    {...register("userNameOrEmail")}
                    error={{
                        text: errors.userNameOrEmail?.message,
                        textSize: 'text-sm',
                    }}
                    disabled={loginLoading}
                />
                <FormInput
                    label={{
                        text: 'Password',
                        textSize: 'text-md',
                    }}
                    type="password"
                    {...register("password")}
                    error={{
                        text: errors.password?.message,
                        textSize: 'text-sm',
                    }}
                    disabled={loginLoading}
                />
                <FormButton disabled={isDisabled} loading={loginLoading} padding="py-3 w-full">Login</FormButton>
                <FormError message={loginError} loading={loginLoading} />
            </form>
        </FormContainer>
    );
}