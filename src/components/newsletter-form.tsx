'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type Profile = 'student' | 'professional' | 'parent' | 'other'

type FormValues = {
  email: string
  profile: Profile
  /** Honeypot — bots fill it, humans don't see it. */
  website?: string
}

export function NewsletterForm({
  locale,
  variant = 'full',
}: {
  locale: string
  /** "compact" hides the profile select (e.g. for the footer slot). */
  variant?: 'full' | 'compact'
}) {
  const isFR = locale === 'fr'
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'already' | 'error'
  >('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { profile: 'other' },
  })

  async function onSubmit(values: FormValues) {
    setStatus('sending')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale }),
      })
      if (!res.ok) throw new Error('failed')
      const data = (await res.json()) as { ok?: boolean; alreadyActive?: boolean }
      setStatus(data.alreadyActive ? 'already' : 'success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  const L = isFR
    ? {
        emailLabel: 'Votre email',
        emailPlaceholder: 'vous@exemple.com',
        profileLabel: 'Vous êtes…',
        profiles: {
          student: 'Étudiant·e / Candidat·e',
          professional: 'Professionnel·le créatif·ve',
          parent: 'Parent',
          other: 'Autre',
        },
        submit: "S'inscrire",
        sending: 'Envoi…',
        consent:
          "En vous inscrivant, vous acceptez de recevoir la newsletter du CAD. Vos données restent confidentielles, ne sont jamais cédées à des tiers, et vous pouvez vous désinscrire en un clic à tout moment.",
        success:
          'Merci ! Un email de confirmation vient de vous être envoyé. Cliquez sur le lien à l’intérieur pour finaliser votre inscription.',
        already: 'Vous êtes déjà inscrit·e à la newsletter. Merci !',
        error: 'Une erreur est survenue. Réessayez dans un instant.',
      }
    : {
        emailLabel: 'Your email',
        emailPlaceholder: 'you@example.com',
        profileLabel: 'You are…',
        profiles: {
          student: 'Student / Applicant',
          professional: 'Creative professional',
          parent: 'Parent',
          other: 'Other',
        },
        submit: 'Subscribe',
        sending: 'Sending…',
        consent:
          'By subscribing, you agree to receive the CAD newsletter. Your data stays private, is never shared with third parties, and you can unsubscribe in one click at any time.',
        success:
          'Thanks! A confirmation email has just been sent to you. Click the link inside to finalise your subscription.',
        already: 'You are already subscribed. Thank you!',
        error: 'Something went wrong. Please try again.',
      }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4"
      aria-label={isFR ? 'Inscription à la newsletter' : 'Newsletter signup'}
    >
      {/* Honeypot field — visually hidden from humans */}
      <input
        type="text"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        {...register('website')}
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
      />

      <label className="block">
        <span className="mb-1 block text-sm font-medium">{L.emailLabel}</span>
        <input
          type="email"
          required
          placeholder={L.emailPlaceholder}
          {...register('email', { required: true })}
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
          autoComplete="email"
        />
        {errors.email && (
          <span className="mt-1 block text-xs text-red-600">
            {isFR ? 'Email requis' : 'Email required'}
          </span>
        )}
      </label>

      {variant === 'full' && (
        <label className="block">
          <span className="mb-1 block text-sm font-medium">{L.profileLabel}</span>
          <select
            {...register('profile', { required: true })}
            className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
          >
            <option value="other">{L.profiles.other}</option>
            <option value="student">{L.profiles.student}</option>
            <option value="professional">{L.profiles.professional}</option>
            <option value="parent">{L.profiles.parent}</option>
          </select>
        </label>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:bg-accent disabled:opacity-60"
      >
        {status === 'sending' ? L.sending : L.submit}
      </button>

      {variant === 'full' && (
        <p className="text-xs text-ink/50">{L.consent}</p>
      )}

      {status === 'success' && (
        <p className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          {L.success}
        </p>
      )}
      {status === 'already' && (
        <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          {L.already}
        </p>
      )}
      {status === 'error' && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {L.error}
        </p>
      )}
    </form>
  )
}
