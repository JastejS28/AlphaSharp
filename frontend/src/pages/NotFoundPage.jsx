import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-400">404</h1>
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-gray-400">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 px-6 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
