/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type AuthAalLevel = "aal1" | "aal2" | "aal3";

export type AuthCodeChallengeMethod = "plain" | "s256";

export type AuthFactorStatus = "unverified" | "verified";

export type AuthFactorType = "phone" | "totp" | "webauthn";

export type AuthOneTimeTokenType = "confirmation_token" | "email_change_token_current" | "email_change_token_new" | "phone_change_token" | "reauthentication_token" | "recovery_token";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Numeric = ColumnType<string, number | string, number | string>;

export type PgsodiumKeyStatus = "default" | "expired" | "invalid" | "valid";

export type PgsodiumKeyType = "aead-det" | "aead-ietf" | "auth" | "generichash" | "hmacsha256" | "hmacsha512" | "kdf" | "secretbox" | "secretstream" | "shorthash" | "stream_xchacha20";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Weekdays = "friday" | "monday" | "saturday" | "sunday" | "thursday" | "tuesday" | "wednesday";

export interface AuthAuditLogEntries {
  createdAt: Timestamp | null;
  id: string;
  instanceId: string | null;
  ipAddress: Generated<string>;
  payload: Json | null;
}

export interface AuthFlowState {
  authCode: string;
  authCodeIssuedAt: Timestamp | null;
  authenticationMethod: string;
  codeChallenge: string;
  codeChallengeMethod: AuthCodeChallengeMethod;
  createdAt: Timestamp | null;
  id: string;
  providerAccessToken: string | null;
  providerRefreshToken: string | null;
  providerType: string;
  updatedAt: Timestamp | null;
  userId: string | null;
}

export interface AuthIdentities {
  createdAt: Timestamp | null;
  /**
   * Auth: Email is a generated column that references the optional email property in the identity_data
   */
  email: Generated<string | null>;
  id: Generated<string>;
  identityData: Json;
  lastSignInAt: Timestamp | null;
  provider: string;
  providerId: string;
  updatedAt: Timestamp | null;
  userId: string;
}

export interface AuthInstances {
  createdAt: Timestamp | null;
  id: string;
  rawBaseConfig: string | null;
  updatedAt: Timestamp | null;
  uuid: string | null;
}

export interface AuthMfaAmrClaims {
  authenticationMethod: string;
  createdAt: Timestamp;
  id: string;
  sessionId: string;
  updatedAt: Timestamp;
}

export interface AuthMfaChallenges {
  createdAt: Timestamp;
  factorId: string;
  id: string;
  ipAddress: string;
  otpCode: string | null;
  verifiedAt: Timestamp | null;
  webAuthnSessionData: Json | null;
}

export interface AuthMfaFactors {
  createdAt: Timestamp;
  factorType: AuthFactorType;
  friendlyName: string | null;
  id: string;
  lastChallengedAt: Timestamp | null;
  phone: string | null;
  secret: string | null;
  status: AuthFactorStatus;
  updatedAt: Timestamp;
  userId: string;
  webAuthnAaguid: string | null;
  webAuthnCredential: Json | null;
}

export interface AuthOneTimeTokens {
  createdAt: Generated<Timestamp>;
  id: string;
  relatesTo: string;
  tokenHash: string;
  tokenType: AuthOneTimeTokenType;
  updatedAt: Generated<Timestamp>;
  userId: string;
}

export interface AuthRefreshTokens {
  createdAt: Timestamp | null;
  id: Generated<Int8>;
  instanceId: string | null;
  parent: string | null;
  revoked: boolean | null;
  sessionId: string | null;
  token: string | null;
  updatedAt: Timestamp | null;
  userId: string | null;
}

export interface AuthSamlProviders {
  attributeMapping: Json | null;
  createdAt: Timestamp | null;
  entityId: string;
  id: string;
  metadataUrl: string | null;
  metadataXml: string;
  nameIdFormat: string | null;
  ssoProviderId: string;
  updatedAt: Timestamp | null;
}

export interface AuthSamlRelayStates {
  createdAt: Timestamp | null;
  flowStateId: string | null;
  forEmail: string | null;
  id: string;
  redirectTo: string | null;
  requestId: string;
  ssoProviderId: string;
  updatedAt: Timestamp | null;
}

