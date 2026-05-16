import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function DashboardChartsPanel({ data = [] }) {
    if (!data || data.length === 0) {
        return (
            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Activity Over Time</h2>
                <p className="mt-1 text-sm text-slate-600">Chưa có dữ liệu để hiển thị.</p>
            </section>
        )
    }

    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="space-y-6">
                <div>
                    <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Activity Over Time</h2>
                    <p className="mt-1 text-sm text-slate-600">Số lượng người dùng, lượt truy cập và truy vấn theo thời gian.</p>
                </div>

                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="queries" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    )
}

export default DashboardChartsPanel
