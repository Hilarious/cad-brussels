/**
 * `pnpm verify` — vérification autonome, de bout en bout.
 *
 * Lance le site, l'ouvre dans un vrai navigateur, le mesure, l'arrête.
 * Aucune action manuelle, aucune question posée.
 *
 * Réutilise un serveur déjà lancé sur :3000 s'il en trouve un (plus rapide en
 * développement), sinon en démarre un et le tue à la fin.
 */
import { spawn } from 'node:child_process'

const URL = 'http://localhost:3000'

async function isUp() {
  try {
    const res = await fetch(`${URL}/fr`, { signal: AbortSignal.timeout(2000) })
    return res.status < 500
  } catch {
    return false
  }
}

async function waitUntilUp(timeoutMs) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (await isUp()) return true
    await new Promise((r) => setTimeout(r, 1000))
  }
  return false
}

function run(cmd, args) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: false })
    child.on('exit', (code) => resolve(code ?? 1))
  })
}

let server = null

if (await isUp()) {
  console.log('Serveur déjà lancé sur :3000, réutilisé.\n')
} else {
  console.log('Démarrage du site...')
  server = spawn('pnpm', ['dev'], { stdio: 'ignore', detached: false })
  // Démarrage à froid + première compilation : peut prendre une minute.
  if (!(await waitUntilUp(120_000))) {
    console.error('Le site n\'a pas démarré en 2 minutes. Vérification abandonnée.')
    server.kill('SIGTERM')
    process.exit(1)
  }
  console.log('Site démarré.\n')
}

const code = await run('node', ['scripts/verify-ui.mjs'])

if (server) {
  server.kill('SIGTERM')
  console.log('\nSite arrêté.')
}

process.exit(code)
