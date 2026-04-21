function ConsentRow() {
  return (
    <label className="flex cursor-pointer items-start gap-3 pt-2">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-700"
      />
      <span className="text-xs leading-relaxed text-slate-600">
        I acknowledge the Terms of Synchronization and agree to the secure
        processing of metadata within the Cognitive Slate ecosystem.
      </span>
    </label>
  )
}

export default ConsentRow