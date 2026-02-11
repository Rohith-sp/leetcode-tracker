'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.replace('/dashboard')
            } else {
                router.replace('/login')
            }
            setLoading(false)
        }
        checkUser()
    }, [router])

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>

    return null
}
