import EditEvents from "@/admin/views/events/EditEvents";

export default async function Page({ params }) {
  // Await params per Next.js standards to extract the unique event ID
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return <EditEvents eventId={id} />;
}