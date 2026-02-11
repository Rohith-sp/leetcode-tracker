import { AddProblemForm } from '@/components/AddProblemForm'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AddPage() {
    return (
        <div className="min-h-screen bg-background p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Add New Problem</h1>
            </div>

            <AddProblemForm />
        </div>
    )
}
