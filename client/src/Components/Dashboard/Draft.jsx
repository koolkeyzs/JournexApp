import { Link } from "react-router-dom";
import { PenSquare, ArrowRight } from "lucide-react";

const ContinueDraft = ({ hasDraft }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-r from-purple-100 to-purple-50 min-h-[180px] flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-purple-600 text-white p-2 rounded-lg">
          <PenSquare size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-600">Continue writing your</p>
          <h2 className="text-xl font-bold text-gray-800">Today's Reflection</h2>
        </div>
      </div>

      {hasDraft ? (
        <>
          <p className="text-purple-600 text-sm mb-4">You have a draft in progress</p>
          <Link
            to="/journal/draft"
            className="inline-flex items-center gap-2 bg-purple-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-purple-700 transition w-fit"
          >
            Continue Draft <ArrowRight size={16} />
          </Link>
        </>
      ) : (
        <Link
          to="/entries"
          className="inline-flex items-center gap-2 bg-purple-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-purple-700 transition w-fit mt-2"
        >
          Start Writing <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
};

export default ContinueDraft;