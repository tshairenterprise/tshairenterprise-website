import * as React from "react"
import * as SoonerPrimitives from "@radix-ui/react-toast"
import { cva } from "class-variance-authority"
import { X, CheckCircle2, AlertTriangle, Info, MessageSquareQuote, Loader2, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"

const SoonerProvider = SoonerPrimitives.Provider

const soonerVariants = cva(
    // Base Styling: Modern Glassmorphism with enhanced shadow and border effects
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl p-6 shadow-3xl backdrop-blur-md transition-all duration-300 " +
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    {
        variants: {
            variant: {
                // Default (Info)
                default:
                    "border border-blue-200/50 dark:border-slate-700 bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-slate-900/95 dark:to-slate-800/95 text-gray-800 dark:text-slate-200 shadow-blue-500/15",

                // Destructive (Error)
                destructive:
                    "border border-red-300/60 dark:border-red-900/50 bg-gradient-to-br from-red-100/95 to-orange-50/95 dark:from-slate-900/95 dark:to-red-950/80 text-red-800 dark:text-red-400 shadow-red-500/25",

                // Success
                success:
                    "border border-green-300/60 dark:border-green-900/50 bg-gradient-to-br from-green-50/95 to-teal-50/95 dark:from-slate-900/95 dark:to-green-950/80 text-green-800 dark:text-green-400 shadow-green-500/25",

                // Quote (Primary/Brand)
                quote:
                    "border border-primary/50 dark:border-primary/70 bg-gradient-to-br from-primary to-purple-700 dark:from-primary/90 dark:to-purple-800 text-white shadow-primary/40",

                // Loading
                loading:
                    "border border-blue-300/60 dark:border-blue-900/50 bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-slate-900/95 dark:to-blue-950/80 text-blue-700 dark:text-blue-400 shadow-blue-500/15 animate-pulse-light",

                // Interactive (for Delete Confirmation & general actions)
                interactive:
                    "border-2 border-gray-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 text-gray-900 dark:text-white shadow-lg",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const SoonerAction = React.forwardRef(({ className, ...props }, ref) => (
    <SoonerPrimitives.Action
        ref={ref}
        className={cn(
            "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border bg-transparent px-4 text-sm font-semibold transition-colors duration-200",
            "hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            className
        )}
        {...props}
    />
))
SoonerAction.displayName = SoonerPrimitives.Action.displayName

const SoonerClose = React.forwardRef(({ className, ...props }, ref) => (
    <SoonerPrimitives.Close
        ref={ref}
        className={cn(
            "absolute right-3 top-3 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none",
            "group-[.group]:text-gray-500 dark:group-[.group]:text-slate-400 group-[.group]:hover:text-gray-900 dark:group-[.group]:hover:text-white",
            "group-[.quote]:text-white/80 group-[.quote]:hover:text-white",
            className
        )}
        sooner-close=""
        {...props}
    >
        <X className="h-4 w-4" />
    </SoonerPrimitives.Close>
))
SoonerClose.displayName = SoonerPrimitives.Close.displayName

const SoonerTitle = React.forwardRef(({ className, ...props }, ref) => (
    <SoonerPrimitives.Title
        ref={ref}
        className={cn("text-xl font-extrabold tracking-tight [&+div]:text-sm", className)}
        {...props}
    />
))
SoonerTitle.displayName = SoonerPrimitives.Title.displayName

const SoonerDescription = React.forwardRef(({ className, ...props }, ref) => (
    <SoonerPrimitives.Description
        ref={ref}
        className={cn("text-sm opacity-90 leading-relaxed", className)}
        {...props}
    />
))
SoonerDescription.displayName = SoonerPrimitives.Description.displayName


const SoonerIcon = ({ variant }) => {
    const baseClasses = "h-7 w-7 shrink-0";

    switch (variant) {
        case 'success':
            return <CheckCircle2 className={cn(baseClasses, "text-green-600 dark:text-green-400")} />;
        case 'destructive':
            return <AlertTriangle className={cn(baseClasses, "text-red-600 dark:text-red-400")} />;
        case 'quote':
            return <MessageSquareQuote className={cn(baseClasses, "text-white")} />;
        case 'loading':
            return <Loader2 className={cn(baseClasses, "text-blue-600 dark:text-blue-400 animate-spin")} />;
        case 'interactive':
            return <Trash2 className={cn(baseClasses, "text-red-500 dark:text-red-400")} />;
        default:
            return <Info className={cn(baseClasses, "text-gray-600 dark:text-gray-400")} />;
    }
}

const SoonerRoot = React.forwardRef(({ className, variant, title, description, action, close, ...props }, ref) => {
    const isInteractive = variant === 'interactive';

    return (
        <SoonerPrimitives.Root
            ref={ref}
            className={cn(soonerVariants({ variant }), className)}
            {...props}
        >
            {/* --- Main Content Area (Layout Handler) --- */}
            <div className={cn('flex items-start gap-4 flex-1',
                isInteractive && 'flex-col gap-2 w-full')}> {/* CRITICAL: Force vertical stack for interactive */}

                <SoonerIcon variant={variant} />

                {/* Text and Action Wrapper */}
                <div className={cn('grid gap-1 flex-1', isInteractive && 'w-full')}>
                    {title && <SoonerTitle>{title}</SoonerTitle>}
                    {description && <SoonerDescription>{description}</SoonerDescription>}

                    {/* Action Buttons for Interactive Variant (placed below description) */}
                    {isInteractive && action && (
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full border-t border-gray-200/50 dark:border-slate-800/50">
                            {action} {/* This renders the buttons passed in the action prop */}
                        </div>
                    )}
                </div>
            </div>

            {/* Close Button */}
            {close && <SoonerClose />}

            {/* Standard Action prop (Only for non-interactive/UNDO buttons on the side) */}
            {!isInteractive && action}

        </SoonerPrimitives.Root>
    )
})
SoonerRoot.displayName = "SoonerRoot"


export {
    SoonerProvider,
    SoonerAction,
    SoonerClose,
    SoonerTitle,
    SoonerDescription,
    SoonerRoot,
    soonerVariants,
}