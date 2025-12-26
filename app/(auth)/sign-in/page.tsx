import AuthForm from "@/components/AuthForm";
import { signIn } from "@/src/lib/auth/actions";

const SignInPage = () => {
  return (
    <AuthForm
      variant="sign-in"
      title="Welcome back"
      subtitle="Please enter your details to sign in to your account."
      submitLabel="Sign In"
      topLinkPrefix="Don't have an account?"
      topLinkLabel="Sign Up"
      topLinkHref="/sign-up"
      showForgotPassword
      onSubmit={signIn}
    />
  );
};

export default SignInPage;

