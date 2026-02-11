export const metadata = {
    title: 'About | LeetCode Tracker',
    description: 'About the project and its goals.',
}

export default function AboutPage() {
    return (
        <div className="container py-10 max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold tracking-tight">About LeetCode Tracker</h1>

            <section className="space-y-4 text-muted-foreground">
                <p>
                    This application was built to solve a simple problem: <span className="text-foreground font-medium">Solving problems doesn't mean you've learned them.</span>
                </p>
                <p>
                    Without a system for review, we forget 80% of what we learn within a week. This "Forgetting Curve" is the enemy of technical interviews.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">How It Works</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong className="text-foreground">Solve</strong> a problem on LeetCode.</li>
                    <li><strong className="text-foreground">Log</strong> it here with your honest confidence score.</li>
                    <li><strong className="text-foreground">Review</strong> it when the app tells you to (based on spaced repetition).</li>
                    <li><strong className="text-foreground">Master</strong> the pattern, not just the solution.</li>
                </ul>
            </section>

            <section className="pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                    Built with Next.js 16, Tailwind CSS, and Supabase.
                </p>
            </section>
        </div>
    )
}
