import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return <main className="app-shell"><Outlet /></main>
}
