import { ArrowUpRight } from "lucide-react";

export default function StatCard({
    title,
    value,
    icon: Icon
}) {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">

            <div className="card-body">

                <div className="flex justify-between items-start">

                    <div>

                        <p className="text-sm text-base-content/70 font-medium">
                            {title}
                        </p>

                        <h2 className="text-4xl font-bold mt-2 text-base-content">
                            {value}
                        </h2>

                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                        <Icon
                            size={28}
                            className="text-primary"
                        />

                    </div>

                </div>

                <div className="divider my-2"></div>

                <div className="flex justify-between items-center">

                    <span className="text-xs text-base-content/60">

                        View Details

                    </span>

                    <ArrowUpRight
                        size={18}
                        className="text-primary"
                    />

                </div>

            </div>

        </div>
    );
}