'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

type FormValues = {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactForm({
  locale,
  defaultSubject,
  defaultMessage,
}: {
  locale: string
  defaultSubject?: string
  defaultMessage?: string
}) {
  const t = useTranslations('contact')
  const isFR = locale === 'fr'
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle',
  )
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      subject: defaultSubject ?? '',
      message: defaultMessage ?? '',
    },
  })

  async function onSubmit(values: FormValues) {
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  // Friendly placeholders for an 18–22 yo audience who doesn't have it all figured out.
  const placeholders = isFR
    ? {
        name: 'Votre prénom',
        email: 'vous@exemple.com',
        subject: 'Ex. « J’hésite entre deux Bachelor », « Question sur le portfolio »',
        message:
          'Pas besoin de tout structurer. Racontez-nous où vous en êtes, ce qui vous attire, ce qui vous bloque. On lit chaque message et on vous répond.',
      }
    : {
        name: 'Your first name',
        email: 'you@example.com',
        subject: 'e.g. “I hesitate between two Bachelor programs”, “Portfolio question”',
        message:
          'No need to overthink it. Tell us where you are, what attracts you, what holds you back. We read every message and reply.',
      }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field label={t('name')} error={errors.name?.message}>
        <input
          {...register('name', { required: true })}
          placeholder={placeholders.name}
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
          autoComplete="name"
        />
      </Field>
      <Field label={t('email')} error={errors.email?.message}>
        <input
          type="email"
          {...register('email', { required: true })}
          placeholder={placeholders.email}
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
          autoComplete="email"
        />
      </Field>
      <Field label={t('subject')} error={errors.subject?.message}>
        <input
          {...register('subject', { required: true })}
          placeholder={placeholders.subject}
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
        />
      </Field>
      <Field label={t('message')} error={errors.message?.message}>
        <textarea
          rows={6}
          {...register('message', { required: true })}
          placeholder={placeholders.message}
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
        />
      </Field>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-accent disabled:opacity-60"
      >
        {status === 'sending' ? t('sending') : t('send')}
      </button>

      {status === 'success' && (
        <p className="text-sm text-green-700">{t('success')}</p>
      )}
      {status === 'error' && <p className="text-sm text-red-700">{t('error')}</p>}
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
