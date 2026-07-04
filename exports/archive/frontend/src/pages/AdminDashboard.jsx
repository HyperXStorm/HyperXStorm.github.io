import { useEffect, useState } from "react";
import { format } from "date-fns";
import { LogOut, Users, Leaf, Flame, Mountain, Wind, Waves, CalendarCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ELEMENTS } from "@/lib/quizData";
import { ADMIN } from "@/constants/testIds";
import { toast } from "sonner";

const elementIcons = {
  wood: Leaf, fire: Flame, earth: Mountain, metal: Wind, water: Waves,
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [appts, setAppts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/quiz/submissions"),
      api.get("/quiz/stats"),
      api.get("/appointments"),
    ])
      .then(([s, st, a]) => {
        setRows(s.data);
        setStats(st.data);
        setAppts(a.data);
      })
      .catch((err) => toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F5EDDF] px-6 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.28em] uppercase text-[#B68B47] font-semibold mb-2">
              Clinic Dashboard
            </div>
            <h1 className="font-serif-display text-4xl sm:text-5xl text-[#1F3A2E] font-medium tracking-tight">
              Leads &amp; Appointments
            </h1>
          </div>
          <Button onClick={handleLogout} data-testid={ADMIN.logoutBtn} variant="outline"
            className="rounded-full border-[#1F3A2E]/15 hover:bg-[#FBF6EC] text-[#1F3A2E]">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-10">
          <StatCard icon={Users} value={stats?.total ?? "—"} label="Quiz leads" />
          <StatCard icon={CalendarCheck} value={appts.length || "—"} label="Appointments" />
          {Object.values(ELEMENTS).map((el) => {
            const Icon = elementIcons[el.key];
            const v = stats?.by_element?.[el.key] ?? 0;
            return (
              <div key={el.key} className="bg-white rounded-2xl border border-[#1F3A2E]/8 p-6">
                <div className="w-9 h-9 rounded-full grid place-items-center mb-3" style={{ background: el.bg }}>
                  <Icon className="w-4 h-4" style={{ color: el.accent }} />
                </div>
                <div className="text-2xl font-serif-display text-[#1F3A2E]">{v}</div>
                <div className="text-xs tracking-[0.18em] uppercase text-[#7A6F62] mt-1">{el.name}</div>
              </div>
            );
          })}
        </div>

        <Tabs defaultValue="quiz" className="w-full">
          <TabsList className="bg-white border border-[#1F3A2E]/10 rounded-full p-1 mb-6">
            <TabsTrigger value="quiz" data-testid="tab-quiz-leads"
              className="rounded-full data-[state=active]:bg-[#1F3A2E] data-[state=active]:text-[#F5EDDF] px-6 py-2">
              Quiz Leads ({rows.length})
            </TabsTrigger>
            <TabsTrigger value="appts" data-testid="tab-appointments"
              className="rounded-full data-[state=active]:bg-[#1F3A2E] data-[state=active]:text-[#F5EDDF] px-6 py-2">
              Appointment Requests ({appts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quiz">
            <div className="bg-white rounded-2xl border border-[#1F3A2E]/8 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#FBF6EC]">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Element</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-12 text-[#7A6F62]">Loading…</TableCell></TableRow>
                    ) : rows.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-12 text-[#7A6F62]">No quiz leads yet.</TableCell></TableRow>
                    ) : rows.map((r) => {
                      const el = ELEMENTS[r.dominant_element];
                      return (
                        <TableRow key={r.id} data-testid={ADMIN.tableRow(r.id)} className="hover:bg-[#FBF6EC]/60">
                          <TableCell className="font-medium text-[#1F3A2E]">{r.name}</TableCell>
                          <TableCell>{r.email}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                              style={{ background: el?.bg, color: el?.accent }}>
                              {el?.chinese} {el?.name}
                            </span>
                          </TableCell>
                          <TableCell>{r.age ?? "—"}</TableCell>
                          <TableCell className="capitalize">{r.gender ?? "—"}</TableCell>
                          <TableCell>{r.location ?? "—"}</TableCell>
                          <TableCell className="text-[#7A6F62] text-sm">
                            {r.created_at ? format(new Date(r.created_at), "MMM d · h:mm a") : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appts">
            <div className="bg-white rounded-2xl border border-[#1F3A2E]/8 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#FBF6EC]">
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Preferred</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Requested</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-12 text-[#7A6F62]">Loading…</TableCell></TableRow>
                    ) : appts.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-12 text-[#7A6F62]">No appointment requests yet.</TableCell></TableRow>
                    ) : appts.map((a) => (
                      <TableRow key={a.id} data-testid={`appt-row-${a.id}`} className="hover:bg-[#FBF6EC]/60">
                        <TableCell className="font-medium text-[#1F3A2E]">{a.name}</TableCell>
                        <TableCell>
                          <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1.5 text-[#B68B47] hover:underline">
                            <Phone className="w-3.5 h-3.5" /> {a.phone}
                          </a>
                        </TableCell>
                        <TableCell>{a.email}</TableCell>
                        <TableCell className="max-w-[200px]">{a.service}</TableCell>
                        <TableCell className="text-sm">
                          {a.preferred_date || "—"}{a.preferred_time ? ` · ${a.preferred_time}` : ""}
                        </TableCell>
                        <TableCell className="max-w-[260px] text-sm text-[#4A4846] truncate">{a.message || "—"}</TableCell>
                        <TableCell className="text-[#7A6F62] text-sm">
                          {a.created_at ? format(new Date(a.created_at), "MMM d · h:mm a") : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl border border-[#1F3A2E]/8 p-6 col-span-2 md:col-span-1">
      <Icon className="w-5 h-5 text-[#B68B47] mb-3" />
      <div className="text-3xl font-serif-display text-[#1F3A2E]">{value}</div>
      <div className="text-xs tracking-[0.18em] uppercase text-[#7A6F62] mt-1">{label}</div>
    </div>
  );
}
