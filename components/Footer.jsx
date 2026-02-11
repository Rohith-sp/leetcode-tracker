export function Footer() {
    return (
        <footer className="sticky bottom-0 z-40 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} LeetCode Tracker.
                </p>
                <div className="text-sm text-muted-foreground">
                    Built for <span className="font-semibold text-foreground">Discipline</span>.
                </div>
            </div>
        </footer>
    )
}
