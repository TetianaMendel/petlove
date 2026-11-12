"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FiUser, FiX, FiUploadCloud } from "react-icons/fi";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/authSlice";
import { updateUser, fetchFullUser } from "@/lib/clientApi";
import { uploadAvatar } from "@/lib/cloudinary/cloudinary";
import Modal from "@/components/Modal/Modal";
import styles from "./ModalEditUser.module.css";

interface ModalEditUserProps {
  onClose: () => void;
}

interface EditUserForm {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

const EMAIL_REGEXP =
  /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const PHONE_REGEXP = /^\+38\d{10}$/;

const AVATAR_REGEXP =
  /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/;

const schema: yup.ObjectSchema<EditUserForm> = yup.object({
  name: yup.string().trim().required("Name is required"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .matches(EMAIL_REGEXP, "Invalid email format"),

  phone: yup
    .string()
    .trim()
    .defined()
    .test(
      "valid-phone",
      "Phone must have the format +38XXXXXXXXXX",
      (value) => !value || PHONE_REGEXP.test(value)
    ),

  avatar: yup
    .string()
    .trim()
    .defined()
    .test(
      "valid-avatar",
      "Enter a valid image URL",
      (value) => !value || AVATAR_REGEXP.test(value)
    ),
});

export default function ModalEditUser({
  onClose,
}: ModalEditUserProps) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EditUserForm>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      avatar: user?.avatar ?? "",
    },
  });

  const avatarValue = useWatch({
    control,
    name: "avatar",
  });

  const isValidAvatarUrl = AVATAR_REGEXP.test(avatarValue ?? "");

  const { mutateAsync: saveUser, isPending } = useMutation({
    mutationFn: updateUser,
  });

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadAvatar(file);

      setValue("avatar", imageUrl, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      toast.success("Photo uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const onSubmit = async (data: EditUserForm) => {
    try {
      const updateData = {
        name: data.name.trim(),
        email: data.email.trim(),
        ...(data.phone.trim() && {
          phone: data.phone.trim(),
        }),
        ...(data.avatar.trim() && {
          avatar: data.avatar.trim(),
        }),
      };

      await saveUser(updateData);

      const updatedUser = await fetchFullUser();

      dispatch(
        setUser({
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          phone: updatedUser.phone,
        })
      );

      queryClient.setQueryData(
        ["full-user", user?.email],
        updatedUser
      );

      if (updatedUser.email !== user?.email) {
        queryClient.setQueryData(
          ["full-user", updatedUser.email],
          updatedUser
        );
      }

      toast.success("Your information has been updated!");
      onClose();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ??
            error.response?.data?.message ??
            "Failed to update your information."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Modal onClose={onClose} className={styles.modalEditUser}>
      <button
        type="button"
        className={styles.modalClose}
        onClick={onClose}
        aria-label="Close modal"
      >
        <FiX className={styles.closeIcon} aria-hidden="true" />
      </button>

      <h2 className={styles.title}>Edit information</h2>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.avatarWrap}>
          <div className={styles.avatarPreview}>
            {isValidAvatarUrl ? (
              <Image
                src={avatarValue}
                alt="Your avatar"
                fill
                sizes="(min-width: 768px) 86px, 80px"
                className={styles.avatarImage}
                unoptimized
              />
            ) : (
              <FiUser className={styles.avatarIcon} />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            hidden
          />

          <div className={styles.avatarControls}>
            <input
              type="text"
              {...register("avatar")}
              placeholder="Enter URL"
              className={`${styles.input} ${
                errors.avatar ? styles.inputError : ""
              }`}
            />

            <button
              type="button"
              className={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isPending}
            >
              <span>
                {isUploading ? "Uploading..." : "Upload photo"}
              </span>
              <FiUploadCloud
                className={styles.uploadIcon}
                aria-hidden="true"
              />
            </button>
          </div>

          {errors.avatar && (
            <p className={styles.error}>{errors.avatar.message}</p>
          )}
        </div>

        <div className={styles.fieldsWrap}>
          <div className={styles.field}>
            <label htmlFor="edit-name" className="visually-hidden">
              Name
            </label>

            <input
              id="edit-name"
              type="text"
              {...register("name")}
              placeholder="Name"
              className={`${styles.input} ${
                errors.name ? styles.inputError : ""
              }`}
            />

            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="edit-email" className="visually-hidden">
              Email
            </label>

            <input
              id="edit-email"
              type="email"
              {...register("email")}
              placeholder="Email"
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
            />

            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="edit-phone" className="visually-hidden">
              Phone
            </label>

            <input
              id="edit-phone"
              type="tel"
              {...register("phone")}
              placeholder="+38"
              className={`${styles.input} ${
                errors.phone ? styles.inputError : ""
              }`}
            />

            {errors.phone && (
              <p className={styles.error}>{errors.phone.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`${styles.button} ${styles.buttonSub}`}
          disabled={isPending || isUploading}
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </Modal>
  );
}