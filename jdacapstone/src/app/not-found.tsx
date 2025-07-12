import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-green-600">404</h1>
          <div className="text-6xl mb-4">🌱</div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Oops! This page got composted
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Just like food waste, this page seems to have disappeared. 
          But don't worry, we can help you find what you're looking for!
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Home
          </Link>
          
          <div className="block">
            <Link 
              href="/products"
              className="text-green-600 hover:text-green-800 underline"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}