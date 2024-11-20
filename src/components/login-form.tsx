"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("login");

  const formSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("invalid-email")),
        password: z.string().min(8, t("invalid-password")),
      }),
    [t]
  );

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback((data: z.infer<typeof formSchema>) => {
    toast.success("Login Success", {
      description: () => (
        <pre className="p-2 bg-background w-full">
          {JSON.stringify(data, null, 2)}
        </pre>
      ),
    });
  }, []);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>{t("email-label")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="m@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>{t("password-label")}</FormLabel>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                      >
                        {t("forgot-password")}
                      </Link>
                    </div>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t("submit")}
              </Button>
              <Button type="button" variant="outline" className="w-full">
                {t("google-login")}
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {t("register-label")}{" "}
          <Link href="#" className="underline">
            {t("register-link")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
