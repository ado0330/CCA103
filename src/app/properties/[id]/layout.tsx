import { mockProperties } from "@/data/mock-data";

export function generateStaticParams() {
  return mockProperties.map((property) => ({
    id: property.id,
  }));
}

export default function PropertyDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
