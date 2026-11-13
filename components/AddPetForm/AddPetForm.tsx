"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isAxiosError } from "axios";
import * as yup from "yup";
import toast from "react-hot-toast";

import { FaVenus, FaMars, FaVenusMars } from "react-icons/fa6";
import { LuPawPrint, LuUpload } from "react-icons/lu";
import { FiChevronDown } from "react-icons/fi";

import { addPet, fetchNoticeSpecies } from "@/lib/clientApi";
import { uploadAvatar } from "@/lib/cloudinary/cloudinary";

import styles from "./AddPetForm.module.css";

const IMAGE_URL_REGEXP =
  /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/;

const DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/;

const ALLOWED_IMAGE_HOSTS = [
  "petlove.b.goit.study",
  "www.nytimes.com",
  "media4.giphy.com",
  "ftp.goit.study",
  "res.cloudinary.com",
];

const isAllowedImageHost = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "https:" &&
      ALLOWED_IMAGE_HOSTS.includes(parsedUrl.hostname)
    );
  } catch {
    return false;
  }
};

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isRealDate = (value: string): boolean => {
  if (!DATE_REGEXP.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const isValidBirthday = (value: string): boolean => {
  if (!isRealDate(value)) {
    return false;
  }

  return value <= getTodayDate();
};

const schema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Title is required"),

  name: yup
    .string()
    .trim()
    .required("Pet's name is required"),

  imgUrl: yup
    .string()
    .required("Pet photo is required")
    .matches(
      IMAGE_URL_REGEXP,
      "Enter a valid image URL"
    ),

  species: yup
    .string()
    .required("Select a pet type"),

  birthday: yup
    .string()
    .required("Birthday is required")
    .matches(
      DATE_REGEXP,
      "Use YYYY-MM-DD format"
    )
    .test(
      "valid-date",
      "Enter a valid date",
      (value) => {
        if (!value || !DATE_REGEXP.test(value)) {
          return true;
        }

        return isRealDate(value);
      }
    )
    .test(
      "not-future",
      "Birthday cannot be in the future",
      (value) => {
        if (!value || !DATE_REGEXP.test(value)) {
          return true;
        }

        if (!isRealDate(value)) {
          return true;
        }

        return isValidBirthday(value);
      }
    ),

  sex: yup
    .string()
    .required("Select pet sex")
    .oneOf(
      ["unknown", "female", "male", "multiple"],
      "Select a valid pet sex"
    ),
});

type AddPetFormValues = yup.InferType<typeof schema>;

export default function AddPetForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AddPetFormValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      name: "",
      imgUrl: "",
      species: "",
      birthday: "",
      sex: "",
    },
  });

  const imgUrl = useWatch({
    control,
    name: "imgUrl",
  });

  const showImage =
    IMAGE_URL_REGEXP.test(imgUrl ?? "") &&
    failedImageUrl !== imgUrl;

  useEffect(() => {
    let isActive = true;

    const loadSpecies = async () => {
      try {
        const species = await fetchNoticeSpecies();

        if (isActive) {
          setSpeciesOptions(species);
        }
      } catch {
        if (isActive) {
          toast.error("Failed to load pet types");
        }
      } finally {
        if (isActive) {
          setIsLoadingSpecies(false);
        }
      }
    };

    void loadSpecies();

    return () => {
      isActive = false;
    };
  }, []);

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadAvatar(file);

      setFailedImageUrl(null);

      setValue("imgUrl", imageUrl, {
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

  const onSubmit = async (data: AddPetFormValues) => {
    if (!isRealDate(data.birthday)) {
      setError("birthday", {
        type: "manual",
        message: "Enter a valid date",
      });
      return;
    }

    if (!isValidBirthday(data.birthday)) {
      setError("birthday", {
        type: "manual",
        message: "Birthday cannot be in the future",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await addPet({
        title: data.title,
        name: data.name,
        imgURL: data.imgUrl,
        species: data.species,
        birthday: data.birthday,
        sex: data.sex,
      });

      toast.success("Pet added successfully!");

      router.push("/profile");
      router.refresh();
    } catch (error) {
      let message = "Failed to add pet";

      if (isAxiosError(error)) {
        const responseData = error.response?.data as
          | { error?: string; message?: string }
          | undefined;

        message =
          responseData?.error ??
          responseData?.message ??
          message;
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Add my pet /</h1>
        <p className={styles.description}>Personal details</p>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.fieldsWrap}>
          <div className={styles.sexField}>
            <fieldset className={styles.optionsList}>
              <legend className="visually-hidden">
                Pet sex
              </legend>

              <label className={`${styles.sexOption} ${styles.female}`}>
                <input
                  type="radio"
                  value="female"
                  {...register("sex")}
                  className={styles.sexInput}
                />
                <FaVenus
                  className={styles.sexIcon}
                  aria-hidden="true"
                />
                <span className="visually-hidden">Female</span>
              </label>

              <label className={`${styles.sexOption} ${styles.male}`}>
                <input
                  type="radio"
                  value="male"
                  {...register("sex")}
                  className={styles.sexInput}
                />
                <FaMars
                  className={styles.sexIcon}
                  aria-hidden="true"
                />
                <span className="visually-hidden">Male</span>
              </label>

              <label className={`${styles.sexOption} ${styles.multiple}`}>
                <input
                  type="radio"
                  value="multiple"
                  {...register("sex")}
                  className={styles.sexInput}
                />
                <FaVenusMars
                  className={styles.sexIcon}
                  aria-hidden="true"
                />
                <span className="visually-hidden">Multiple</span>
              </label>
            </fieldset>

            {errors.sex && (
              <p className={styles.error}>
                {errors.sex.message}
              </p>
            )}
          </div>

          <div className={styles.avatarWrap}>
            <div className={styles.avatarPreview}>
              {showImage ? (
                <Image
                  key={imgUrl}
                  src={imgUrl}
                  alt="Pet preview"
                  width={80}
                  height={80}
                  unoptimized={!isAllowedImageHost(imgUrl)}
                  className={styles.avatarImage}
                  onError={() => setFailedImageUrl(imgUrl)}
                />
              ) : (
                <LuPawPrint
                  className={styles.pawIcon}
                  aria-hidden="true"
                />
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
                type="url"
                {...register("imgUrl")}
                placeholder="Enter URL"
                aria-label="Pet image URL"
                aria-invalid={!!errors.imgUrl}
                className={`${styles.input} ${
                  errors.imgUrl ? styles.inputError : ""
                }`}
              />

              <button
                type="button"
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isSubmitting}
              >
                <span>
                  {isUploading ? "Uploading..." : "Upload photo"}
                </span>
                <LuUpload
                  className={styles.uploadIcon}
                  aria-hidden="true"
                />
              </button>
            </div>

            {errors.imgUrl && (
              <p className={styles.error}>
                {errors.imgUrl.message}
              </p>
            )}
          </div>

          <div className={styles.petFields}>
            <div className={styles.field}>
              <input
                type="text"
                {...register("title")}
                placeholder="Title"
                aria-label="Title"
                aria-invalid={!!errors.title}
                className={`${styles.input} ${
                  errors.title ? styles.inputError : ""
                }`}
              />

              {errors.title && (
                <p className={styles.error}>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <input
                type="text"
                {...register("name")}
                placeholder="Pet's Name"
                aria-label="Pet's name"
                aria-invalid={!!errors.name}
                className={`${styles.input} ${
                  errors.name ? styles.inputError : ""
                }`}
              />

              {errors.name && (
                <p className={styles.error}>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className={styles.wrapBthD_Type}>
              <div className={styles.field}>
                <input
                  type="date"
                  {...register("birthday")}
                  max={getTodayDate()}
                  aria-label="Pet birthday"
                  aria-invalid={!!errors.birthday}
                  className={`${styles.input} ${
                    errors.birthday ? styles.inputError : ""
                  }`}
                />

                {errors.birthday && (
                  <p className={styles.error}>
                    {errors.birthday.message}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.speciesSelect}>
                  <select
                    {...register("species")}
                    aria-label="Type of pet"
                    aria-invalid={!!errors.species}
                    disabled={isLoadingSpecies}
                    className={`${styles.input} ${styles.speciesInput} ${
                      errors.species ? styles.inputError : ""
                    }`}
                  >
                    <option value="" disabled>
                      {isLoadingSpecies
                        ? "Loading..."
                        : "Type of pet"}
                    </option>

                    {speciesOptions.map((species) => (
                      <option key={species} value={species}>
                        {species.charAt(0).toUpperCase() +
                          species.slice(1)}
                      </option>
                    ))}
                  </select>

                  <FiChevronDown
                    className={styles.speciesArrow}
                    aria-hidden="true"
                  />
                </div>

                {errors.species && (
                  <p className={styles.error}>
                    {errors.species.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonsWrap}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonBack}`}
            onClick={() => router.push("/profile")}
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className={`${styles.button} ${styles.buttonSub}`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}