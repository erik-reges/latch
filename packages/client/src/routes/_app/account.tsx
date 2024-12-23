import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { isAuthenticated, changeEmail, changePassword } from "@/lib/auth";
import { useAccountForms } from "@/hooks/use-account-form";
import { Type } from "@sinclair/typebox";

export const emailSchema = Type.Object(
  {
    email: Type.String({
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    }),
    confirmEmail: Type.String({
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    }),
  },
  {
    additionalProperties: false,
  },
);

export const passwordSchema = Type.Object(
  {
    currentPassword: Type.String({ minLength: 8 }),
    newPassword: Type.String({ minLength: 8 }),
    confirmPassword: Type.String({ minLength: 8 }),
  },
  {
    additionalProperties: false,
  },
);

export const profileSchema = Type.Object(
  {
    name: Type.String({ minLength: 2 }),
    phone: Type.Optional(Type.String()),
  },
  {
    additionalProperties: false,
  },
);

export type EmailFormValues = typeof emailSchema.static;
export type PasswordFormValues = typeof passwordSchema.static;
export type ProfileFormValues = typeof profileSchema.static;

export const Route = createFileRoute("/_app/account")({
  component: AccountRoute,
  beforeLoad: async ({ location }) => {
    if (!(await isAuthenticated())) {
      throw redirect({
        to: "/signup",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function AccountRoute() {
  const emailMutation = useMutation({
    mutationFn: async (data: EmailFormValues) => {
      await changeEmail({
        newEmail: data.email,
      });
    },
    onSuccess: () => {
      toast.success("Email updated successfully");
      emailForm.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      passwordForm.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      // Implement updateUser mutation here
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    emailForm,
    passwordForm,
    profileForm,
    handleEmailSubmit,
    handlePasswordSubmit,
    handleProfileSubmit,
  } = useAccountForms({
    onEmailSubmit: (data) => emailMutation.mutateAsync(data),
    onPasswordSubmit: (data) => passwordMutation.mutateAsync(data),
    onProfileSubmit: (data) => profileMutation.mutateAsync(data),
  });

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account settings and set your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Form {...profileForm}>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={profileMutation.isPending}>
                    {profileMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Profile
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Form {...emailForm}>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="confirmEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={emailMutation.isPending}>
                    {emailMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Email
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="password" className="space-y-4">
              <Form {...passwordForm}>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={passwordMutation.isPending}>
                    {passwordMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Password
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
