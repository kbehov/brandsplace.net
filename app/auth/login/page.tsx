import type { Metadata } from "next"

import { LoginForm } from "@/components/form/login-form"

export const metadata: Metadata = {
  title: "Вход",
}

export default function LoginPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-background py-8 pb-16 sm:py-12">
      <LoginForm />
    </div>
  )
}
