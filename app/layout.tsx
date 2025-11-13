import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Miguel Sena - Software Developer",
    template: "%s | Miguel Sena",
  },
  description: "Portfolio of Miguel Sena, a software developer specializing in web development and modern technologies.",
  keywords: ["Miguel Sena", "software developer", "portfolio", "web development"],
  authors: [{ name: "Miguel Sena" }],
  creator: "Miguel Sena",
  metadataBase: new URL("https://miguelsena.dev"),
  openGraph: {
    title: "Miguel Sena - Software Developer",
    description: "Portfolio of Miguel Sena, a software developer specializing in web development and modern technologies.",
    type: "website",
    locale: "en_US",
    siteName: "Miguel Sena",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miguel Sena - Software Developer",
    description: "Portfolio of Miguel Sena, a software developer specializing in web development and modern technologies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isProduction && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "u5922l5e5w");`}
          </Script>
        )}
        {children}
      </body>
    </html>
  );
}
