import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { changePassword, updateUser, useSession } from "@/lib/auth";
import {
  useAccountForms,
  type PasswordFormValues,
  type ProfileFormValues,
} from "@/hooks/use-account-form";
import { sessionStore } from "@/lib/store";

export const Route = createFileRoute("/_app-layout/account")({
  component: AccountRoute,
});

function AccountRoute() {
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
    mutationFn: async (input: ProfileFormValues) => {
      const { data, error } = await updateUser({ name: input.name });
      if (error) {
        throw Error("error");
      }
      sessionStore.setState({ user: data });
      return;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { user } = sessionStore.getState();

  const {
    passwordForm,
    profileForm,
    handlePasswordSubmit,
    handleProfileSubmit,
  } = useAccountForms({
    onPasswordSubmit: (data) => passwordMutation.mutateAsync(data),
    onProfileSubmit: (data) => profileMutation.mutateAsync(data),
  });
  return (
    <div className=" h-full flex justify-center py-8 ">
      <div className="container max-w-xl">
        <Card>
          <CardHeader className="max-w-md mx-auto">
            <CardTitle>
              <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
                {`Account settings for user: ${user?.email ?? ""}`}
              </h2>
            </CardTitle>
            <CardDescription>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                Manage your account settings and set your preferences.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <div className="flex justify-center w-full pb-4">
                <TabsList className="w-3/4">
                  <TabsTrigger value="profile" className="w-full p-1">
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="password" className="w-full p-1">
                    Password
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent
                value="profile"
                className="space-y-4 max-w-md mx-auto"
              >
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

                    <Button type="submit" disabled={profileMutation.isPending}>
                      {profileMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Profile
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent
                value="password"
                className="space-y-4 max-w-md mx-auto"
              >
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
                    <Button
                      type="submit"
                      className="mt-4"
                      disabled={passwordMutation.isPending}
                    >
                      {passwordMutation.isPending && (
                        <Loader2 className="mr-2  h-4 w-4 animate-spin" />
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
    </div>
  );
}
