import { getTutorAvailability } from "./actions";
import { AvailabilityEditor } from "./availaiblity-editor";

export default async function TutorAvailabilityPageWrapper() {
  const { availabilityRecords, country } = await getTutorAvailability();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Tutor Availability</h1>
      <AvailabilityEditor initialData={availabilityRecords} country={country} />
    </div>
  );
}
