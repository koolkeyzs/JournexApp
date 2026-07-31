import RecentEntryCard from "./RecentEntryCard";

const RecentEntries = ({ personalEntry }) => {
  const sortedEntries = [...(personalEntry || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const recentEntries = sortedEntries.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-semibold text-gray-800 mb-2">Recent Journal Entries</h2>

      {recentEntries.length > 0 ? (
        recentEntries.map((entry) => (
          <RecentEntryCard key={entry._id} entry={entry} />
        ))
      ) : (
        <p className="text-sm text-gray-500">No entries yet — write your first one!</p>
      )}
    </div>
  );
};

export default RecentEntries;