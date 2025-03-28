import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { MedicalRecordsProvider } from '@/contexts/medical-records-context';
import { UserProvider } from '@/contexts/user-context';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hospital Management System",
  description: "A modern hospital management system",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <UserProvider>
            <MedicalRecordsProvider>
              <div className="min-h-screen flex flex-col">
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </MedicalRecordsProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}