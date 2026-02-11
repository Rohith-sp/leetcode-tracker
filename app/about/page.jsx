import { Brain, ListPlus, Star, BarChart3, CheckCircle2 } from 'lucide-react'

export const metadata = {
    title: 'About | LeetCode Tracker',
    description: 'Learn how LeetCode Tracker uses spaced repetition to help you master algorithms.',
}

export default function AboutPage() {
    return (
        <div className="container py-12 max-w-4xl mx-auto space-y-16">
            <section className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Master Algorithms, Don't Just Solve Them
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    A specialized Spaced Repetition System (SRS) designed to help developers build lasting intuition for complex patterns.
                </p>
            </section>

            <div className="grid md:grid-cols-2 gap-12 items-center">
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <Brain className="w-6 h-6 text-primary" />
                        The Core Philosophy
                    </h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            Solving a problem once doesn't mean you've mastered it. Research shows we forget nearly <span className="text-foreground font-semibold">80% of new information</span> within a week if it's not reinforced.
                        </p>
                        <p>
                            Our system combats the "Forgetting Curve" by forcing you to document your <span className="text-foreground font-medium italic">Key Insights</span> and scheduling reviews exactly when your memory starts to fade.
                        </p>
                    </div>
                </section>

                <section className="bg-muted/30 p-8 rounded-2xl border border-border/50">
                    <h2 className="text-2xl font-semibold mb-6">How to Use</h2>
                    <div className="space-y-6">
                        {[
                            {
                                icon: <ListPlus className="w-5 h-5" />,
                                title: "1. Log a Problem",
                                desc: "Include your approach and that 'Aha!' moment. Mandatory reflection ensures deep learning."
                            },
                            {
                                icon: <Star className="w-5 h-5" />,
                                title: "2. Rate Confidence",
                                desc: "Be honest. A score of 1-5 determines when you'll see the problem again."
                            },
                            {
                                icon: <BarChart3 className="w-5 h-5" />,
                                title: "3. Check Dashboard",
                                desc: "Your personal 'Due Soon' queue surfaces exactly what you need to review today."
                            },
                            {
                                icon: <CheckCircle2 className="w-5 h-5" />,
                                title: "4. Master Patterns",
                                desc: "Rinse and repeat until the algorithm becomes second nature."
                            }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary h-fit">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <section className="pt-12 border-t text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                    Built for developers who care about efficiency. Powered by <span className="text-foreground font-medium">Next.js</span>, <span className="text-foreground font-medium">Tailwind CSS</span>, and <span className="text-foreground font-medium">Supabase</span>.
                </p>
            </section>
        </div>
    )
}
