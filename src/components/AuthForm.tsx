'use client'

import Link from "next/link";
import { FormEvent, useState } from "react";
import SocialProviders from "./SocialProviders";
import { useRouter } from "next/navigation";

type Variant = "sign-in" | "sign-up";

export interface AuthFormProps {
    variant: Variant;
    title: string;
    subtitle?: string;
    submitLabel?: string;
    topLinkLabel?: string;
    topLinkHref?: string;
    topLinkPrefix?: string;
    showForgotPassword?: boolean;
    onSubmit: (formData: FormData, redirectTo: string) => Promise<{ ok: boolean; userId?: string, error?: string; }>;
}

const AuthForm = ({
    variant,
    title,
    subtitle,
    submitLabel,
    topLinkHref,
    topLinkLabel,
    topLinkPrefix,
    showForgotPassword = false,
    onSubmit
}: AuthFormProps) => {

    const router = useRouter();
    const [errorText, setError] = useState("");
    const isSignIn = variant === "sign-in";
    const actionLabel = submitLabel ?? (isSignIn ? "Sign In" : "Create Account");


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget)
        if (!isSignIn) {
            const pass = formData.get("password");
            const confPass = formData.get("confirmPassword");
            if (pass !== confPass) return setError("Password & confirm password does not match!");
        }
        e.preventDefault();
        try {
            const res = await onSubmit(formData, "/");
            console.log("REES", res);
            
            if (!res?.ok && res.error) {
                setError(res.error)
                return
            }
            router.push("/")

        } catch (error) {
            console.log("ERROR", error);
            if (Array.isArray(error)) {
                setError(error[0]?.message)
                return;
            }
        }
    }

    return (
        <div className="w-full max-w-xl rounded-[28px] border border-[var(--color-light-300)] bg-[var(--color-light-100)] px-6 py-7 shadow-lg sm:px-8 sm:py-9">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <h1 className="text-[length:var(--text-heading-2)] font-[var(--text-heading-2--font-weight)] leading-[var(--text-heading-2--line-height)] text-[color:var(--color-dark-900)]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-700)]">
                            {subtitle}
                        </p>
                    )}
                </div>
                {topLinkHref && topLinkLabel && (
                    <div className="text-right text-[length:var(--text-caption)] leading-[var(--text-caption--line-height)] text-[color:var(--color-dark-700)]">
                        {topLinkPrefix && <span>{topLinkPrefix} </span>}
                        <Link
                            href={topLinkHref}
                            className="font-[var(--text-body-medium--font-weight)] text-[color:var(--color-dark-900)] underline underline-offset-4"
                        >
                            {topLinkLabel}
                        </Link>
                    </div>
                )}
            </div>

            <div className="mt-6 space-y-4">
                <SocialProviders />

                <div className="flex items-center gap-3 text-[length:var(--text-caption)] leading-[var(--text-caption--line-height)] text-[color:var(--color-dark-700)]">
                    <span className="h-px flex-1 bg-[var(--color-light-300)]" />
                    <span>Or sign {isSignIn ? "in" : "up"} with</span>
                    <span className="h-px flex-1 bg-[var(--color-light-300)]" />
                </div>
                {errorText && <div className="text-red mx-auto text-center gap-3">
                    {errorText}
                </div>}
            </div>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                {!isSignIn && (
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-[length:var(--text-body)] font-[var(--text-body-medium--font-weight)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-900)]"
                        >
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-[var(--color-light-300)] bg-[var(--color-light-200)] px-4 py-3 text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-900)] placeholder:text-[color:var(--color-dark-500)] focus:border-[var(--color-dark-900)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-dark-900)]"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="text-[length:var(--text-body)] font-[var(--text-body-medium--font-weight)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-900)]"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        className="w-full rounded-xl border border-[var(--color-light-300)] bg-[var(--color-light-200)] px-4 py-3 text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-900)] placeholder:text-[color:var(--color-dark-500)] focus:border-[var(--color-dark-900)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-dark-900)]"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="text-[length:var(--text-body)] font-[var(--text-body-medium--font-weight)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-900)]"
                        >
                            Password
                        </label>
                        {isSignIn && showForgotPassword && (
                            <Link
                                href="#"
                                className="text-[length:var(--text-caption)] font-[var(--text-body-medium--font-weight)] leading-[var(--text-caption--line-height)] text-[color:var(--color-dark-900)] underline underline-offset-4"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isSignIn ? "current-password" : "new-password"}
                        placeholder="Minimum 8 characters"
                        className="w-full rounded-xl border border-[var(--color-light-300)] bg-[var(--color-light-200)] px-4 py-3 text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-900)] placeholder:text-[color:var(--color-dark-500)] focus:border-[var(--color-dark-900)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-dark-900)]"
                    />
                </div>

                {!isSignIn && (
                    <div className="space-y-2">
                        <label
                            htmlFor="confirmPassword"
                            className="text-[length:var(--text-body)] font-[var(--text-body-medium--font-weight)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-900)]"
                        >
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Minimum 8 characters"
                            className="w-full rounded-xl border border-[var(--color-light-300)] bg-[var(--color-light-200)] px-4 py-3 text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-900)] placeholder:text-[color:var(--color-dark-500)] focus:border-[var(--color-dark-900)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-dark-900)]"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="mt-2 flex w-full items-center justify-center rounded-full bg-[var(--color-dark-900)] px-4 py-3 text-[length:var(--text-body)] font-[var(--text-body-medium--font-weight)] leading-[var(--text-body--line-height)] text-[color:var(--color-light-100)] transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-dark-900)]"
                >
                    {actionLabel}
                </button>
            </form>

            <div className="mt-6 text-center text-[length:var(--text-caption)] leading-[var(--text-caption--line-height)] text-[color:var(--color-dark-700)]">
                By signing {isSignIn ? "in" : "up"}, you agree to our{" "}
                <Link
                    href="#"
                    className="font-[var(--text-body-medium--font-weight)] text-[color:var(--color-dark-900)] underline underline-offset-4"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="#"
                    className="font-[var(--text-body-medium--font-weight)] text-[color:var(--color-dark-900)] underline underline-offset-4"
                >
                    Privacy Policy
                </Link>
                .
            </div>
        </div>
    );
};

export default AuthForm;

