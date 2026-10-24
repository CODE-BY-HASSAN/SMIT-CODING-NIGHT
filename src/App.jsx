import {
  Bell,
  CalendarCheck,
  CalendarDays,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  Trash2,
  X,
  LogIn,
  LogOut as CheckOutIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const initialEmployees = [
  {
    id: 1,
    name: "Ali Khan",
    role: "HR Manager",
    dept: "Human Resources",
  },
  {
    id: 2,
    name: "Sara Ahmed",
    role: "Frontend Developer",
    dept: "IT",
  },
];

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Employees", icon: Users },
  { name: "Attendance", icon: CalendarCheck },
  { name: "Leave Management", icon: CalendarDays },
  { name: "Payroll", icon: Wallet },
  { name: "Settings", icon: Settings },
];

const todayKey = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getSavedData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
};

const formatTime = (time) =>
  time
    ? new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

export default function App() {
  const [employees, setEmployees] = useState(() =>
    getSavedData("hcm-lite-employees", initialEmployees)
  );

  const [attendance, setAttendance] = useState(() =>
    getSavedData("hcm-lite-attendance", [])
  );

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [form, setForm] = useState({
    name: "",
    role: "",
    dept: "",
  });

  useEffect(() => {
    localStorage.setItem("hcm-lite-employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("hcm-lite-attendance", JSON.stringify(attendance));
  }, [attendance]);

  const today = todayKey();

  const todayAttendance = attendance.filter(
    (record) => record.date === today
  );

  const presentCount = todayAttendance.length;
  const checkedOutCount = todayAttendance.filter(
    (record) => record.checkOut
  ).length;

  const lateCount = todayAttendance.filter(
    (record) => record.status === "Late"
  ).length;

  const onLeaveCount = todayAttendance.filter(
    (record) => record.status === "On Leave"
  ).length;

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.role} ${employee.dept}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getAttendance = (employeeId) =>
    todayAttendance.find(
      (record) => String(record.employeeId) === String(employeeId)
    );

  const handleAddEmployee = (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const role = form.role.trim();
    const dept = form.dept.trim();

    if (!name || !role || !dept) return;

    setEmployees((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
        role,
        dept,
      },
    ]);

    setForm({ name: "", role: "", dept: "" });
    setShowForm(false);
  };

  const handleDeleteEmployee = (id) => {
    if (!window.confirm("Kya tum is employee ko delete karna chahte ho?")) {
      return;
    }

    setEmployees((current) =>
      current.filter((employee) => employee.id !== id)
    );
  };

  const handleCheckIn = (employee) => {
    const existing = getAttendance(employee.id);

    if (existing) return;

    const now = new Date();
    const lateLimit = new Date(now);
    lateLimit.setHours(9, 15, 0, 0);

    const newRecord = {
      id: crypto.randomUUID(),
      employeeId: employee.id,
      employeeName: employee.name,
      date: today,
      checkIn: now.toISOString(),
      checkOut: null,
      status: now > lateLimit ? "Late" : "Present",
    };

    setAttendance((current) => [...current, newRecord]);
  };

  const handleCheckOut = (employee) => {
    const existing = getAttendance(employee.id);

    if (!existing || existing.checkOut) return;

    setAttendance((current) =>
      current.map((record) =>
        record.id === existing.id
          ? { ...record, checkOut: new Date().toISOString() }
          : record
      )
    );
  };

  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: Users,
      change: "Registered",
    },
    {
      title: "Checked In Today",
      value: presentCount,
      icon: UserCheck,
      change: "Today",
    },
    {
      title: "On Leave",
      value: onLeaveCount,
      icon: CalendarDays,
      change: "Today",
    },
    {
      title: "Late Arrivals",
      value: lateCount,
      icon: Clock,
      change: "Today",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#020617] text-white md:flex">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#07111f] p-5 md:flex md:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500 p-2 text-slate-950">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">HCM Lite</h1>
              <p className="text-xs text-slate-400">HR Management</p>
            </div>
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navItems.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setActivePage(name)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  activePage === name
                    ? "bg-cyan-500/15 font-semibold text-cyan-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {name}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="font-semibold">HCM Lite</p>
            <p className="mt-1 text-xs text-slate-400">
              HR management workspace
            </p>
          </div>

          <button className="mt-5 flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-red-400">
            <LogOut size={18} /> Sign Out
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#020617]/90 px-5 py-4 backdrop-blur-xl sm:px-8">
            <div className="flex items-center gap-3">
              <button className="md:hidden">
                <Menu />
              </button>
              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  {activePage}
                </h2>
                <p className="text-xs text-slate-400">
                  HCM Lite · Admin workspace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 sm:flex">
                <Search size={17} className="text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search employees..."
                  className="w-36 bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 font-bold text-slate-950">
                A
              </div>
            </div>
          </header>

          <div className="space-y-7 p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold">
                  {activePage === "Dashboard"
                    ? "Company Overview"
                    : activePage}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {activePage === "Attendance"
                    ? "Employees ka check-in aur check-out manage karo."
                    : "Company ke employees aur records manage karo."}
                </p>
              </div>
              <span className="rounded-xl border border-white/10 bg-[#0b1729] px-4 py-2 text-sm text-slate-300">
                {today}
              </span>
            </div>

            {activePage === "Dashboard" && (
              <>
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map(({ title, value, icon: Icon, change }) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/10 bg-[#0b1729] p-5 transition hover:border-cyan-500/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                          <Icon size={22} />
                        </div>
                        <span className="text-xs text-slate-400">
                          {change}
                        </span>
                      </div>
                      <p className="mt-5 text-sm text-slate-400">{title}</p>
                      <h3 className="mt-1 text-3xl font-bold">{value}</h3>
                    </div>
                  ))}
                </section>

                <section className="grid gap-5 xl:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#0b1729] p-6 xl:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">Weekly Overview</h3>
                        <p className="mt-1 text-sm text-slate-400">
                          Illustrative activity chart
                        </p>
                      </div>
                      <TrendingUp className="text-cyan-400" />
                    </div>

                    <div className="mt-8 flex h-40 items-end justify-around gap-3">
                      {[72, 88, 65, 95, 78, 55, 85].map((height, index) => (
                        <div
                          key={index}
                          className="flex h-full flex-1 flex-col justify-end gap-2"
                        >
                          <div
                            style={{ height: `${height}%` }}
                            className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-400 opacity-90"
                          />
                          <span className="text-center text-xs text-slate-500">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0b1729] p-6">
                    <h3 className="font-bold">Today's Attendance</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Based on recorded check-ins
                    </p>

                    <div className="my-7 flex justify-center">
                      <div className="flex h-36 w-36 items-center justify-center rounded-full border-[14px] border-cyan-400">
                        <div className="text-center">
                          <p className="text-3xl font-bold">
                            {employees.length
                              ? Math.round(
                                  (presentCount / employees.length) * 100
                                )
                              : 0}
                            %
                          </p>
                          <p className="text-xs text-slate-400">Checked in</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Checked In</span>
                        <span>{presentCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Checked Out</span>
                        <span>{checkedOutCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Late</span>
                        <span>{lateCount}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {(activePage === "Dashboard" ||
              activePage === "Employees" ||
              activePage === "Attendance") && (
              <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1729]">
                <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <h3 className="font-bold">
                      {activePage === "Attendance"
                        ? "Attendance Register"
                        : "Employee Directory"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {activePage === "Attendance"
                        ? "Aaj ke check-in aur check-out records"
                        : "Employees add, search aur manage karo"}
                    </p>
                  </div>

                  {activePage !== "Attendance" && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                    >
                      + Add Employee
                    </button>
                  )}
                </div>

                <div className="border-y border-white/10 px-5 py-3 sm:hidden">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <Search size={17} className="text-slate-400" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search employees..."
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="border-y border-white/10 bg-white/[0.03] text-slate-400">
                      <tr>
                        <th className="px-5 py-4 font-medium">Employee</th>
                        <th className="px-5 py-4 font-medium">Department</th>
                        <th className="px-5 py-4 font-medium">Position</th>
                        <th className="px-5 py-4 font-medium">Check In</th>
                        <th className="px-5 py-4 font-medium">Check Out</th>
                        <th className="px-5 py-4 font-medium">Status</th>
                        <th className="px-5 py-4 font-medium">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEmployees.map((employee) => {
                        const record = getAttendance(employee.id);

                        return (
                          <tr
                            key={employee.id}
                            className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                          >
                            <td className="px-5 py-4 font-medium">
                              {employee.name}
                            </td>
                            <td className="px-5 py-4 text-slate-400">
                              {employee.dept}
                            </td>
                            <td className="px-5 py-4 text-slate-400">
                              {employee.role}
                            </td>
                            <td className="px-5 py-4 text-slate-300">
                              {formatTime(record?.checkIn)}
                            </td>
                            <td className="px-5 py-4 text-slate-300">
                              {formatTime(record?.checkOut)}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs ${
                                  record?.status === "Late"
                                    ? "bg-amber-500/10 text-amber-400"
                                    : record
                                      ? "bg-emerald-500/10 text-emerald-400"
                                      : "bg-slate-500/10 text-slate-400"
                                }`}
                              >
                                {record?.status || "Not Checked In"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                {!record ? (
                                  <button
                                    onClick={() => handleCheckIn(employee)}
                                    className="flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
                                  >
                                    <LogIn size={14} />
                                    Check In
                                  </button>
                                ) : !record.checkOut ? (
                                  <button
                                    onClick={() => handleCheckOut(employee)}
                                    className="flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300"
                                  >
                                    <CheckOutIcon size={14} />
                                    Check Out
                                  </button>
                                ) : (
                                  <span className="text-xs text-emerald-400">
                                    Completed
                                  </span>
                                )}

                                {activePage !== "Attendance" && (
                                  <button
                                    onClick={() =>
                                      handleDeleteEmployee(employee.id)
                                    }
                                    title="Delete employee"
                                    className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredEmployees.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-5 py-10 text-center text-slate-400"
                          >
                            Koi employee nahi mila.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-white/10 px-5 py-3 text-xs text-slate-500">
                  Total employees: {employees.length}
                </div>
              </section>
            )}

            {!["Dashboard", "Employees", "Attendance"].includes(activePage) && (
              <section className="rounded-2xl border border-white/10 bg-[#0b1729] p-8 text-center">
                <Settings size={36} className="mx-auto text-cyan-400" />
                <h3 className="mt-4 text-xl font-bold">{activePage}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Ye module abhi tayyar nahi hua. Isay aglay step mein banayenge.
                </p>
              </section>
            )}

            <p className="pb-2 text-center text-xs text-slate-600">
              HCM Lite · Attendance and employee management
            </p>
          </div>
        </main>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleAddEmployee}
            className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-[#0b1729] p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Employee</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <input
              required
              maxLength={80}
              placeholder="Employee Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            />

            <input
              required
              maxLength={80}
              placeholder="Job Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            />

            <input
              required
              maxLength={80}
              placeholder="Department"
              value={form.dept}
              onChange={(e) => setForm({ ...form, dept: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            />

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-cyan-400 py-3 font-semibold text-[#020617] hover:bg-cyan-300"
              >
                Save Employee
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ name: "", role: "", dept: "" });
                }}
                className="flex-1 rounded-lg border border-white/20 py-3 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
