import avatarProfile from '../assets/dashboard/avatar-profile.png'
import AdminUserManagementPanel from '../components/layout/AdminUserManagementPanel'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'
import { useAppSettings } from '../context/AppSettingsContext'

function UserManagementPage() {
  const { t } = useAppSettings()

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <ArchiveSidebar activeItem="User Management" ctaLabel="NEW RESEARCH" />

        <div className="flex min-h-screen flex-1 flex-col">
          <WorkspaceTopBar
            profileName="Dr. Aris Thorne"
            profileRole="Lead Researcher"
            avatarSrc={avatarProfile}
          />

          <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-5">
              <div>
                <h1 className="font-['Manrope'] text-4xl font-extrabold text-slate-900">
                  {t.adminUsers.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                  {t.adminUsers.subtitle}
                </p>
              </div>

              <AdminUserManagementPanel />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default UserManagementPage
