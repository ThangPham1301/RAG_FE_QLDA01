import avatarElias from '../../assets/chat/avatar-elias.png'

function ChatTopBar() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-[#f8f9ff]/80 px-6 backdrop-blur-md">
      <div className="flex h-12 w-full max-w-sm items-center gap-3 rounded-full bg-[#eff4ff] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
        <input
          type="text"
          placeholder="Search archive or chat history..."
          className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-slate-600">
          <span className="h-4 w-4 rounded-sm bg-slate-500" />
          <span className="h-4 w-4 rounded-sm bg-slate-500" />
        </div>
        <div className="h-8 w-px bg-slate-300" />
        <div className="flex items-center gap-3">
          <img src={avatarElias} alt="Dr. Elias Vance" className="h-9 w-9 rounded-full" />
          <span className="font-['Manrope'] text-sm font-semibold text-slate-900">
            Dr. Elias Vance
          </span>
        </div>
      </div>
    </header>
  )
}

export default ChatTopBar