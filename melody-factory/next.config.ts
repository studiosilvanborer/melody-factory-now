import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Ohne das sucht Turbopack die Projektwurzel ueber dieses Verzeichnis
  // hinaus und findet eine fremde package-lock.json im Home-Verzeichnis.
  turbopack: {root: import.meta.dirname},
}

export default nextConfig
