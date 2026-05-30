/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AppSettingsContext = createContext(null)

const adminUserTranslations = {
  en: {
    title: 'User Management',
    subtitle: 'Manage accounts, roles, groups, permissions, password resets, and user activity logs.',
    panelDescription: 'View users, search accounts, lock or unlock access, reset passwords, assign roles and groups, and review logs.',
    tabs: { users: 'Users', groups: 'Groups', logs: 'Logs' },
    searchPlaceholder: 'Search email or name...',
    allRoles: 'All roles',
    allStatuses: 'All statuses',
    activeOnly: 'Active',
    lockedOnly: 'Locked',
    reload: 'Reload',
    columns: { user: 'User', role: 'Role', status: 'Status', groups: 'Groups', actions: 'Actions' },
    status: { active: 'Active', locked: 'Locked' },
    actions: {
      lock: 'Lock',
      unlock: 'Unlock',
      reset: 'Reset',
      log: 'Log',
      delete: 'Delete',
      edit: 'Edit',
      cancel: 'Cancel',
      saveGroup: 'Save Group',
      createGroup: 'Create Group',
    },
    groups: {
      titleCreate: 'Create Group',
      titleEdit: 'Edit Group',
      namePlaceholder: 'Group name',
      group: 'Group',
      users: 'Users',
      permissionsCount: 'permissions',
    },
    logs: {
      emptyTitle: 'Select a user and click Log to view activity.',
      empty: 'No logs to display.',
    },
    reset: {
      title: 'Reset Password',
      newPassword: 'New password',
      confirmPassword: 'Confirm new password',
      submit: 'Reset and sign out all sessions',
    },
    states: { loading: 'Loading...', emptyUsers: 'No matching users.' },
    messages: {
      usersLoadFailed: 'Could not load users',
      groupsLoadFailed: 'Could not load groups',
      logsLoadFailed: 'Could not load logs',
      actionFailed: 'Action failed',
      passwordReset: 'Password reset successfully',
      groupUpdated: 'Group updated',
      groupCreated: 'Group created',
      groupDeleted: 'Group deleted',
      roleUpdated: 'Role updated',
      groupsUpdated: 'Groups updated',
      accountLocked: 'Account locked',
        accountUnlocked: 'Account unlocked',
        userDeleted: 'User deleted',
        roleChangeConfirm: 'Change role for {email} to {role}?',
        lockConfirm: 'Lock account {email}?',
        unlockConfirm: 'Unlock account {email}?',
        resetPasswordConfirm: 'Reset password for {email}? All sessions will be signed out.',
        deleteUserConfirm: 'Delete account {email}? This cannot be undone.',
        deleteGroupConfirm: 'Delete group {name}?',
      },
  },
  vi: {
    title: 'Quản lý người dùng',
    subtitle: 'Quản lý tài khoản, vai trò, nhóm quyền, phân quyền chức năng, reset mật khẩu và log người dùng.',
    panelDescription: 'Xem danh sách, tìm kiếm, khóa hoặc mở tài khoản, reset mật khẩu, gán vai trò, gán nhóm và xem log người dùng.',
    tabs: { users: 'Người dùng', groups: 'Nhóm quyền', logs: 'Log' },
    searchPlaceholder: 'Tìm email hoặc tên...',
    allRoles: 'Tất cả vai trò',
    allStatuses: 'Tất cả trạng thái',
    activeOnly: 'Đang mở',
    lockedOnly: 'Đang khóa',
    reload: 'Tải lại',
    columns: { user: 'Người dùng', role: 'Vai trò', status: 'Trạng thái', groups: 'Nhóm', actions: 'Thao tác' },
    status: { active: 'Mở', locked: 'Khóa' },
    actions: {
      lock: 'Khóa',
      unlock: 'Mở',
      reset: 'Reset',
      log: 'Log',
      delete: 'Xóa',
      edit: 'Sửa',
      cancel: 'Hủy',
      saveGroup: 'Lưu nhóm',
      createGroup: 'Tạo nhóm',
    },
    groups: {
      titleCreate: 'Tạo nhóm',
      titleEdit: 'Sửa nhóm',
      namePlaceholder: 'Tên nhóm',
      group: 'Nhóm',
      users: 'Người dùng',
      permissionsCount: 'quyền',
    },
    logs: {
      emptyTitle: 'Chọn người dùng và bấm Log để xem hoạt động.',
      empty: 'Chưa có log để hiển thị.',
    },
    reset: {
      title: 'Reset mật khẩu',
      newPassword: 'Mật khẩu mới',
      confirmPassword: 'Nhập lại mật khẩu mới',
      submit: 'Reset và đăng xuất tất cả phiên',
    },
    states: { loading: 'Đang tải...', emptyUsers: 'Không có người dùng phù hợp.' },
    messages: {
      usersLoadFailed: 'Không thể tải danh sách người dùng',
      groupsLoadFailed: 'Không thể tải nhóm quyền',
      logsLoadFailed: 'Không thể tải log',
      actionFailed: 'Thao tác thất bại',
      passwordReset: 'Reset mật khẩu thành công',
      groupUpdated: 'Đã cập nhật nhóm',
      groupCreated: 'Đã tạo nhóm',
      groupDeleted: 'Đã xóa nhóm',
      roleUpdated: 'Đã cập nhật vai trò',
      groupsUpdated: 'Đã cập nhật nhóm',
      accountLocked: 'Đã khóa tài khoản',
        accountUnlocked: 'Đã mở tài khoản',
        userDeleted: 'Đã xóa người dùng',
        roleChangeConfirm: 'Đổi vai trò của {email} thành {role}?',
        lockConfirm: 'Khóa tài khoản {email}?',
        unlockConfirm: 'Mở tài khoản {email}?',
        resetPasswordConfirm: 'Reset mật khẩu cho {email}? Tất cả phiên đăng nhập sẽ bị đăng xuất.',
        deleteUserConfirm: 'Xóa tài khoản {email}? Thao tác này không thể hoàn tác.',
        deleteGroupConfirm: 'Xóa nhóm {name}?',
      },
  },
}

