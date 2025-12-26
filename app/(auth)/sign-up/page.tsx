import AuthForm from "@/components/AuthForm";
import { signUp } from "@/src/lib/auth/actions";

const SignUpPage = () => {
  return (
    <AuthForm
      variant="sign-up"
      title="Join Nike Today!"
      subtitle="Create your account to start your fitness journey."
      submitLabel="Sign Up"
      topLinkPrefix="Already have an account?"
      topLinkLabel="Sign In"
      topLinkHref="/sign-in"
      onSubmit={signUp}
    />
  );
};

export default SignUpPage;

