"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { login } from "@/lib/clientApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/authSlice";

import css from "./LoginForm.module.css";

const EMAIL_REGEXP =
  /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(EMAIL_REGEXP, "Invalid email format"),

  password: yup
    .string()
    .required("Password is required")
    .min(7, "Password must be at least 7 characters"),
});

type LoginValues = yup.InferType<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<LoginValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const getInputClass = (field: keyof LoginValues) => {
    if (!touchedFields[field]) {
      return css.input;
    }

    return `${css.input} ${
      errors[field] ? css.inputError : css.inputValid
    }`;
  };

  const onSubmit = async (data: LoginValues) => {
    try {
      const user = await login({
        email: data.email,
        password: data.password,
      });

      dispatch(
        setUser({
          name: user.name,
          email: user.email,
        })
      );

      toast.success(`Welcome back, ${user.name}!`);
      router.replace("/profile");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.error ??
          "Login failed. Please check your email and password.";

        toast.error(
          typeof message === "string"
            ? message
            : "Login failed. Please try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form
      className={css.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={css.fieldsWrap}>
        <div className={css.formField}>
          <div className={css.field}>
            <input
              id="login-email"
              type="email"
              {...register("email")}
              autoComplete="email"
              placeholder="Email"
              aria-label="Email"
              aria-invalid={!!errors.email}
              className={getInputClass("email")}
            />

            {touchedFields.email &&
              (errors.email ? (
                <FiX className={css.iconInvalid} />
              ) : (
                <FiCheck className={css.iconValid} />
              ))}
          </div>

          {errors.email && (
            <p className={css.error}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={css.formField}>
          <div className={css.field}>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              aria-invalid={!!errors.password}
              className={getInputClass("password")}
            />

            {touchedFields.password &&
              (errors.password ? (
                <FiX className={css.passwordInvalid} />
              ) : (
                <FiCheck className={css.passwordValid} />
              ))}

            <button
              type="button"
              className={css.passwordToggle}
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              aria-pressed={showPassword}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          {errors.password && (
            <p className={css.error}>
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className={css.button}
        disabled={isSubmitting}
      >
        {isSubmitting ? "LOGGING IN..." : "LOG IN"}
      </button>
    </form>
  );
}