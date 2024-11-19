import { relations } from "drizzle-orm/relations";
import { usersInAuth, profiles, subjects, levels, tutorsServices, tutors, tutorsAvailabilities } from "./schema";

export const profilesRelations = relations(profiles, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
	tutors: many(tutors),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
}));

export const levelsRelations = relations(levels, ({one, many}) => ({
	subject: one(subjects, {
		fields: [levels.subjectId],
		references: [subjects.id]
	}),
	tutorsServices: many(tutorsServices),
}));

export const subjectsRelations = relations(subjects, ({many}) => ({
	levels: many(levels),
}));

export const tutorsServicesRelations = relations(tutorsServices, ({one}) => ({
	level: one(levels, {
		fields: [tutorsServices.levelId],
		references: [levels.id]
	}),
	tutor: one(tutors, {
		fields: [tutorsServices.tutorId],
		references: [tutors.id]
	}),
}));

export const tutorsRelations = relations(tutors, ({one, many}) => ({
	tutorsServices: many(tutorsServices),
	tutorsAvailabilities: many(tutorsAvailabilities),
	profile: one(profiles, {
		fields: [tutors.profileId],
		references: [profiles.id]
	}),
}));

export const tutorsAvailabilitiesRelations = relations(tutorsAvailabilities, ({one}) => ({
	tutor: one(tutors, {
		fields: [tutorsAvailabilities.tutorId],
		references: [tutors.id]
	}),
}));