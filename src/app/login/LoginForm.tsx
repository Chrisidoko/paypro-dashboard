"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./action";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <form action={loginAction} className="flex flex-col m-6 w-96 ">
      <div className="flex flex-col mb-10">
        <span className="mb-3 text-3xl font-bold text-[#151D48]">
          School Admin
        </span>
        <span className="font-light text-gray-400 mb-0.5 text-sm">
          Welcome back! Please enter your details
        </span>
      </div>

      <div className="py-4">
        <label htmlFor="email" className="mb-2 text-sm text-[#737791]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full p-2 border border-gray-100 rounded-md placeholder:font-light placeholder:text-gray-500"
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors.email}</p>
        )}
      </div>

      <div className="py-4">
        <label htmlFor="password" className="mb-2 text-sm text-[#737791]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full p-2 border border-gray-100 rounded-md placeholder:font-light placeholder:text-gray-500"
        />
        {state?.errors?.password && (
          <p className="text-red-500 text-sm">{state.errors.password}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full py-3 bg-[#D33833] mt-8 text-white p-2 rounded-lg mb-2 hover:bg-white hover:text-black hover:border hover:border-gray-300 disabled:bg-gray-300"
    >
      {pending ? "Loading..." : "Login"}
    </button>
  );
}
