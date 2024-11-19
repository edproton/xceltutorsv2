import { pgTable, foreignKey, pgPolicy, uuid, text, check, numeric, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const weekdays = pgEnum("weekdays", ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])


export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	avatarUrl: text("avatar_url").notNull(),
	name: text().notNull(),
}, (table) => {
	return {
		profilesIdUsersIdFk: foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_id_users_id_fk"
		}),
		onlyTheUserCanUpdateTheirOwnProfile: pgPolicy("Only the user can update their own profile.", { as: "permissive", for: "update", to: ["authenticated"] }),
		usersCanViewTheirOwnProfile: pgPolicy("Users can view their own profile.", { as: "permissive", for: "select", to: ["authenticated"] }),
	}
});

export const subjects = pgTable("subjects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
}, (table) => {
	return {
		onlyAdminsCanInsertNewSubjects: pgPolicy("Only admins can insert new subjects.", { as: "permissive", for: "insert", to: ["supabase_auth_admin"] }),
		onlyAdminsCanUpdateExistingSubjects: pgPolicy("Only admins can update existing subjects.", { as: "permissive", for: "update", to: ["supabase_auth_admin"] }),
		onlyAdminsCanDeleteSubjects: pgPolicy("Only admins can delete subjects.", { as: "permissive", for: "delete", to: ["supabase_auth_admin"] }),
		onlyAuthenticatedUsersCanViewSubjects: pgPolicy("Only authenticated users can view subjects.", { as: "permissive", for: "select", to: ["authenticated"] }),
	}
});

export const levels = pgTable("levels", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	subjectId: uuid("subject_id").notNull(),
}, (table) => {
	return {
		levelsSubjectIdSubjectsIdFk: foreignKey({
			columns: [table.subjectId],
			foreignColumns: [subjects.id],
			name: "levels_subject_id_subjects_id_fk"
		}),
		onlyAdminsAreAllowedToInsertNewRecordsIntoTheLevelsT: pgPolicy("Only admins are allowed to insert new records into the levels t", { as: "permissive", for: "insert", to: ["supabase_auth_admin"] }),
		onlyAdminsAreAllowedToUpdateExistingRecordsInTheLevel: pgPolicy("Only admins are allowed to update existing records in the level", { as: "permissive", for: "update", to: ["supabase_auth_admin"] }),
		onlyAdminsAreAllowedToDeleteRecordsFromTheLevelsTable: pgPolicy("Only admins are allowed to delete records from the levels table", { as: "permissive", for: "delete", to: ["supabase_auth_admin"] }),
		authenticatedUsersAreAllowedToViewRecordsInTheLevelsT: pgPolicy("Authenticated users are allowed to view records in the levels t", { as: "permissive", for: "select", to: ["authenticated"] }),
	}
});

export const tutorsServices = pgTable("tutors_services", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tutorId: uuid("tutor_id").notNull(),
	levelId: uuid("level_id").notNull(),
	price: numeric({ precision: 4, scale:  2 }).notNull(),
}, (table) => {
	return {
		tutorsServicesLevelIdLevelsIdFk: foreignKey({
			columns: [table.levelId],
			foreignColumns: [levels.id],
			name: "tutors_services_level_id_levels_id_fk"
		}),
		tutorsServicesTutorIdTutorsIdFk: foreignKey({
			columns: [table.tutorId],
			foreignColumns: [tutors.id],
			name: "tutors_services_tutor_id_tutors_id_fk"
		}),
		authenticatedUsersCanViewAllServiceRecords: pgPolicy("Authenticated users can view all service records.", { as: "permissive", for: "select", to: ["authenticated"] }),
		onlyAuthenticatedTutorsCanDeleteTheirOwnServiceRecords: pgPolicy("Only authenticated tutors can delete their own service records.", { as: "permissive", for: "delete", to: ["authenticated"] }),
		onlyAuthenticatedTutorsCanUpdateTheirOwnServiceRecords: pgPolicy("Only authenticated tutors can update their own service records.", { as: "permissive", for: "update", to: ["authenticated"] }),
		onlyAuthenticatedTutorsCanInsertTheirOwnServiceRecords: pgPolicy("Only authenticated tutors can insert their own service records.", { as: "permissive", for: "insert", to: ["authenticated"] }),
		priceCheck: check("price_check", sql`(price > (5)::numeric) AND (price < (100)::numeric)`),
	}
});

export const tutorsAvailabilities = pgTable("tutors_availabilities", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tutorId: uuid("tutor_id").notNull(),
	weekday: weekdays().notNull(),
	morning: boolean().default(false).notNull(),
	afternoon: boolean().default(false).notNull(),
	evening: boolean().default(false).notNull(),
}, (table) => {
	return {
		tutorsAvailabilitiesTutorIdTutorsIdFk: foreignKey({
			columns: [table.tutorId],
			foreignColumns: [tutors.id],
			name: "tutors_availabilities_tutor_id_tutors_id_fk"
		}),
		onlyAuthenticatedTutorsCanInsertTheirOwnAvailabilityRec: pgPolicy("Only authenticated tutors can insert their own availability rec", { as: "permissive", for: "insert", to: ["authenticated"] }),
		onlyAuthenticatedTutorsCanUpdateTheirOwnAvailabilityRec: pgPolicy("Only authenticated tutors can update their own availability rec", { as: "permissive", for: "update", to: ["authenticated"] }),
		onlyAuthenticatedTutorsCanDeleteTheirOwnAvailabilityRec: pgPolicy("Only authenticated tutors can delete their own availability rec", { as: "permissive", for: "delete", to: ["authenticated"] }),
		authenticatedUsersCanViewAvailabilityRecords: pgPolicy("Authenticated users can view availability records.", { as: "permissive", for: "select", to: ["authenticated"] }),
	}
});

export const tutors = pgTable("tutors", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	profileId: uuid("profile_id").notNull(),
	metadata: jsonb(),
}, (table) => {
	return {
		tutorsProfileIdProfilesIdFk: foreignKey({
			columns: [table.profileId],
			foreignColumns: [profiles.id],
			name: "tutors_profile_id_profiles_id_fk"
		}),
		onlyServiceRoleCanInsertNewTutors: pgPolicy("Only service role can insert new tutors", { as: "permissive", for: "insert", to: ["service_role"] }),
		onlyServiceRoleCanDeleteTutors: pgPolicy("Only service role can delete tutors", { as: "permissive", for: "delete", to: ["service_role"] }),
		onlyServiceRoleCanUpdateAllTutorFields: pgPolicy("Only service role can update all tutor fields", { as: "permissive", for: "update", to: ["service_role"] }),
		onlyAuthenticatedTutorsCanUpdateTheirOwnMetadata: pgPolicy("Only authenticated tutors can update their own metadata", { as: "permissive", for: "update", to: ["authenticated"] }),
		allAuthenticatedUsersCanViewTutors: pgPolicy("All authenticated users can view tutors", { as: "permissive", for: "select", to: ["authenticated"] }),
	}
});
