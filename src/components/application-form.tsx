'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  nationality: string

  street?: string
  postalCode?: string
  city?: string
  country?: string

  desiredProgram: string
  startYear: '2026' | '2027'
  startLevel: 'bac1' | 'bac2' | 'bac3' | 'm1' | 'm2'

  currentSchool?: string
  lastDiploma?: string
  lastDiplomaYear?: number

  motivation: string
  portfolioUrl?: string

  source?: string

  acceptedTerms: boolean

  // honeypot
  website?: string
}

export function ApplicationForm({ locale }: { locale: string }) {
  const isFR = locale === 'fr'
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle',
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      startYear: '2026',
      startLevel: 'bac1',
    },
  })

  async function onSubmit(values: FormValues) {
    setStatus('sending')
    try {
      const res = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          locale,
          // Coerce empty strings to null for optionals
          street: values.street || null,
          postalCode: values.postalCode || null,
          city: values.city || null,
          country: values.country || null,
          currentSchool: values.currentSchool || null,
          lastDiploma: values.lastDiploma || null,
          lastDiplomaYear: values.lastDiplomaYear
            ? Number(values.lastDiplomaYear)
            : null,
          portfolioUrl: values.portfolioUrl || null,
          source: values.source || null,
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
        // Section titles
        s1: 'Vous',
        s2: 'Votre adresse',
        s3: 'Programme visé',
        s4: 'Parcours scolaire',
        s5: 'Motivation',
        s6: 'Comment nous avez-vous connus ?',
        s7: 'Consentement',
        // Field labels
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        birthDate: 'Date de naissance',
        nationality: 'Nationalité',
        street: 'Rue et numéro',
        postalCode: 'Code postal',
        city: 'Ville',
        country: 'Pays',
        program: 'Programme',
        startYear: 'Rentrée',
        startLevel: 'Année visée',
        currentSchool: 'École / établissement actuel (facultatif)',
        lastDiploma: 'Dernier diplôme (facultatif)',
        lastDiplomaYear: 'Année du diplôme',
        motivation: 'Pourquoi le CAD ? Pourquoi ce programme ?',
        motivationHelp:
          '5 à 10 lignes suffisent. Pas besoin de tout structurer, on cherche votre voix.',
        portfolioUrl: 'Lien vers votre portfolio (facultatif)',
        portfolioHelp:
          'Behance, Instagram, site perso, dossier Drive… Si vous n’en avez pas encore, ce n’est pas bloquant.',
        source: 'Comment avez-vous connu le CAD ?',
        acceptTerms:
          'J’accepte que mes données soient utilisées par CAD Brussels pour traiter ma candidature, conformément à la politique de confidentialité.',
        submit: 'Envoyer ma candidature',
        sending: 'Envoi en cours…',
        success:
          'Merci, votre candidature est bien reçue. Nous vous écrivons sous 48h pour la suite.',
        error:
          'Une erreur est survenue. Veuillez réessayer ou nous écrire à admissions@cad.be.',
        // Selects
        programs: [
          { value: 'bachelor-interior', label: 'Bachelor · Architecture d’intérieur' },
          { value: 'bachelor-communication', label: 'Bachelor · Communication & Digital' },
          { value: 'bachelor-fashion', label: 'Bachelor · Mode & Accessoires' },
          { value: 'master-interior', label: 'Master · Architecture d’intérieur 2 ans' },
          { value: 'master-home-living', label: 'Master · Home & Living' },
          { value: 'master-digital-brand', label: 'Master · Digital Brand Content' },
          { value: 'master-image', label: 'Master · Image / 3D / Motion / IA' },
          { value: 'master-event', label: 'Master · Event Management' },
        ],
        levels: [
          { value: 'bac1', label: '1ère année (Bac1)' },
          { value: 'bac2', label: '2ème année (Bac2)' },
          { value: 'bac3', label: '3ème année (Bac3)' },
          { value: 'm1', label: 'Master 1' },
          { value: 'm2', label: 'Master 2' },
        ],
        sources: [
          { value: '', label: '— Choisir —' },
          { value: 'search', label: 'Recherche Google / IA' },
          { value: 'word-of-mouth', label: 'Recommandation (ami, famille)' },
          { value: 'social', label: 'Réseaux sociaux' },
          { value: 'event', label: 'Open Day / Salon' },
          { value: 'press', label: 'Presse / article' },
          { value: 'alumni', label: 'Ancien étudiant' },
          { value: 'other', label: 'Autre' },
        ],
      }
    : {
        s1: 'About you',
        s2: 'Your address',
        s3: 'Desired program',
        s4: 'Academic background',
        s5: 'Motivation',
        s6: 'How did you hear about us?',
        s7: 'Consent',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone',
        birthDate: 'Date of birth',
        nationality: 'Nationality',
        street: 'Street and number',
        postalCode: 'Postal code',
        city: 'City',
        country: 'Country',
        program: 'Program',
        startYear: 'Intake',
        startLevel: 'Year',
        currentSchool: 'Current school (optional)',
        lastDiploma: 'Last diploma (optional)',
        lastDiplomaYear: 'Year of diploma',
        motivation: 'Why CAD? Why this program?',
        motivationHelp:
          'Five to ten lines are enough. No need to overthink it, we are looking for your voice.',
        portfolioUrl: 'Portfolio link (optional)',
        portfolioHelp:
          'Behance, Instagram, personal site, Drive folder… If you don’t have one yet, it’s not blocking.',
        source: 'How did you hear about CAD?',
        acceptTerms:
          'I agree that my data is used by CAD Brussels to process my application, in accordance with the privacy policy.',
        submit: 'Send my application',
        sending: 'Sending…',
        success:
          'Thank you, your application has been received. We will write back within 48h.',
        error:
          'Something went wrong. Please try again or write to admissions@cad.be.',
        programs: [
          { value: 'bachelor-interior', label: 'Bachelor · Interior Architecture' },
          { value: 'bachelor-communication', label: 'Bachelor · Communication & Digital' },
          { value: 'bachelor-fashion', label: 'Bachelor · Fashion & Accessory' },
          { value: 'master-interior', label: 'Master · Interior Architecture 2 years' },
          { value: 'master-home-living', label: 'Master · Home & Living' },
          { value: 'master-digital-brand', label: 'Master · Digital Brand Content' },
          { value: 'master-image', label: 'Master · Image / 3D / Motion / AI' },
          { value: 'master-event', label: 'Master · Event Management' },
        ],
        levels: [
          { value: 'bac1', label: 'Year 1 (Bac1)' },
          { value: 'bac2', label: 'Year 2 (Bac2)' },
          { value: 'bac3', label: 'Year 3 (Bac3)' },
          { value: 'm1', label: 'Master 1' },
          { value: 'm2', label: 'Master 2' },
        ],
        sources: [
          { value: '', label: '— Choose —' },
          { value: 'search', label: 'Google / AI search' },
          { value: 'word-of-mouth', label: 'Recommendation (friend, family)' },
          { value: 'social', label: 'Social media' },
          { value: 'event', label: 'Open Day / Fair' },
          { value: 'press', label: 'Press / article' },
          { value: 'alumni', label: 'Former student' },
          { value: 'other', label: 'Other' },
        ],
      }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8">
        <p className="font-display text-2xl">{T.success.split('.')[0]}.</p>
        <p className="mt-3 text-ink/70">
          {T.success.split('.').slice(1).join('.').trim()}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0"
        aria-hidden="true"
      />

      {/* Section 1 — Identity */}
      <fieldset>
        <legend className="font-display text-xl">{T.s1}</legend>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
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
          <Field label={T.phone} error={errors.phone?.message}>
            <input
              type="tel"
              {...register('phone', { required: true })}
              className={INPUT}
              autoComplete="tel"
            />
          </Field>
          <Field label={T.birthDate} error={errors.birthDate?.message}>
            <input
              type="date"
              {...register('birthDate', { required: true })}
              className={INPUT}
              autoComplete="bday"
            />
          </Field>
          <Field label={T.nationality} error={errors.nationality?.message}>
            <input
              {...register('nationality', { required: true })}
              className={INPUT}
            />
          </Field>
        </div>
      </fieldset>

      {/* Section 2 — Address */}
      <fieldset>
        <legend className="font-display text-xl">{T.s2}</legend>
        <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr_2fr]">
          <Field label={T.street}>
            <input
              {...register('street')}
              className={INPUT}
              autoComplete="street-address"
            />
          </Field>
          <Field label={T.postalCode}>
            <input
              {...register('postalCode')}
              className={INPUT}
              autoComplete="postal-code"
            />
          </Field>
          <Field label={T.city}>
            <input
              {...register('city')}
              className={INPUT}
              autoComplete="address-level2"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label={T.country}>
            <input
              {...register('country')}
              className={INPUT}
              autoComplete="country-name"
            />
          </Field>
        </div>
      </fieldset>

      {/* Section 3 — Program */}
      <fieldset>
        <legend className="font-display text-xl">{T.s3}</legend>
        <div className="mt-6 grid gap-4">
          <Field label={T.program} error={errors.desiredProgram?.message}>
            <select
              {...register('desiredProgram', { required: true })}
              className={INPUT}
              defaultValue=""
            >
              <option value="" disabled>
                {isFR ? '— Choisir un programme —' : '— Choose a program —'}
              </option>
              {T.programs.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={T.startYear}>
              <select {...register('startYear')} className={INPUT}>
                <option value="2026">2026-2027</option>
                <option value="2027">2027-2028</option>
              </select>
            </Field>
            <Field label={T.startLevel}>
              <select {...register('startLevel')} className={INPUT}>
                {T.levels.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </fieldset>

      {/* Section 4 — Academic */}
      <fieldset>
        <legend className="font-display text-xl">{T.s4}</legend>
        <div className="mt-6 grid gap-4">
          <Field label={T.currentSchool}>
            <input {...register('currentSchool')} className={INPUT} />
          </Field>
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <Field label={T.lastDiploma}>
              <input {...register('lastDiploma')} className={INPUT} />
            </Field>
            <Field label={T.lastDiplomaYear}>
              <input
                type="number"
                min={1990}
                max={2030}
                {...register('lastDiplomaYear', { valueAsNumber: true })}
                className={INPUT}
              />
            </Field>
          </div>
        </div>
      </fieldset>

      {/* Section 5 — Motivation */}
      <fieldset>
        <legend className="font-display text-xl">{T.s5}</legend>
        <div className="mt-6 space-y-4">
          <Field
            label={T.motivation}
            help={T.motivationHelp}
            error={errors.motivation?.message}
          >
            <textarea
              rows={6}
              {...register('motivation', { required: true, minLength: 20 })}
              className={INPUT}
            />
          </Field>
          <Field label={T.portfolioUrl} help={T.portfolioHelp}>
            <input
              type="url"
              placeholder="https://"
              {...register('portfolioUrl')}
              className={INPUT}
            />
          </Field>
        </div>
      </fieldset>

      {/* Section 6 — Source */}
      <fieldset>
        <legend className="font-display text-xl">{T.s6}</legend>
        <div className="mt-6">
          <Field label={T.source}>
            <select {...register('source')} className={INPUT}>
              {T.sources.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      {/* Section 7 — Consent */}
      <fieldset>
        <legend className="font-display text-xl">{T.s7}</legend>
        <label className="mt-6 flex items-start gap-3 text-sm text-ink/80">
          <input
            type="checkbox"
            {...register('acceptedTerms', { required: true })}
            className="mt-1 h-4 w-4 shrink-0 accent-accent"
          />
          <span>{T.acceptTerms}</span>
        </label>
        {errors.acceptedTerms && (
          <p className="mt-2 text-xs text-red-600">
            {isFR ? 'Requis pour envoyer.' : 'Required to submit.'}
          </p>
        )}
      </fieldset>

      {/* Submit */}
      <div className="flex flex-wrap items-center gap-4">
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
