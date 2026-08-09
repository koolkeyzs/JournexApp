import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import AdminNavbar from "../Components/admin/AdminNav";
import AdminSidebar from "../Components/admin/AdminSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const USERS_PER_PAGE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users);
    } catch {
      toast.error("Failed to load users");
    }
  }

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="drawer lg:drawer-open bg-base-200">

      <input
        id="admin-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content flex flex-col">

        <AdminNavbar />

        <main className="p-4 sm:p-6">

          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Users ({users.length})
          </h1>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Entries</th>
                  <th>Comments</th>
                  <th>Joined</th>
                  <th>Likes</th>
                  <th>Public</th>
                  <th>Private</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-sm ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.entryCount}</td>
                    <td>{user.commentCount}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.likeCount}</td>
                    <td>{user.publicEntries}</td>
                    <td>{user.privateEntries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {paginatedUsers.map((user) => (
              <div key={user._id} className="bg-base-100 border border-base-300 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-base-content">{user.username}</p>
                  <span className={`badge badge-sm ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>
                    {user.role}
                  </span>
                </div>

                <p className="text-xs text-base-content/60 mb-3">{user.email}</p>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-base-content">{user.entryCount}</p>
                    <p className="text-[10px] text-base-content/50 uppercase">Entries</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-base-content">{user.commentCount}</p>
                    <p className="text-[10px] text-base-content/50 uppercase">Comments</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-base-content">{user.likeCount}</p>
                    <p className="text-[10px] text-base-content/50 uppercase">Likes</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center mt-2 pt-2 border-t border-base-300">
                  <div>
                    <p className="text-sm font-semibold text-base-content">{user.publicEntries}</p>
                    <p className="text-[10px] text-base-content/50 uppercase">Public</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-base-content">{user.privateEntries}</p>
                    <p className="text-[10px] text-base-content/50 uppercase">Private</p>
                  </div>
                </div>

                <p className="text-[10px] text-base-content/40 mt-3 text-right">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-sm btn-ghost disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-sm text-base-content/70">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-sm btn-ghost disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </main>

      </div>

      <AdminSidebar />

    </div>
  );
}