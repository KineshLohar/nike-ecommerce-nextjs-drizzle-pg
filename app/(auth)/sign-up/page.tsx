import AuthForm from "@/components/AuthForm";

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
    />
  );
};

export default SignUpPage;

