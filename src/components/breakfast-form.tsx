'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  partySize: number
  preferredDate: string
  // What kind of visitor are you? Helps the team prepare.
  profile: 'student' | 'parent' | 'professional' | 'other'
  question?: string
  acceptedTerms: boolean
  website?: string // honeypot
}

export function BreakfastForm({ locale }: { locale: string }) {
  const isFR = locale === 'fr'
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle',
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { partySize: 1, profile: 'student' },
  })

  async function onSubmit(values: FormValues) {
    setStatus('sending')
    try {
      // We piggy-back on the leads endpoint with a "breakfast" intent so
      // the secretariat sees these in the same CRM view.
      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone || null,
          intents: ['visit'], // Breakfast counts as a visit
          desiredSection: 'undecided',
          profile: values.profile,
          message: [
            isFR ? 'Inscription Summer Breakfast' : 'Summer Breakfast booking',
            `${isFR ? 'Date souhaitée' : 'Preferred date'}: ${values.preferredDate}`,
            `${isFR ? 'Nombre de personnes' : 'Party size'}: ${values.partySize}`,
            values.question
              ? `${isFR ? 'Question' : 'Question'}: ${values.question}`
              : '',
          ]
            .filter(Boolean)
            .join('\n'),
          acceptedTerms: values.acceptedTerms,
          locale,
          website: values.website,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const T = isFR
    ? {
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        phone: 'Téléphone (facultatif)',
        partySize: 'Vous venez à combien ?',
        partySizeHelp: 'Vous pouvez venir avec un parent, un·e ami·e.',
        preferredDate: 'Mercredi souhaité',
        preferredDateHelp:
          'Choisissez un mercredi entre le 2 juillet et le 10 septembre.',
        profile: 'Vous êtes',
        profileOptions: [
          { value: 'student', label: 'Futur·e étudiant·e' },
          { value: 'parent', label: 'Parent / accompagnant·e' },
          { value: 'professional', label: 'Professionnel·le' },
          { value: 'other', label: 'Autre' },
        ],
        question: 'Une question particulière ? (facultatif)',
        questionHelp:
          'Une filière à explorer, un sujet à creuser, un projet à présenter ? On briefe l’équipe.',
        accept:
          'J’accepte que mes données soient utilisées par CAD Brussels pour gérer cette inscription, conformément à la politique de confidentialité.',
        submit: 'Réserver mon Breakfast',
        sending: 'Envoi en cours…',
        success: 'C’est noté.',
        successBody:
          'On vous écrit dans la journée pour confirmer le mercredi et vous donner les détails pratiques (entrée, parking, allergies). À très vite.',
        error:
          'Une erreur est survenue. Réessayez ou écrivez à secretariat@cad.be.',
      }
    : {
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone (optional)',
        partySize: 'How many of you?',
        partySizeHelp: 'You can come with a parent or a friend.',
        preferredDate: 'Preferred Wednesday',
        preferredDateHelp:
          'Pick a Wednesday between July 2 and September 10.',
        profile: 'You are',
        profileOptions: [
          { value: 'student', label: 'Future student' },
          { value: 'parent', label: 'Parent / companion' },
          { value: 'professional', label: 'Professional' },
          { value: 'other', label: 'Other' },
        ],
        question: 'Any specific question? (optional)',
        questionHelp:
          'A program to explore, a topic to dig into, a project to show? We brief the team.',
        accept:
          'I agree that my data is used by CAD Brussels to handle this booking, in accordance with the privacy policy.',
        submit: 'Book my Breakfast',
        sending: 'Sending…',
        success: 'Got it.',
        successBody:
          'We write back during the day to confirm the date and share practical details (entrance, parking, allergies). See you very soon.',
        error: 'Something went wrong. Try again or write to secretariat@cad.be.',
      }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8">
        <p className="font-display text-3xl">{T.success}</p>
        <p className="mt-3 text-ink/70">{T.successBody}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <input
        type="text"
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0"
        aria-hidden="true"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={T.firstName} error={errors.firstName?.message}>
          <input
            {...register('firstName', { required: true })}
            className={INPUT}
            autoComplete="given-name"
          />
        </Field>
        <Field label={T.lastName} error={errors.lastName?.message}>
          <input
            {...register('lastName', { required: true })}
            className={INPUT}
            autoComplete="family-name"
          />
        </Field>
        <Field label={T.email} error={errors.email?.message}>
          <input
            type="email"
            {...register('email', { required: true })}
            className={INPUT}
            autoComplete="email"
          />
        </Field>
        <Field label={T.phone}>
          <input
            type="tel"
            {...register('phone')}
            className={INPUT}
            autoComplete="tel"
          />
        </Field>
      </div>

      <Field label={T.profile}>
        <select {...register('profile')} className={INPUT}>
          {T.profileOptions.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={T.preferredDate} help={T.preferredDateHelp}>
          <input
            type="date"
            {...register('preferredDate', { required: true })}
            min="2026-07-01"
            max="2026-09-10"
            className={INPUT}
          />
        </Field>
        <Field label={T.partySize} help={T.partySizeHelp}>
          <input
            type="number"
            min={1}
            max={5}
            {...register('partySize', {
              required: true,
              valueAsNumber: true,
              min: 1,
              max: 5,
            })}
            className={INPUT}
          />
        </Field>
      </div>

      <Field label={T.question} help={T.questionHelp}>
        <textarea rows={4} {...register('question')} className={INPUT} />
      </Field>

      <label className="flex items-start gap-3 text-sm text-ink/80">
        <input
          type="checkbox"
          {...register('acceptedTerms', { required: true })}
          className="mt-1 h-4 w-4 shrink-0 accent-accent"
        />
        <span>{T.accept}</span>
      </label>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-accent disabled:opacity-60"
        >
          {status === 'sending' ? T.sending : T.submit}
        </button>
        {status === 'error' && (
          <p className="text-sm text-red-700">{T.error}</p>
        )}
      </div>
    </form>
  )
}

const INPUT =
  'w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent'

function Field({
  label,
  error,
  help,
  children,
}: {
  label: string
  error?: string
  help?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {help && !error && (
        <span className="mt-1 block text-xs text-ink/50">{help}</span>
      )}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
