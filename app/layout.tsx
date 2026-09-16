import './globals.css';
import AppShell from './components/AppShell';

export const metadata = {
  title: 'SkillSpace',
  description: 'SkillSpace connects clients with people ready to complete online work.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><AppShell>{children}</AppShell></body>
    </html>
  );
}
