import type { Metadata } from 'next'

import { RegisterForm } from '@/components/form/register-form'

export const metadata: Metadata = {
  title: 'Регистрация',
}

export default function RegisterPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-background py-8 pb-16 sm:py-12">
      <RegisterForm />
    </div>
  )
}
