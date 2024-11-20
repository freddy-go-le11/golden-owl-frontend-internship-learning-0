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
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { CircleCheck } from "lucide-react";

export function LoginForm() {
  const t = useTranslations("login");
  const [, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const formSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("invalid-email")),
        password: z.string().min(8, t("invalid-password")),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBlocked) {
      timer = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBlocked]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      if (isBlocked) return;

      const promise = async () => {
        try {
          setIsProcessing(true);
          // Simulating an API call
          await new Promise<void>((resolve) => {
            setTimeout(() => {
              // Simulate a failed login attempt
              // reject(new Error("Invalid credentials"));
              resolve();
            }, 1000);
          });

          setFailedAttempts(0);
          return data;
        } catch {
          setFailedAttempts((prev) => {
            const newAttempts = prev + 1;
            if (newAttempts >= 5) {
              setIsBlocked(true);
              setBlockTimeRemaining(5);
            }
            return newAttempts;
          });
          throw new Error("Invalid credentials");
        } finally {
          setIsProcessing(false);
        }
      };

      toast.promise(promise(), {
        loading: t("login-loading"),
        success: (data) => (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <CircleCheck className="size-4" />
              <h4 className="inline">{t("login-success")}</h4>
            </div>
            <pre className="p-2 bg-background ml-6 rounded-md text-foreground">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
        ),
        error: t("login-failed"),
      });
    },
    [isBlocked, setFailedAttempts, t]
  );

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
                      <Input
                        {...field}
                        placeholder="m@example.com"
                        disabled={isBlocked || isProcessing}
                      />
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
                      <Input
                        {...field}
                        type="password"
                        disabled={isBlocked || isProcessing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isBlocked || isProcessing}
              >
                {isBlocked
                  ? `${t("blocked")} (${blockTimeRemaining}s)`
                  : t("submit")}
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
