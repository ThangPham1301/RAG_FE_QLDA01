/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AppSettingsContext = createContext(null)

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
    userProfile: 'User profile',
    verified: 'VERIFIED',
    nav: {
      dashboard: 'Dashboard',
      library: 'Library',
      chat: 'Chat',
      summarize: 'Summarize',
      statistics: 'Statistics',
      team: 'Team',
      users: 'Users',
      settings: 'Settings',
      profile: 'Profile',
    },
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
    userProfile: 'Hồ sơ người dùng',
    verified: 'ĐÃ XÁC THỰC',
    nav: {
      dashboard: 'Tổng quan',
      library: 'Thư viện',
      chat: 'Chat',
      summarize: 'Tóm tắt',
      statistics: 'Thống kê',
      team: 'Nhóm',
      users: 'Người dùng',
      settings: 'Cài đặt',
      profile: 'Hồ sơ',
    },
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
