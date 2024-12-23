import { useForm } from "react-hook-form";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { getUser } from "@/lib/auth";
import type {
  EmailFormValues,
  PasswordFormValues,
  ProfileFormValues,
} from "@/routes/_app/account";
import {
  emailSchema,
  passwordSchema,
  profileSchema,
} from "@/routes/_app/account";

interface UseAccountFormsProps {
  onEmailSubmit: (data: EmailFormValues) => Promise<void>;
  onPasswordSubmit: (data: PasswordFormValues) => Promise<void>;
  onProfileSubmit: (data: ProfileFormValues) => Promise<void>;
}

export function useAccountForms({
  onEmailSubmit,
  onPasswordSubmit,
  onProfileSubmit,
}: UseAccountFormsProps) {
  const user = getUser();

  const emailForm = useForm<EmailFormValues>({
    resolver: typeboxResolver(emailSchema),
    defaultValues: {
      email: "",
      confirmEmail: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: typeboxResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: typeboxResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  return {
    emailForm,
    passwordForm,
    profileForm,
    handleEmailSubmit: emailForm.handleSubmit(onEmailSubmit),
    handlePasswordSubmit: passwordForm.handleSubmit(onPasswordSubmit),
    handleProfileSubmit: profileForm.handleSubmit(onProfileSubmit),
  };
}
