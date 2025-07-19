import { useEffect, useRef } from 'react'

export const useAnimateOnScroll = (animationClass) => {
    const elementRef = useRef(null)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(animationClass)
                    }
                })
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        )

        observer.observe(element)

        return () => {
            observer.unobserve(element)
        }
    }, [animationClass])

    return elementRef
}