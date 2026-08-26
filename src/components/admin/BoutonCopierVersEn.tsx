'use client'

import { useState } from 'react'
import { useDocumentInfo, useLocale } from '@payloadcms/ui'

/**
 * Bouton « Copier le français vers l'anglais », posé en tête des
 * documents traduisibles.
 *
 * Ne s'affiche que sur l'onglet anglais : c'est le seul moment où le
 * geste a un sens, et l'afficher en français inviterait à écraser la
 * langue source par erreur.
 *
 * Il ne remplit que les champs vides, jamais ceux déjà rédigés. Le
 * message de retour dit combien de champs ont été remplis, pour que
 * l'éditeur sache s'il doit relire beaucoup ou pas du tout.
 */
export function BoutonCopierVersEn() {
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const locale = useLocale()
  const [etat, setEtat] = useState<'repos' | 'encours' | 'fini' | 'erreur'>('repos')
  const [message, setMessage] = useState<string>('')

  const codeLangue = typeof locale === 'string' ? locale : locale?.code
  if (codeLangue !== 'en') return null

  // Un document jamais enregistré n'a pas d'identifiant : il n'y a rien
  // à lire côté français.
  if (!globalSlug && !id) return null

  async function copier() {
    setEtat('encours')
    setMessage('')
    try {
      const reponse = await fetch('/api/copier-vers-en', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(
          globalSlug ? { global: globalSlug } : { collection: collectionSlug, id },
        ),
      })
      const donnees = await reponse.json()

      if (!reponse.ok) {
        setEtat('erreur')
        setMessage(donnees?.erreur ?? 'La copie a échoué.')
        return
      }

      if (donnees.remplis === 0) {
        setEtat('fini')
        setMessage('Rien à copier : tous les champs anglais sont déjà remplis.')
        return
      }

      setEtat('fini')
      setMessage(
        `${donnees.remplis} champ${donnees.remplis > 1 ? 's' : ''} rempli${
          donnees.remplis > 1 ? 's' : ''
        } depuis le français. Rechargement…`,
      )
      // Rechargement : le formulaire affiché ne connaît pas les valeurs
      // que le serveur vient d'écrire.
      setTimeout(() => window.location.reload(), 900)
    } catch {
      setEtat('erreur')
      setMessage('La copie a échoué. Réessayez.')
    }
  }

  return (
    <div
      style={{
        margin: '0 0 1.5rem',
        padding: '0.75rem 1rem',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <button
        type="button"
        onClick={copier}
        disabled={etat === 'encours'}
        className="btn btn--style-secondary btn--size-small"
        style={{ margin: 0 }}
      >
        {etat === 'encours' ? 'Copie en cours…' : 'Copier le français vers l’anglais'}
      </button>

      <span style={{ fontSize: '0.85rem', color: 'var(--theme-elevation-600)' }}>
        {message || 'Ne remplit que les champs vides. Ne remplace jamais un texte déjà saisi.'}
      </span>
    </div>
  )
}
