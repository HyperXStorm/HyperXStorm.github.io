import { useEffect, useState } from "react";
import { format } from "date-fns";
import { LogOut, Users, Leaf, Flame, Mountain, Wind, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ELEMENTS } from "@/lib/quizData";
import { ADMIN } from "@/constants/testIds";
import { toast } from "sonner";

const elementIcons = {
  wood: Leaf,
  fire: Flame,
  earth: Mountain,
  metal: Wind,
  water: Waves,
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/quiz/submissions"), api.get("/quiz/stats")])
      .then(([s, st]) => {
        setRows(s.data);
        setStats(st.data);
      })
      .catch((err) => toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FDFCFA] px-6 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs tracking-[0.25em] uppercase text-[#8A7965] font-bold mb-2">
              Clinic Dashboard
            </div>
            <h1 className="font-serif-display text-4xl sm:text-5xl text-[#243021] font-medium tracking-tight">
              Quiz submissions
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            data-testid={ADMIN.logoutBtn}
            variant="outline"
            className="rounded-full border-[#E2DFD8] hover:bg-[#EFE9E1] text-[#4A4846]"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-[#E2DFD8]/60 p-6 col-span-2 md:col-span-1">
            <Users className="w-5 h-5 text-[#3E533B] mb-3" />
            <div className="text-3xl font-serif-display text-[#243021]">
              {stats?.total ?? "—"}
            </div>
            <div className="text-xs tracking-[0.18em] uppercase text-[#8A7965] mt-1">
              Total leads
            </div>
          </div>
          {Object.values(ELEMENTS).map((el) => {
            const Icon = elementIcons[el.key];
            const v = stats?.by_element?.[el.key] ?? 0;
            return (
              <div
                key={el.key}
                className="bg-white rounded-2xl border border-[#E2DFD8]/60 p-6"
              >
                <div
                  className="w-9 h-9 rounded-full grid place-items-center mb-3"
                  style={{ background: el.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: el.accent }} />
                </div>
                <div className="text-2xl font-serif-display text-[#243021]">{v}</div>
                <div className="text-xs tracking-[0.18em] uppercase text-[#8A7965] mt-1">
                  {el.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E2DFD8]/60 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F7F5F0]">
                  <TableHead className="text-[#243021] font-medium">Name</TableHead>
                  <TableHead className="text-[#243021] font-medium">Email</TableHead>
                  <TableHead className="text-[#243021] font-medium">Element</TableHead>
                  <TableHead className="text-[#243021] font-medium">Age</TableHead>
                  <TableHead className="text-[#243021] font-medium">Gender</TableHead>
                  <TableHead className="text-[#243021] font-medium">Location</TableHead>
                  <TableHead className="text-[#243021] font-medium">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-[#8A7965]">
                      Loading submissions…
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-[#8A7965]">
                      No submissions yet — share the quiz with prospective clients.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => {
                    const el = ELEMENTS[r.dominant_element];
                    return (
                      <TableRow key={r.id} data-testid={ADMIN.tableRow(r.id)} className="hover:bg-[#F7F5F0]/60">
                        <TableCell className="font-medium text-[#243021]">{r.name}</TableCell>
                        <TableCell className="text-[#4A4846]">{r.email}</TableCell>
                        <TableCell>
                          <span
                            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                            style={{ background: el?.bg, color: el?.accent }}
                          >
                            {el?.chinese} {el?.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-[#4A4846]">{r.age ?? "—"}</TableCell>
                        <TableCell className="text-[#4A4846] capitalize">{r.gender ?? "—"}</TableCell>
                        <TableCell className="text-[#4A4846]">{r.location ?? "—"}</TableCell>
                        <TableCell className="text-[#6A6865] text-sm">
                          {r.created_at ? format(new Date(r.created_at), "MMM d, yyyy · h:mm a") : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