export interface AuthSchemaMigrations {
  version: string;
}

export interface AuthSessions {
  aal: AuthAalLevel | null;
  createdAt: Timestamp | null;
  factorId: string | null;
  id: string;
  ip: string | null;
  /**
   * Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.
   */
  notAfter: Timestamp | null;
  refreshedAt: Timestamp | null;
  tag: string | null;
  updatedAt: Timestamp | null;
  userAgent: string | null;
  userId: string;
}

export interface AuthSsoDomains {
  createdAt: Timestamp | null;
  domain: string;
  id: string;
  ssoProviderId: string;
  updatedAt: Timestamp | null;
}

export interface AuthSsoProviders {
  createdAt: Timestamp | null;
  id: string;
  /**
   * Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.
   */
  resourceId: string | null;
  updatedAt: Timestamp | null;
}

export interface AuthUsers {
  aud: string | null;
  bannedUntil: Timestamp | null;
  confirmationSentAt: Timestamp | null;
  confirmationToken: string | null;
  confirmedAt: Generated<Timestamp | null>;
  createdAt: Timestamp | null;
  deletedAt: Timestamp | null;
  email: string | null;
  emailChange: string | null;
  emailChangeConfirmStatus: Generated<number | null>;
  emailChangeSentAt: Timestamp | null;
  emailChangeTokenCurrent: Generated<string | null>;
  emailChangeTokenNew: string | null;
  emailConfirmedAt: Timestamp | null;
  encryptedPassword: string | null;
  id: string;
  instanceId: string | null;
  invitedAt: Timestamp | null;
  isAnonymous: Generated<boolean>;
  /**
   * Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.
   */
  isSsoUser: Generated<boolean>;
  isSuperAdmin: boolean | null;
  lastSignInAt: Timestamp | null;
  phone: Generated<string | null>;
  phoneChange: Generated<string | null>;
  phoneChangeSentAt: Timestamp | null;
  phoneChangeToken: Generated<string | null>;
  phoneConfirmedAt: Timestamp | null;
  rawAppMetaData: Json | null;
  rawUserMetaData: Json | null;
  reauthenticationSentAt: Timestamp | null;
  reauthenticationToken: Generated<string | null>;
  recoverySentAt: Timestamp | null;
  recoveryToken: string | null;
  role: string | null;
  updatedAt: Timestamp | null;
}

export interface ExtensionsPgStatStatements {
  blkReadTime: number | null;
  blkWriteTime: number | null;
  calls: Int8 | null;
  dbid: number | null;
  jitEmissionCount: Int8 | null;
  jitEmissionTime: number | null;
  jitFunctions: Int8 | null;
  jitGenerationTime: number | null;
  jitInliningCount: Int8 | null;
  jitInliningTime: number | null;
  jitOptimizationCount: Int8 | null;
  jitOptimizationTime: number | null;
  localBlksDirtied: Int8 | null;
  localBlksHit: Int8 | null;
  localBlksRead: Int8 | null;
  localBlksWritten: Int8 | null;
  maxExecTime: number | null;
  maxPlanTime: number | null;
  meanExecTime: number | null;
  meanPlanTime: number | null;
  minExecTime: number | null;
  minPlanTime: number | null;
  plans: Int8 | null;
  query: string | null;
  queryid: Int8 | null;
  rows: Int8 | null;
  sharedBlksDirtied: Int8 | null;
  sharedBlksHit: Int8 | null;
  sharedBlksRead: Int8 | null;
  sharedBlksWritten: Int8 | null;
  stddevExecTime: number | null;
  stddevPlanTime: number | null;
  tempBlkReadTime: number | null;
  tempBlksRead: Int8 | null;
  tempBlksWritten: Int8 | null;
  tempBlkWriteTime: number | null;
  toplevel: boolean | null;
  totalExecTime: number | null;
  totalPlanTime: number | null;
  userid: number | null;
  walBytes: Numeric | null;
  walFpi: Int8 | null;
  walRecords: Int8 | null;
}

