import { useEffect, useRef } from 'react'

export const useTiltEffect = () => {
    const elementRef = useRef(null)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const deltaX = (e.clientX - centerX) / (rect.width / 2)
            const deltaY = (e.clientY - centerY) / (rect.height / 2)

            const rotateX = deltaY * -10
            const rotateY = deltaX * 10

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
        }

        const handleMouseLeave = () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
        }

        element.addEventListener('mousemove', handleMouseMove)
        element.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            element.removeEventListener('mousemove', handleMouseMove)
            element.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    return elementRef
}