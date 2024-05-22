import { delay } from 'framer-motion'

export const staggerContainer = (variant?: string, delay: number =  0, stagger: number = 0.2) => ({
    initial: "hidden",
    animate: "visible",
    variants: variant === 'x'
        ? {
            hidden: {
                x: "-100vw",
            },
            visible: {
                x: 0,
                transition: {
                    delay,
                    when: "beforeChildren",
                    staggerChildren: stagger,
                },
            },
        }
        : {
            hidden: {
                y: "-100vh",
            },
            visible: {
                y: 0,
                transition: {
                    delay,
                    when: "beforeChildren",
                    staggerChildren: stagger,
                },
            },

        },
})

export const staggerItem = (variant?: string) => ({variants: variant === 'x' ? ({
    hidden: {
        x: -100,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
    },
}) : ({
    hidden: {
        y: -100,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
    },
})})