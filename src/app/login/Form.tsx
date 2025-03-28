"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";


type dataType = { email: string; password: string };

function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<dataType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const updateShowPass = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPass((p) => !p);
  };

  const onSubmit = async (data: dataType) => {
    try {
      const status = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/dashboard",
        ...data,
      });

      if (!status) {
        setError("Something went wrong. Please try again.");
        return;
      }

      if (!status.error) {
        router.push("/dashboard");
      } else {
        setError(status.error);
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="text-red-600 text-center">{error}</div>}

      <div className="mb-4">
        <label htmlFor="login-email">Email</label>
        <input
          autoFocus
          id="login-email"
          type="email"
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email",
            },
          })}
        />
        {errors.email && <div className="text-xs text-red-600">{errors.email.message}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="login-password">Password</label>
        <div className="relative">
          <input
            id="login-password"
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            className="pr-9"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                message:
                  "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
              },
            })}
          />
          <button
            onClick={updateShowPass}
            className="px-0 absolute bottom-1 right-2"
            type="button"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? (
              <AiFillEye size={20} />
            ) : (
              <AiFillEyeInvisible size={20} />
            )}
          </button>
        </div>
        {errors.password && <div className="text-xs text-red-600">{errors.password.message}</div>}
      </div>

      <button className="block mx-auto px-12 bg-slate-900 text-white hover:bg-slate-700 transition-colors" type="submit">
        Login
      </button>
    </form>
  );
}

export default Form;
