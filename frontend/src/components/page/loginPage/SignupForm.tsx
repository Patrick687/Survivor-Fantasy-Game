import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../ui/Button";
import { useAuthService } from "../../../services/authService";

const signupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm({ onSubmit }: { onSubmit?: (data: SignupFormValues) => void; }) {
    const { signup, signupResult } = useAuthService();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    return (
        <form className="space-y-6" onSubmit={handleSubmit(async (data) => {
            await signup(data.email, data.password);
            if (onSubmit) onSubmit(data);
        })}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-pacific-blue-900 dark:text-pearl-aqua-100">Email</label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="mt-1 block w-full rounded border border-pearl-aqua-300 dark:border-pacific-blue-700 bg-pearl-aqua-50 dark:bg-pacific-blue-900 px-3 py-2 text-pacific-blue-900 dark:text-pearl-aqua-100 focus:outline-none focus:ring-2 focus:ring-pacific-blue-400"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-pacific-blue-900 dark:text-pearl-aqua-100">Password</label>
                <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className="mt-1 block w-full rounded border border-pearl-aqua-300 dark:border-pacific-blue-700 bg-pearl-aqua-50 dark:bg-pacific-blue-900 px-3 py-2 text-pacific-blue-900 dark:text-pearl-aqua-100 focus:outline-none focus:ring-2 focus:ring-pacific-blue-400"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-pacific-blue-900 dark:text-pearl-aqua-100">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className="mt-1 block w-full rounded border border-pearl-aqua-300 dark:border-pacific-blue-700 bg-pearl-aqua-50 dark:bg-pacific-blue-900 px-3 py-2 text-pacific-blue-900 dark:text-pearl-aqua-100 focus:outline-none focus:ring-2 focus:ring-pacific-blue-400"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
        </form>
    );
}
