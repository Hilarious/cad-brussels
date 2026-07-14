'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type Intent = 'brochure' | 'visit' | 'apply'

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  intents: Intent[]
  desiredSection: string
  profile: 'student' | 'parent' | 'professional' | 'other'
  message?: string
  acceptedTerms: boolean
  website?: string // honeypot
}

const SECTIONS_FR: Array<{ value: string; label: string; group: string }> = [
  { group: 'Bachelor', value: 'bachelor-interior', label: 'Architecture d’intérieur' },
  { group: 'Bachelor', value: 'bachelor-communication', label: 'Communication & Digital' },
  { group: 'Bachelor', value: 'bachelor-fashion', label: 'Mode & Accessoires' },
  { group: 'Master', value: 'master-interior', label: 'Architecture d’intérieur (2 ans)' },
  { group: 'Master', value: 'master-home-living', label: 'Home & Living' },
  { group: 'Master', value: 'master-digital-brand', label: 'Digital Brand Content' },
  { group: 'Master', value: 'master-image', label: 'Image, 3D, Motion, IA' },
  { group: 'Master', value: 'master-event', label: 'Event Management' },
  { group: 'Lifelong Learning', value: 'lifelong-genai', label: 'IA générative pour pros' },
  { group: 'Autre', value: 'undecided', label: 'Pas encore décidé·e' },
]

const SECTIONS_EN: Array<{ value: string; label: string; group: string }> = [
  { group: 'Bachelor', value: 'bachelor-interior', label: 'Interior Architecture' },
  { group: 'Bachelor', value: 'bachelor-communication', label: 'Communication & Digital' },
  { group: 'Bachelor', value: 'bachelor-fashion', label: 'Fashion & Accessory' },
  { group: 'Master', value: 'master-interior', label: 'Interior Architecture (2 yrs)' },
  { group: 'Master', value: 'master-home-living', label: 'Home & Living' },
  { group: 'Master', value: 'master-digital-brand', label: 'Digital Brand Content' },
  { group: 'Master', value: 'master-image', label: 'Image, 3D, Motion, AI' },
  { group: 'Master', value: 'master-event', label: 'Event Management' },
  { group: 'Lifelong Learning', value: 'lifelong-genai', label: 'Generative AI for pros' },
  { group: 'Other', value: 'undecided', label: 'Not decided yet' },
]

