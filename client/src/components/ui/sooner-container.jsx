import { useSooner } from "./use-sooner.jsx" // ✅ Extension changed
import { SoonerRoot } from "./sooner"
import * as SoonerPrimitives from "@radix-ui/react-toast" // Viewport ke liye zaruri hai
import { cn } from "@/lib/utils"

export function SoonerContainer() {
    const { sooners } = useSooner()

    return (
        <SoonerPrimitives.Provider> {/* ✅ Radix Primitive Provider, as main provider wraps App in main.jsx */}
            {sooners.map(function ({ id, title, description, action, variant, duration, ...props }) {
                return (
                    <SoonerRoot
                        key={id}
                        variant={variant}
                        title={title}
                        description={description}
                        action={action}
                        close={variant !== 'loading'}
                        {...props}
                    />
                )
            })}
            {/* Viewport for positioning the sooners on the screen */}
            <SoonerPrimitives.Viewport className={cn(
                "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
            )} />
        </SoonerPrimitives.Provider>
    )
}