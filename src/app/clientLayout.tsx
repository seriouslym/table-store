'use client'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { AppContent } from "@/components/content"
import { Provider } from "react-redux"
import store from '@/store'
import { Toaster } from "@/components/ui/sonner"
import Login from "./login/page"

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  const isLogin = !!localStorage.getItem('data')
  return (
    <Provider store={store}>
      {isLogin ? (
        <SidebarProvider>
          <AppSidebar />
          <AppContent>
            {children}
          </AppContent>
        </SidebarProvider>
      ) : (
        <Login />
      )}
      <Toaster />
    </Provider>
  )
}