export interface ExtensionsPgStatStatementsInfo {
  dealloc: Int8 | null;
  statsReset: Timestamp | null;
}

export interface Levels {
  id: Generated<string>;
  name: string;
  subjectId: string;
}

export interface PgsodiumDecryptedKey {
  associatedData: string | null;
  comment: string | null;
  created: Timestamp | null;
  decryptedRawKey: Buffer | null;
  expires: Timestamp | null;
  id: string | null;
  keyContext: Buffer | null;
  keyId: Int8 | null;
  keyType: PgsodiumKeyType | null;
  name: string | null;
  parentKey: string | null;
  rawKey: Buffer | null;
  rawKeyNonce: Buffer | null;
  status: PgsodiumKeyStatus | null;
}

export interface PgsodiumKey {
  associatedData: Generated<string | null>;
  comment: string | null;
  created: Generated<Timestamp>;
  expires: Timestamp | null;
  id: Generated<string>;
  keyContext: Generated<Buffer | null>;
  keyId: Generated<Int8 | null>;
  keyType: PgsodiumKeyType | null;
  name: string | null;
  parentKey: string | null;
  rawKey: Buffer | null;
  rawKeyNonce: Buffer | null;
  status: Generated<PgsodiumKeyStatus | null>;
  userData: string | null;
}

export interface PgsodiumMaskColumns {
  associatedColumns: string | null;
  attname: string | null;
  attrelid: number | null;
  formatType: string | null;
  keyId: string | null;
  keyIdColumn: string | null;
  nonceColumn: string | null;
}

export interface PgsodiumMaskingRule {
  associatedColumns: string | null;
  attname: string | null;
  attnum: number | null;
  attrelid: number | null;
  colDescription: string | null;
  formatType: string | null;
  keyId: string | null;
  keyIdColumn: string | null;
  nonceColumn: string | null;
  priority: number | null;
  relname: string | null;
  relnamespace: string | null;
  securityInvoker: boolean | null;
  viewName: string | null;
}

export interface PgsodiumValidKey {
  associatedData: string | null;
  created: Timestamp | null;
  expires: Timestamp | null;
  id: string | null;
  keyContext: Buffer | null;
  keyId: Int8 | null;
  keyType: PgsodiumKeyType | null;
  name: string | null;
  status: PgsodiumKeyStatus | null;
}

export interface Profiles {
  avatarUrl: string;
  id: string;
  name: string;
}

export interface RealtimeMessages {
  event: string | null;
  extension: string;
  id: Generated<string>;
  insertedAt: Generated<Timestamp>;
  payload: Json | null;
  private: Generated<boolean | null>;
  topic: string;
  updatedAt: Generated<Timestamp>;
}

export interface RealtimeSchemaMigrations {
  insertedAt: Timestamp | null;
  version: Int8;
}

export interface RealtimeSubscription {
  claims: Json;
  claimsRole: Generated<string>;
  createdAt: Generated<Timestamp>;
  entity: string;
  filters: Generated<string[]>;
  id: Generated<Int8>;
  subscriptionId: string;
}

export interface StorageBuckets {
  allowedMimeTypes: string[] | null;
  avifAutodetection: Generated<boolean | null>;
  createdAt: Generated<Timestamp | null>;
  fileSizeLimit: Int8 | null;
  id: string;
  name: string;
  /**
   * Field is deprecated, use owner_id instead
   */
  owner: string | null;
  ownerId: string | null;
  public: Generated<boolean | null>;
  updatedAt: Generated<Timestamp | null>;
}

export interface StorageMigrations {
  executedAt: Generated<Timestamp | null>;
  hash: string;
  id: number;
  name: string;
}

export interface StorageObjects {
  bucketId: string | null;
  createdAt: Generated<Timestamp | null>;
  id: Generated<string>;
  lastAccessedAt: Generated<Timestamp | null>;
  metadata: Json | null;
  name: string | null;
  /**
   * Field is deprecated, use owner_id instead
   */
  owner: string | null;
  ownerId: string | null;
  pathTokens: Generated<string[] | null>;
  updatedAt: Generated<Timestamp | null>;
  userMetadata: Json | null;
  version: string | null;
}

