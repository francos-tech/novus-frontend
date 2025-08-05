import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar para o Dashboard por padrão
    router.replace('/dashboard')
  }, [router])

  return null
}