import { Link } from "react-router-dom";
import { Home, MessageSquare } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* 404 Text */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-base-content/60 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link to="/" className="btn btn-primary gap-2">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
