"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { register as registerUser } from "@/lib/clientApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/authSlice";
import css from "./RegistrationForm.module.css";

const EMAIL_REGEXP =
  /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const schema = yup.object({
  name: yup.string().required("Name is required"),

  email: yup
    .string()
    .required("Email is required")
    .matches(EMAIL_REGEXP, "Invalid email format"),

  password: yup
    .string()
    .required("Password is required")
    .min(7, "Password must be at least 7 characters"),

  confirm: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type RegisterValues = yup.InferType<typeof schema>;

export default function RegistrationForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const getInputClass = (field: keyof RegisterValues) => {
    if (!touchedFields[field]) {
      return css.formControl;
    }

    return `${css.formControl} ${
      errors[field] ? css.controlInvalid : css.controlValid
    }`;
  };

  const onSubmit = async (data: RegisterValues) => {
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      dispatch(
        setUser({
          name: user.name,
          email: user.email,
        })
      );

      toast.success("Registration successful!");

      router.push("/profile");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.error ??
          "Registration failed. Please try again.";

        toast.error(
          typeof message === "string"
            ? message
            : "Registration failed. Please try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form
      className={css.registrationForm}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={css.formField}>
        <div className={css.controlWrapper}>
          <input
            id="name"
            type="text"
            placeholder="Name"
            autoComplete="name"
            aria-label="Name"
            aria-invalid={!!errors.name}
            {...register("name")}
            className={getInputClass("name")}
          />

          {touchedFields.name &&
            (errors.name ? (
              <FiX className={css.statusInvalid} />
            ) : (
              <FiCheck className={css.statusValid} />
            ))}
        </div>

        {errors.name && (
          <p className={css.validationMessage}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div className={css.formField}>
        <div className={css.controlWrapper}>
          <input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            aria-label="Email"
            aria-invalid={!!errors.email}
            {...register("email")}
            className={getInputClass("email")}
          />

          {touchedFields.email &&
            (errors.email ? (
              <FiX className={css.statusInvalid} />
            ) : (
              <FiCheck className={css.statusValid} />
            ))}
        </div>

        {errors.email && (
          <p className={css.validationMessage}>
            {errors.email.message}
          </p>
        )}
      </div>

      <div className={css.formField}>
        <div className={css.controlWrapper}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            aria-label="Password"
            aria-invalid={!!errors.password}
            {...register("password")}
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
            className={css.visibilityButton}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
            aria-pressed={showPassword}
          >
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </button>
        </div>

        {errors.password && (
          <p className={css.validationMessage}>
            {errors.password.message}
          </p>
        )}
      </div>

      <div className={css.formField}>
        <div className={css.controlWrapper}>
          <input
            id="confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            autoComplete="new-password"
            aria-label="Confirm password"
            aria-invalid={!!errors.confirm}
            {...register("confirm")}
            className={getInputClass("confirm")}
          />

          {touchedFields.confirm &&
            (errors.confirm ? (
              <FiX className={css.passwordInvalid} />
            ) : (
              <FiCheck className={css.passwordValid} />
            ))}

          <button
            type="button"
            className={css.visibilityButton}
            onClick={() => setShowConfirm((prev) => !prev)}
            aria-label={
              showConfirm
                ? "Hide confirm password"
                : "Show confirm password"
            }
            aria-pressed={showConfirm}
          >
            {showConfirm ? <FiEye /> : <FiEyeOff />}
          </button>
        </div>

        {errors.confirm && (
          <p className={css.validationMessage}>
            {errors.confirm.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={css.registerButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "REGISTERING..." : "REGISTRATION"}
      </button>
    </form>
  );
}