"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2, ExternalLink } from "lucide-react";
import { BetaBadge } from "@/components/ui/beta-badge";
import Image from "next/image";

const emailProviders = [
  {
    name: "Gmail",
    url: "https://mail.google.com",
  },
  {
    name: "Outlook",
    url: "https://outlook.live.com",
  },
];


function SignInContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isResent, setIsResent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      router.replace(`/auth/error?error=${errorParam}`);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      await signIn("resend", {
        email,
        redirect: false,
        callbackUrl,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      await signIn("resend", {
        email,
        redirect: false,
        callbackUrl,
      });
      setIsResent(true);
      setTimeout(() => {
        setIsResent(false);
      }, 2500);
    } catch (error) {
      console.error("Resend email error:", error);
    } finally {
      setIsResending(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900 p-4 sm:p-6">
        <Card className="w-full max-w-sm sm:max-w-md bg-white/95 dark:bg-zinc-900/95 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4 ring-1 ring-green-200/60 dark:ring-green-800/40">
              <Mail className="w-6 h-6 text-green-700 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-foreground dark:text-zinc-100">
              Check your email
            </CardTitle>
            <CardDescription className="text-muted-foreground dark:text-zinc-400">
              We&apos;ve sent a magic link to{" "}
              <strong className="text-foreground dark:text-zinc-100">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center mb-4 dark:text-zinc-400">
              Click the link in the email to sign in to your account. The link will expire in 24
              hours.
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-500 text-center mb-4">
              It may take up to 2 minutes for the email to arrive.
            </p>
            <div className="space-y-2">
              {emailProviders.map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  className="w-full justify-between bg-white border-gray-200 text-gray-900 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-colors active:scale-95"
                  onClick={() => window.open(provider.url, "_blank")}
                >
                  Open {provider.name}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full bg-white border-gray-200 text-gray-900 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-zinc-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900"
              onClick={handleResendEmail}
              disabled={isResending}
              aria-busy={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending another email...
                </>
              ) : isResent ? (
                "Sent!"
              ) : (
                "Send another email"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900 p-4 sm:p-6">
      <Card className="w-full bg-white max-w-sm sm:max-w-md dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-4 ring-1 ring-blue-200/60 dark:ring-blue-800/40">
            <Image src="/logo/gumboard.svg" alt="Gumboard Logo" width={48} height={48} />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground dark:text-zinc-100 flex items-center gap-2 justify-center">
            Welcome to Gumboard
            <BetaBadge />
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-zinc-400">
            {searchParams.get("email")
              ? "we'll send you a magic link to verify your email address"
              : "Enter your email address and we'll send you a magic link to sign in"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {searchParams.get("email") && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  📧 You&apos;re signing in from an organization invitation
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground dark:text-zinc-200">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || !!searchParams.get("email")}
                required
                className="h-12 bg-white border-gray-300 text-foreground placeholder:text-gray-400 hover:border-gray-400  transition-colors"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              className="w-full h-12 font-medium mt-4 bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-zinc-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900"
              disabled={isLoading || !email}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending magic link...
                </>
              ) : (
                <>
                  Continue with Email
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900 p-4 sm:p-6">
      <Card className="w-full max-w-sm sm:max-w-md bg-white/95 dark:bg-zinc-900/95 border border-gray-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 dark:bg-zinc-800">
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground dark:border-zinc-700 dark:border-t-zinc-100" />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-foreground dark:text-zinc-100">
            Loading...
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-zinc-400">
            Please wait while we prepare the sign in page
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignInContent />
    </Suspense>
  );
}
