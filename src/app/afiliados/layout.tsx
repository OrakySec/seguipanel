import { ToastProvider } from "@/components/ui/Toast";

export default function AfiliadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
