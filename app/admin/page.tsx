import { ProtectedRoute } from "@/components/protected-route"

const AdminPage = () => {
  return (
    <ProtectedRoute adminOnly>
      <div>
        <h1>Admin Page</h1>
        <p>This page is only accessible to administrators.</p>
      </div>
    </ProtectedRoute>
  )
}

export default AdminPage
