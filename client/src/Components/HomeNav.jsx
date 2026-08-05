import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const HomeNav = () => {
  return (
    <nav className="navbar bg-base-100 border-b border-base-300 shadow-sm px-6 fixed top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-4xl text-primary flex font-bold gap-3">
            <BookOpen size={40} />
            Journex
          </h1>

          <div className="flex">
            <Link
              to="/login"
              className="btn btn-primary m-2"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary m-2"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNav;