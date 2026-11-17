import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  // Gesetzt von `next upgrade --agent=security`: der Befehl haelt hier
  // fest, dass Sicherheits-Updates dieser App von einem Agenten
  // eingespielt werden duerfen.
  experimental: {agentUpgrade: 'security'},
  cacheComponents: true,
  partialPrefetching: true,
  // Ohne das sucht Turbopack die Projektwurzel ueber dieses Verzeichnis
  // hinaus und findet eine fremde package-lock.json im Home-Verzeichnis.
  turbopack: {root: import.meta.dirname},
}

export default nextConfig
