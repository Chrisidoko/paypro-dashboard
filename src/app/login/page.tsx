import { LoginForm } from "./LoginForm";

export default function Login() {
  return (

      <div className="flex flex-col items-center mt-24 gap-5 ">
        <div className="text-3xl font-semibold">Admin Dashboard </div>
      <LoginForm />
      </div>

  );
}