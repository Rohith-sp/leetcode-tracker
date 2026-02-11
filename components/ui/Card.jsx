import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
    "rounded-lg border transition-all duration-200 shadow-sm",
    {
        variants: {
            variant: {
                default: "bg-surface-1 border-border hover:border-border-strong hover:shadow-md",
                elevated: "bg-surface-2 border-border shadow-md",
                interactive: "bg-surface-1 border-border hover:bg-surface-2 hover:border-primary/30 hover:shadow-md active:scale-[0.99] cursor-pointer",
                focus: "bg-primary-muted border-2 border-primary shadow-md",
                subtle: "bg-muted border-border-subtle",
                ghost: "bg-transparent border-0 shadow-none",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const Card = React.forwardRef(({ className, variant, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        {...props}
    />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
