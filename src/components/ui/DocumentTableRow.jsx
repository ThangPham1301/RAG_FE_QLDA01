function DocumentTableRow({ icon, title, fileInfo, category, modified, status, actions }) {
    const statusColors = {
        INDEXED: 'bg-emerald-100 text-emerald-700',
        PROCESSING: 'bg-amber-100 text-amber-700',
        SYNCED: 'bg-blue-100 text-blue-700',
    }

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-700">
                        {icon}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                        <p className="text-xs text-slate-500">{fileInfo}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <span className="text-sm text-slate-600">{category}</span>
            </td>
            <td className="px-4 py-3">
                <span className="text-sm text-slate-600">{modified}</span>
            </td>
            <td className="px-4 py-3">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[status] || 'bg-slate-100 text-slate-600'}`}>
                    {status}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            </td>
        </tr>
    )
}

export default DocumentTableRow
