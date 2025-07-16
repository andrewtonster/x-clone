export default function UserLayout({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: React.ReactNode;
}) {
  return (
    <>
      {children}
      {settings}
    </>
  );
}
