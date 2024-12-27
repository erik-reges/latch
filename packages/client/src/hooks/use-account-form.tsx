import { useForm } from "react-hook-form";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import type {
  PasswordFormValues,
  ProfileFormValues,
} from "@/routes/_app/account";
import { passwordSchema, profileSchema } from "@/routes/_app/account";
import { useSession } from "@/lib/auth";

interface UseAccountFormsProps {
  onPasswordSubmit: (data: PasswordFormValues) => Promise<void>;
  onProfileSubmit: (data: ProfileFormValues) => Promise<void>;
}

export function useAccountForms({
  onPasswordSubmit,
  onProfileSubmit,
}: UseAccountFormsProps) {
  const { data } = useSession();
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
      name: data?.user?.name || "",
    },
  });

  return {
    passwordForm,
    profileForm,
    handlePasswordSubmit: passwordForm.handleSubmit(onPasswordSubmit),
    handleProfileSubmit: profileForm.handleSubmit(onProfileSubmit),
  };
}
