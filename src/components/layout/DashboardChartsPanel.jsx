import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

const CHART_CONFIGS = [
    {
        id: 'queries',
        title: 'Lượng Truy Vấn RAG',
        description: 'Số câu hỏi người dùng gửi tới hệ thống RAG theo thời gian.',
        type: 'area',
        dataKey: 'queries',
        color: '#6366f1',
        gradientId: 'queriesGradient',
    },
    {
        id: 'visits',
        title: 'Lượng Truy Cập',
        description: 'Số phiên đăng nhập / truy cập hệ thống theo thời gian.',
        type: 'area',
        dataKey: 'visits',
        color: '#8b5cf6',
        gradientId: 'visitsGradient',
    },
    {
        id: 'users',
        title: 'Lượng Người Dùng',
        description: 'Số tài khoản người dùng được tạo mới theo thời gian.',
        type: 'bar',
        dataKey: 'users',
        color: '#3b82f6',
    },
    {
        id: 'uploads',
        title: 'Lượng File Upload',
        description: 'Số tài liệu được tải lên hệ thống theo thời gian.',
        type: 'bar',
        dataKey: 'uploads',
        color: '#10b981',
    },
]

function SingleAreaChart({ data, cfg }) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id={cfg.gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={cfg.color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={cfg.color} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
                    cursor={{ stroke: cfg.color, strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                    type="monotone"
                    dataKey={cfg.dataKey}
                    stroke={cfg.color}
                    strokeWidth={2.5}
                    fill={`url(#${cfg.gradientId})`}
                    dot={{ fill: cfg.color, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

function SingleBarChart({ data, cfg }) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
                    cursor={{ fill: `${cfg.color}18` }}
                />
                <Bar dataKey={cfg.dataKey} fill={cfg.color} radius={[5, 5, 0, 0]} maxBarSize={40} />
            </BarChart>
        </ResponsiveContainer>
    )
}

function ChartCard({ cfg, data }) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
            <div className="mb-4">
                <h3 className="font-['Manrope'] text-base font-extrabold text-slate-900">{cfg.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{cfg.description}</p>
            </div>
            {cfg.type === 'area' ? (
                <SingleAreaChart data={data} cfg={cfg} />
            ) : (
                <SingleBarChart data={data} cfg={cfg} />
            )}
        </div>
    )
}

function CombinedLineChart({ data }) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
            <div className="mb-4">
                <h3 className="font-['Manrope'] text-base font-extrabold text-slate-900">Tổng Quan Hoạt Động</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                    So sánh truy vấn, truy cập, người dùng và file upload trên cùng một trục thời gian.
                </p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                        contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="queries" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Truy vấn" />
                    <Line type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Truy cập" />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Người dùng" />
                    <Line type="monotone" dataKey="uploads" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="File upload" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

function DashboardChartsPanel({ data = [], isLoading = false }) {
    if (isLoading) {
        return (
            <section className="space-y-5">
                <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-80 w-full animate-pulse rounded-2xl bg-slate-100" />
                <div className="grid gap-5 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-64 w-full animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                </div>
            </section>
        )
    }
    if (!data || data.length === 0) {
        return (
            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Thống Kê Theo Thời Gian</h2>
                <p className="mt-1 text-sm text-slate-600">Chưa có dữ liệu để hiển thị trong kỳ này.</p>
            </section>
        )
    }

    return (
        <section className="space-y-5">
            <div>
                <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Thống Kê Theo Thời Gian</h2>
                <p className="mt-1 text-sm text-slate-600">
                    Phân tích chi tiết từng chỉ số hoạt động trong kỳ được chọn.
                </p>
            </div>

            {/* Combined overview line chart */}
            <CombinedLineChart data={data} />

            {/* Individual metric charts — 2 columns */}
            <div className="grid gap-5 md:grid-cols-2">
                {CHART_CONFIGS.map((cfg) => (
                    <ChartCard key={cfg.id} cfg={cfg} data={data} />
                ))}
            </div>
        </section>
    )
}

export default DashboardChartsPanel
