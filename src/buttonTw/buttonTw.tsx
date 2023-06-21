import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/classnames';

type ButtonTwVariantsProps = VariantProps<typeof buttonVariants>;
const buttonVariants = cva(
    // Base style for all button variants
    cn([
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded',
        'drop-shadow-md',
        'text-sm',
        'font-medium',
        'transition-colors',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'ring-offset-background',
        'disabled:bg-disabled',
        'disabled:text-disabled-foreground',
        'disabled:pointer-events-none',
        'disabled:select-none',
    ]),
    {
        variants: {
            /**
             * The variant a button can have.
             */
            variant: {
                primary: [
                    'bg-primary',
                    'text-primary-foreground',
                    'hover:bg-primary-dark',
                    'hover:text-primary-dark-foreground',
                ],
                secondary: [
                    'bg-secondary',
                    'text-secondary-foreground',
                    'hover:bg-secondary-dark',
                    'hover:text-secondary-dark-foreground',
                ],
                error: ['bg-error', 'text-error-foreground', 'hover:bg-error-dark', 'hover:text-error-dark-foreground'],
                warning: [
                    'bg-warning',
                    'text-warning-foreground',
                    'hover:bg-warning-dark',
                    'hover:text-warning-dark-foreground',
                ],
                info: ['bg-info', 'text-info-foreground', 'hover:bg-info-dark', 'hover:text-info-dark-foreground'],
                success: [
                    'bg-success',
                    'text-success-foreground',
                    'hover:bg-success-dark',
                    'hover:text-success-dark-foreground',
                ],
            },
            /**
             * The size a button can have.
             */
            size: {
                sm: 'h-8 px-2.5 py-1',
                md: 'h-9 px-4 py-1.5',
                lg: 'h-10 px-6 py-2',
            },
        },

        defaultVariants: {
            variant: null,
            size: null,
        },
    }
);

export interface ButtonTwProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonTwVariantsProps {
    /**
     * If true, renders a `Slot` component instead of a `button` element. A `Slot` component merges its props onto its
     * immediate child. If the child has event handlers the child handlers take precedence.
     */
    asChild?: boolean;
}

const ButtonTw = forwardRef<HTMLButtonElement, ButtonTwProps>(
    ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
ButtonTw.displayName = 'ButtonTw';

export { ButtonTw };
