import ThemeToggle from "../ThemeToggle";
import { Menu } from "lucide-react";

export default function AdminNavbar(){

    return(

        <div className="navbar bg-base-100 border-b border-base-300">

            <div className="flex-none lg:hidden">

                <label
                    htmlFor="admin-drawer"
                    className="btn btn-square btn-ghost"
                >
                    <Menu/>
                </label>

            </div>

           <h1
            className="flex-1 text-[20px] sm:text-2xl text-primary truncate"
            style={{ fontFamily: "var(--font-serif-elegant)" }}
          >
             ADMIN BOARD
          </h1>
            <div className="flex items-center gap-3">

                <ThemeToggle/>

            </div>

        </div>

    )

}