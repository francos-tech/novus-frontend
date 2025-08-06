import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ReduxProvider from "@/components/providers/ReduxProvider";
import AntdThemeProvider from "@/components/providers/AntdThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Novus Underwriters Platform",
  description: "Insurance underwriting platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AntdRegistry>
            <AntdThemeProvider>
              {children}
            </AntdThemeProvider>
          </AntdRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}
