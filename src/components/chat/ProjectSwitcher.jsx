import { ChevronDown, Plus } from 'lucide-react'

function ProjectSwitcher({ projects, selectedProject, open, onToggle, onSelect, creating, name, setName, onCreate }) {
  return (
    <div className="space-y-2">
      <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Project</div>

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
      >
        <span className="grid h-7 w-7 place-items-center rounded-xl bg-slate-900 text-white">
          {selectedProject?.name ? selectedProject.name.charAt(0).toUpperCase() : 'P'}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{selectedProject?.name || 'Choose project'}</div>
        </div>
        <ChevronDown size={16} className={`${open ? 'rotate-180' : ''} shrink-0 transition`} />
      </button>

      {open && (
        <div className="space-y-2 pl-2">
          <div className="max-h-44 space-y-1 overflow-y-auto pr-1">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onSelect(project)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${selectedProject && selectedProject.id === project.id ? 'bg-slate-950 font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span className={`grid h-7 w-7 place-items-center rounded-xl ${selectedProject && selectedProject.id === project.id ? 'bg-white/12 text-white' : 'bg-slate-900 text-white'}`}>
                    {project.name ? project.name.charAt(0).toUpperCase() : 'P'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{project.name}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-slate-600">No projects yet</div>
            )}
          </div>

          <div className="flex gap-2 px-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="New project name"
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
            />
            <button
              type="button"
              onClick={onCreate}
              disabled={creating}
              className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm disabled:opacity-60"
              title="New project"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectSwitcher