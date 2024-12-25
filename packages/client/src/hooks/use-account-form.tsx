import { useForm } from "react-hook-form";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import type {
  PasswordFormValues,
  ProfileFormValues,
} from "@/routes/_app/account";
import { passwordSchema, profileSchema } from "@/routes/_app/account";
import { useUser } from "@/stores/auth-store";

interface UseAccountFormsProps {
  onPasswordSubmit: (data: PasswordFormValues) => Promise<void>;
  onProfileSubmit: (data: ProfileFormValues) => Promise<void>;
}

export function useAccountForms({
  onPasswordSubmit,
  onProfileSubmit,
}: UseAccountFormsProps) {
  const user = useUser();
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
    passwordForm,
    profileForm,
    handlePasswordSubmit: passwordForm.handleSubmit(onPasswordSubmit),
    handleProfileSubmit: profileForm.handleSubmit(onProfileSubmit),
  };
}
