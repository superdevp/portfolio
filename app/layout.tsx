import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://webu.life"),
  title: {
    default: "Kei Nishikori - Full-Stack Developer",
    template: "%s | Kei Nishikori",
  },
  description:
    "Portfolio website of Kei Nishikori, a passionate full-stack developer specializing in React, Node.js, and modern web technologies.",
  keywords: [
    "Kei Nishikori",
    "Full-Stack Developer",
    "React",
    "Node.js",
    "Portfolio",
  ],
  generator: "v0.dev",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kei Nishikori - Full-Stack Developer",
    description:
      "Portfolio website of Kei Nishikori, a passionate full-stack developer specializing in React, Node.js, and modern web technologies.",
    url: "https://ethanyu.dev",
    siteName: "EthanYu Portfolio",
    images: [
      {
        url: "/images/avatar.png",
        width: 1200,
        height: 630,
        alt: "Kei Nishikori - Full-Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethan Yu - Full-Stack Developer",
    description:
      "Portfolio website of Ethan Yu, a passionate full-stack developer specializing in React, Node.js, and modern web technologies.",
    creator: "@ethanyu",
    images: ["/images/avatar.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