export function LeadForm({ locale }: { locale: string }) {
  const isFR = locale === 'fr'
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle',
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      intents: [],
      profile: 'student',
      desiredSection: '',
    },
  })

  const intents = watch('intents') ?? []

  async function onSubmit(values: FormValues) {
    setStatus('sending')
    try {
      const res = await fetch('/api/leads/submit', {
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

  const L = isFR
    ? {
        intentsTitle: 'Je souhaite…',
        intents: {
          brochure: 'Recevoir la brochure',
          visit: 'Visiter le CAD',
          apply: 'Candidater',
        },
        sectionTitle: 'Section qui m’intéresse',
        sectionPlaceholder: 'Choisir une section…',
        contactTitle: 'Mes coordonnées',
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        phone: 'Téléphone (optionnel)',
        profile: 'Je suis…',
        profiles: {
          student: 'Étudiant·e / Candidat·e',
          parent: 'Parent',
          professional: 'Professionnel·le',
          other: 'Autre',
        },
        messageLabel: 'Message (optionnel)',
        messagePlaceholder:
          'Une question particulière, un sujet à aborder, votre profil…',
        consent:
          'En soumettant ce formulaire, j’accepte que le CAD conserve ces informations pour un maximum de 2 ans afin de me recontacter. Mes données ne sont jamais cédées à des tiers.',
        submit: 'Envoyer ma demande',
        sending: 'Envoi…',
        success:
          'Merci ! Votre demande a bien été reçue. Le secrétariat vous recontactera sous 48 heures ouvrées.',
        error: 'Une erreur est survenue. Réessayez dans un instant.',
        intentsRequired: 'Choisissez au moins une intention',
        sectionRequired: 'Choisissez une section',
        consentRequired: 'Vous devez accepter pour envoyer le formulaire',
      }
    : {
        intentsTitle: 'I would like to…',
        intents: {
          brochure: 'Receive the brochure',
          visit: 'Visit the CAD',
          apply: 'Apply',
        },
        sectionTitle: 'Section I’m interested in',
        sectionPlaceholder: 'Choose a section…',
        contactTitle: 'My details',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone (optional)',
        profile: 'I am…',
        profiles: {
          student: 'Student / Applicant',
          parent: 'Parent',
          professional: 'Professional',
          other: 'Other',
        },
        messageLabel: 'Message (optional)',
        messagePlaceholder:
          'A specific question, a topic to discuss, your background…',
        consent:
          'By submitting this form, I agree CAD may keep this data for a maximum of 2 years in order to get back to me. My data is never shared with third parties.',
        submit: 'Send my request',
        sending: 'Sending…',
        success:
          'Thanks! We have received your request. The secretariat will reply within 2 working days.',
        error: 'Something went wrong. Please try again.',
        intentsRequired: 'Pick at least one intent',
        sectionRequired: 'Pick a section',
        consentRequired: 'You must accept to submit the form',
      }

  const sections = isFR ? SECTIONS_FR : SECTIONS_EN

  // Group sections for the <select>
  const grouped = sections.reduce<Record<string, typeof sections>>((acc, s) => {
    acc[s.group] = acc[s.group] ?? []
    acc[s.group].push(s)
    return acc
  }, {})

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900">
        <p className="font-display text-xl">
          {isFR ? '✓ Demande reçue' : '✓ Request received'}
        </p>
        <p className="mt-3 text-sm">{L.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Honeypot */}
      <input
        type="text"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        {...register('website')}
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
      />

      {/* Intents */}
      <fieldset>
        <legend className="text-sm font-medium uppercase tracking-widest text-ink/50">
          {L.intentsTitle}
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(Object.keys(L.intents) as Intent[]).map((value) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${
                intents.includes(value)
                  ? 'border-accent bg-accent/5'
                  : 'border-ink/15 hover:border-ink/40'
              }`}
            >
              <input
                type="checkbox"
                value={value}
                {...register('intents', {
                  validate: (v) =>
                    (v && v.length > 0) || L.intentsRequired,
                })}
                className="h-4 w-4 accent-accent"
              />
              <span>{L.intents[value]}</span>
            </label>
          ))}
        </div>
        {errors.intents && (
          <p className="mt-2 text-xs text-red-600">{errors.intents.message}</p>
        )}
      </fieldset>

      {/* Desired section */}
      <label className="block">
        <span className="text-sm font-medium uppercase tracking-widest text-ink/50">
          {L.sectionTitle}
        </span>
        <select
          {...register('desiredSection', { required: L.sectionRequired })}
          className="mt-3 w-full rounded-md border border-ink/20 bg-white px-3 py-3 outline-none focus:border-accent"
          defaultValue=""
        >
          <option value="" disabled>
            {L.sectionPlaceholder}
          </option>
          {Object.entries(grouped).map(([group, items]) => (
            <optgroup key={group} label={group === 'Autre' || group === 'Other' ? '' : group}>
              {items.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {errors.desiredSection && (
          <p className="mt-2 text-xs text-red-600">
            {errors.desiredSection.message}
          </p>
        )}
      </label>

      {/* Contact */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium uppercase tracking-widest text-ink/50">
          {L.contactTitle}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm">{L.firstName}</span>
            <input
              type="text"
              {...register('firstName', { required: true })}
              autoComplete="given-name"
              className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm">{L.lastName}</span>
            <input
              type="text"
              {...register('lastName', { required: true })}
              autoComplete="family-name"
              className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm">{L.email}</span>
            <input
              type="email"
              {...register('email', { required: true })}
              autoComplete="email"
              className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm">{L.phone}</span>
            <input
              type="tel"
              {...register('phone')}
              autoComplete="tel"
              className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm">{L.profile}</span>
          <select
            {...register('profile')}
            className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
          >
            <option value="student">{L.profiles.student}</option>
            <option value="parent">{L.profiles.parent}</option>
            <option value="professional">{L.profiles.professional}</option>
            <option value="other">{L.profiles.other}</option>
          </select>
        </label>
      </fieldset>

      {/* Message */}
      <label className="block">
        <span className="mb-1 block text-sm font-medium uppercase tracking-widest text-ink/50">
          {L.messageLabel}
        </span>
        <textarea
          rows={4}
          {...register('message')}
          placeholder={L.messagePlaceholder}
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none focus:border-accent"
        />
      </label>

      {/* Consent */}
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          {...register('acceptedTerms', { required: L.consentRequired })}
          className="mt-1 h-4 w-4 accent-accent"
        />
        <span className="text-ink/70">{L.consent}</span>
      </label>
      {errors.acceptedTerms && (
        <p className="-mt-4 text-xs text-red-600">
          {errors.acceptedTerms.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-full bg-ink px-8 py-4 text-sm text-paper transition hover:bg-accent disabled:opacity-60"
      >
        {status === 'sending' ? L.sending : L.submit}
      </button>

      {status === 'error' && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {L.error}
        </p>
      )}
    </form>
  )
}
