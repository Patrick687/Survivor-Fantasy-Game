import { useForm, type SubmitHandler } from "react-hook-form";
import type { LoginInput } from "../graphql/generated";
import FormInput from "../components/ui/form/FormInput";
import FormButton from "../components/ui/form/FormButton";
import FormContainer from "../components/ui/form/FormContainer";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormError } from "../components/ui/form/FormError";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../app/store";
import { login } from "./authSlice";
import { useNavigate } from "react-router-dom";

type LoginFormData = LoginInput;

const loginSchema = z.object({
    userNameOrEmail: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
});

export default function LoginForm() {

    const {
        loading: loginLoading, error: loginError
    } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<LoginFormData>({
        mode: 'onChange',
        resolver: zodResolver(loginSchema),
    });

    const isDisabled = !isValid || isSubmitting;

    const onSubmit: SubmitHandler<LoginFormData> = async (formData) => {
        try {
            const loginResult = await dispatch(login(formData));
            if (login.fulfilled.match(loginResult)) {
                navigate('/');
            } else if (login.rejected.match(loginResult)) {
                console.error(loginResult);
            }
        } catch (error) {
            console.error('Unrecognized Error', error);
        }
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
                <FormError message={loginError?.message || 'Cannot parse error'} loading={loginLoading} />
            </form>
        </FormContainer>
    );
}