import { getTutorWithGroupedServicesCached } from "./actions";
import TutoringForm from "./components/tutoring-form";

export default async function ContactPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const tutor = await getTutorWithGroupedServicesCached(id);

  return <TutoringForm tutor={tutor} />;
}
