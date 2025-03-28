import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { getServerSession } from "next-auth"
import { SessionProvider } from "@/components/session-provider"
import { MedicalRecordsProvider } from '@/contexts/medical-records-context';
import { UserProvider } from '@/contexts/user-context';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hospital Management System",
  description: "A modern hospital management system",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <UserProvider>
            <MedicalRecordsProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                disableTransitionOnChange
              >
                <div className="min-h-screen flex flex-col">
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </ThemeProvider>
            </MedicalRecordsProvider>
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  )
}