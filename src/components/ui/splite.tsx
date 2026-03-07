'use client'

import { Suspense, lazy } from 'react'
import { Plus } from 'lucide-react'

// Lazy load the heavy 3D Spline code
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
    scene: string
    className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
    return (
        <Suspense
            fallback={
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505]">
                    <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <span className="mt-4 text-indigo-400 font-mono text-sm tracking-widest animate-pulse">Initializing 3D Protocol...</span>
                </div>
            }
        >
            <Spline
                scene={scene}
                className={className}
            />
        </Suspense>
    )
}
