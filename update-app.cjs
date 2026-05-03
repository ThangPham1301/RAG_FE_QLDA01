const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'src', 'App.jsx')
let content = fs.readFileSync(filePath, 'utf8')

// Add VerifyEmailPage import
content = content.replace(
  "import RegisterPage from './pages/RegisterPage'",
  "import RegisterPage from './pages/RegisterPage'\nimport VerifyEmailPage from './pages/VerifyEmailPage'"
)

// Add /verify-email route after /register route
content = content.replace(
  `        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />`,
  `        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyEmailPage />
            </PublicRoute>
          }
        />`
)

fs.writeFileSync(filePath, content)
console.log('✓ App.jsx updated successfully')
