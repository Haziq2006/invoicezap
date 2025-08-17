import { Skeleton } from 'lucide-react'

interface SkeletonProps {
  type?: 'card' | 'list' | 'table' | 'form' | 'dashboard'
  count?: number
  className?: string
}

export default function LoadingSkeleton({ type = 'card', count = 1, className = '' }: SkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Hero Section Skeleton */}
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-8 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="h-8 bg-gray-400 rounded w-64"></div>
                  <div className="h-6 bg-gray-400 rounded w-96"></div>
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-400 rounded w-24"></div>
                    <div className="h-4 bg-gray-400 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-12 bg-gray-400 rounded-lg w-40"></div>
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                      <div className="h-8 bg-gray-300 rounded w-24"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="h-6 bg-gray-300 rounded w-32 mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 bg-gray-100 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-48"></div>
                          </div>
                          <div className="h-6 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="h-6 bg-gray-300 rounded w-24 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 bg-gray-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        <div className="space-y-1 flex-1">
                          <div className="h-3 bg-gray-300 rounded w-20"></div>
                          <div className="h-2 bg-gray-300 rounded w-32"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'table':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Table Header Skeleton */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-300 rounded w-32"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
            </div>

            {/* Table Body Skeleton */}
            <div className="divide-y divide-gray-200">
              {[...Array(count)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                      <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'form':
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
            <div className="h-6 bg-gray-300 rounded w-48"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-12 bg-gray-300 rounded-lg"></div>
                </div>
              ))}
            </div>
            <div className="flex space-x-4 pt-4">
              <div className="h-12 bg-gray-300 rounded-lg w-24"></div>
              <div className="h-12 bg-gray-300 rounded-lg w-32"></div>
            </div>
          </div>
        )

      case 'list':
        return (
          <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-300 rounded w-32"></div>
                      <div className="h-4 bg-gray-300 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      default: // card
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="flex justify-between items-center pt-4">
                <div className="h-8 bg-gray-300 rounded w-20"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={className}>
      {type === 'dashboard' ? renderSkeleton() : 
        [...Array(count)].map((_, i) => (
          <div key={i} className={count > 1 ? 'mb-4' : ''}>
            {renderSkeleton()}
          </div>
        ))
      }
    </div>
  )
}