export interface StorageS3MultipartUploads {
  bucketId: string;
  createdAt: Generated<Timestamp>;
  id: string;
  inProgressSize: Generated<Int8>;
  key: string;
  ownerId: string | null;
  uploadSignature: string;
  userMetadata: Json | null;
  version: string;
}

export interface StorageS3MultipartUploadsParts {
  bucketId: string;
  createdAt: Generated<Timestamp>;
  etag: string;
  id: Generated<string>;
  key: string;
  ownerId: string | null;
  partNumber: number;
  size: Generated<Int8>;
  uploadId: string;
  version: string;
}

export interface Subjects {
  id: Generated<string>;
  name: string;
}

export interface Tutors {
  id: Generated<string>;
  metadata: Json | null;
  profileId: string;
}

export interface TutorsAvailabilities {
  afternoon: Generated<boolean>;
  evening: Generated<boolean>;
  id: Generated<string>;
  morning: Generated<boolean>;
  tutorId: string;
  weekday: Weekdays;
}

export interface TutorsServices {
  id: Generated<string>;
  levelId: string;
  price: Numeric;
  tutorId: string;
}

export interface VaultDecryptedSecrets {
  createdAt: Timestamp | null;
  decryptedSecret: string | null;
  description: string | null;
  id: string | null;
  keyId: string | null;
  name: string | null;
  nonce: Buffer | null;
  secret: string | null;
  updatedAt: Timestamp | null;
}

export interface VaultSecrets {
  createdAt: Generated<Timestamp>;
  description: Generated<string>;
  id: Generated<string>;
  keyId: Generated<string | null>;
  name: string | null;
  nonce: Generated<Buffer | null>;
  secret: string;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  "auth.auditLogEntries": AuthAuditLogEntries;
  "auth.flowState": AuthFlowState;
  "auth.identities": AuthIdentities;
  "auth.instances": AuthInstances;
  "auth.mfaAmrClaims": AuthMfaAmrClaims;
  "auth.mfaChallenges": AuthMfaChallenges;
  "auth.mfaFactors": AuthMfaFactors;
  "auth.oneTimeTokens": AuthOneTimeTokens;
  "auth.refreshTokens": AuthRefreshTokens;
  "auth.samlProviders": AuthSamlProviders;
  "auth.samlRelayStates": AuthSamlRelayStates;
  "auth.schemaMigrations": AuthSchemaMigrations;
  "auth.sessions": AuthSessions;
  "auth.ssoDomains": AuthSsoDomains;
  "auth.ssoProviders": AuthSsoProviders;
  "auth.users": AuthUsers;
  "extensions.pgStatStatements": ExtensionsPgStatStatements;
  "extensions.pgStatStatementsInfo": ExtensionsPgStatStatementsInfo;
  levels: Levels;
  "pgsodium.decryptedKey": PgsodiumDecryptedKey;
  "pgsodium.key": PgsodiumKey;
  "pgsodium.maskColumns": PgsodiumMaskColumns;
  "pgsodium.maskingRule": PgsodiumMaskingRule;
  "pgsodium.validKey": PgsodiumValidKey;
  profiles: Profiles;
  "realtime.messages": RealtimeMessages;
  "realtime.schemaMigrations": RealtimeSchemaMigrations;
  "realtime.subscription": RealtimeSubscription;
  "storage.buckets": StorageBuckets;
  "storage.migrations": StorageMigrations;
  "storage.objects": StorageObjects;
  "storage.s3MultipartUploads": StorageS3MultipartUploads;
  "storage.s3MultipartUploadsParts": StorageS3MultipartUploadsParts;
  subjects: Subjects;
  tutors: Tutors;
  tutorsAvailabilities: TutorsAvailabilities;
  tutorsServices: TutorsServices;
  "vault.decryptedSecrets": VaultDecryptedSecrets;
  "vault.secrets": VaultSecrets;
}