const translations = {
  en: {
    accountSettings: 'Account Settings',
    accountSettingsDescription: 'Manage your profile information and account security for the RAG workspace.',
    accountSecurity: 'Account Security',
    accountStatus: 'ACCOUNT STATUS',
    accountActive: 'Active',
    change: 'CHANGE',
    changePassword: 'Change Password',
    changePasswordDescription: 'Update the password used to sign in.',
    darkMode: 'Dark mode',
    emailAddress: 'EMAIL ADDRESS',
    emailPending: 'Email verification pending',
    emailVerification: 'Email Verification',
    emailVerificationDescriptionPending: 'Please verify your email before using the workspace.',
    emailVerificationDescriptionVerified: 'Your login email has been verified.',
    emailVerified: 'Email verified',
    language: 'Language',
    loggingOut: 'Logging out...',
    logout: 'Logout',
    profile: 'Profile',
    pending: 'PENDING',
    role: 'ROLE',
    roles: {
      user: 'User',
      admin: 'Admin',
      superadmin: 'Superadmin',
    },
    userProfile: 'User profile',
    verified: 'VERIFIED',
    nav: {
      dashboard: 'Dashboard',
      users: 'User Management',
      library: 'Library',
      chat: 'Chat',
      summarize: 'Summarize',
      statistics: 'Statistics',
      team: 'Team',
      users: 'Users',
      settings: 'Settings',
      profile: 'Profile',
    },
    adminUsers: adminUserTranslations.en,
  },
  vi: {
    accountSettings: 'Cài Đặt Tài Khoản',
    accountSettingsDescription: 'Quản lý thông tin cá nhân và bảo mật tài khoản trong hệ thống RAG.',
    accountSecurity: 'Bảo Mật Tài Khoản',
    accountStatus: 'TRẠNG THÁI TÀI KHOẢN',
    accountActive: 'Đang hoạt động',
    change: 'ĐỔI',
    changePassword: 'Đổi Mật Khẩu',
    changePasswordDescription: 'Cập nhật mật khẩu dùng để đăng nhập.',
    darkMode: 'Chế độ tối',
    emailAddress: 'EMAIL',
    emailPending: 'Email chưa xác thực',
    emailVerification: 'Xác Thực Email',
    emailVerificationDescriptionPending: 'Vui lòng xác thực email trước khi sử dụng hệ thống.',
    emailVerificationDescriptionVerified: 'Email đăng nhập của bạn đã được xác thực.',
    emailVerified: 'Email đã xác thực',
    language: 'Ngôn ngữ',
    loggingOut: 'Đang đăng xuất...',
    logout: 'Đăng xuất',
    profile: 'Hồ sơ',
    pending: 'CHƯA XÁC THỰC',
    role: 'VAI TRÒ',
    roles: {
      user: 'Người dùng',
      admin: 'Quản trị viên',
      superadmin: 'Quản trị viên cấp cao',
    },
    userProfile: 'Hồ sơ người dùng',
    verified: 'ĐÃ XÁC THỰC',
    nav: {
      dashboard: 'Tổng quan',
      users: 'Quản lý người dùng',
      library: 'Thư viện',
      chat: 'Chat',
      summarize: 'Tóm tắt',
      statistics: 'Thống kê',
      team: 'Nhóm',
      users: 'Người dùng',
      settings: 'Cài đặt',
      profile: 'Hồ sơ',
    },
    adminUsers: adminUserTranslations.vi,
  },
}

export function AppSettingsProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
  }, [darkMode])

  const value = useMemo(() => {
    const dictionary = translations[language] || translations.en

    return {
      darkMode,
      language,
      setDarkMode,
      setLanguage,
      t: dictionary,
    }
  }, [darkMode, language])

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext)
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider')
  }
  return context
}
