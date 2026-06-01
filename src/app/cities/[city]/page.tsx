import { notFound } from "next/navigation";
import { CITIES, getCityBySlug } from "@/lib/cities";
import CityView from "@/components/CityView";

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const data = getCityBySlug(city);
  if (!data) notFound();
  return <CityView city={data} />;
}
