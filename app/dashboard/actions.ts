// "use server";

// import { createClient } from "@/lib/pocket-base";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { AvailabilityRecord, GroupedAvailability } from "./types";
// import { actionClient } from "@/lib/safe-action";
// import { availabilitySchema } from "./schemas/availability";
// import { z } from "zod";

// export const getTutorAvailability = async () => {
//   const pb = createClient();

//   const cookiesStore = await cookies();
//   const authCookie = cookiesStore.get("pb_auth");
//   if (!authCookie?.value) {
//     redirect("/auth");
//   }

//   pb.authStore.loadFromCookie(authCookie.value);
//   const userData = await pb.collection("users").getOne(pb.authStore.model?.id);

//   const { iso_NUM: isoNum } = await pb
//     .collection("countries")
//     .getOne(userData.country, {
//       fields: "iso_NUM",
//     });

//   const tutorRecord = await pb
//     .collection("tutors")
//     .getFirstListItem(`tutor="${userData.id}"`);

//   if (!tutorRecord) {
//     throw new Error("You must be a tutor to set your availability");
//   }

//   const availabilityRecords = await pb
//     .collection("tutors_availabilities")
//     .getFullList({
//       filter: `tutor="${tutorRecord.id}"`,
//       sort: "weekday,timerange_start",
//     });

//   // Convert UTC times to local times for display
//   const convertedRecords = availabilityRecords.map((record) => ({
//     ...record,
//     timerange_start: convertFromUTC(
//       record.timerange_start,
//       "2024-01-01", // Use a fixed date for conversion
//       isoNum
//     ),
//     timerange_end: convertFromUTC(record.timerange_end, "2024-01-01", isoNum),
//   }));

//   return {
//     availabilityRecords: groupAvailabilityByWeekday(
//       convertedRecords as AvailabilityRecord[]
//     ),
//     country: isoNum,
//   };
// };

// const schema = z.object({
//   availability: availabilitySchema,
//   countryIsoNum: z.number().int().positive(),
// });

// export const updateAction = actionClient
//   .schema(schema)
//   .action(async ({ parsedInput: { availability, countryIsoNum } }) => {
//     const pb = createClient();
//     const cookiesStore = await cookies();
//     const authCookie = cookiesStore.get("pb_auth");

//     if (!authCookie?.value) {
//       return { success: false, error: "Not authenticated" };
//     }

//     try {
//       pb.authStore.loadFromCookie(authCookie.value);
//       const userData = await pb
//         .collection("users")
//         .getOne(pb.authStore.model?.id);

//       const tutorRecord = await pb
//         .collection("tutors")
//         .getFirstListItem(`tutor="${userData.id}"`);

//       if (!tutorRecord) {
//         return { success: false, error: "Not a tutor" };
//       }

//       // Get existing records
//       const existingRecords = await pb
//         .collection("tutors_availabilities")
//         .getFullList({
//           filter: `tutor="${tutorRecord.id}"`,
//         });

//       // Delete all existing records
//       await Promise.all(
//         existingRecords.map((record) =>
//           pb.collection("tutors_availabilities").delete(record.id)
//         )
//       );

//       // Create new records with UTC conversion
//       const newRecords = Object.entries(availability).flatMap(
//         ([weekday, slots]) =>
//           slots.map((slot) => ({
//             tutor: tutorRecord.id,
//             weekday,
//             timerange_start: convertToUTC(
//               slot.timerange_start,
//               "2024-01-01",
//               countryIsoNum
//             ),
//             timerange_end: convertToUTC(
//               slot.timerange_end,
//               "2024-01-01",
//               countryIsoNum
//             ),
//           }))
//       );

//       await Promise.all(
//         newRecords.map((record) =>
//           pb.collection("tutors_availabilities").create(record)
//         )
//       );

//       return { success: true };
//     } catch (error) {
//       console.error("Error updating availability:", error);
//       return {
//         success: false,
//         error:
//           error instanceof Error
//             ? error.message
//             : "Failed to update availability",
//       };
//     }
//   });

// const groupAvailabilityByWeekday = (
//   records: AvailabilityRecord[]
// ): GroupedAvailability => {
//   const weekdayOrder = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];

//   // Initialize the grouped object with all weekdays
//   const grouped = weekdayOrder.reduce((acc, weekday) => {
//     acc[weekday] = [];
//     return acc;
//   }, {} as GroupedAvailability);

//   // Group the records by weekday
//   records.forEach((record) => {
//     if (grouped[record.weekday]) {
//       grouped[record.weekday].push({
//         timerange_start: record.timerange_start,
//         timerange_end: record.timerange_end,
//       });
//     }
//   });

//   // Sort time ranges within each weekday
//   Object.keys(grouped).forEach((weekday) => {
//     grouped[weekday].sort((a, b) =>
//       a.timerange_start.localeCompare(b.timerange_start)
//     );
//   });

//   return grouped;
// };
