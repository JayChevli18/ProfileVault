import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "@/config/database";
import { validateEnv } from "@/config/env";
import { Profile } from "@/modules/profile/profile.model";
import { User } from "@/modules/user/user.model";

async function verifyDatabase(): Promise<void> {
  validateEnv();
  await connectDatabase();

  const userIndexes = await User.collection.indexes();
  const profileIndexes = await Profile.collection.indexes();

  console.log("MongoDB connection verified");
  console.log(`Database: ${mongoose.connection.name}`);
  console.log(`Host: ${mongoose.connection.host}`);
  console.log(
    "User indexes:",
    userIndexes.map((index: { name?: string }) => index.name).join(", ")
  );
  console.log(
    "Profile indexes:",
    profileIndexes.map((index: { name?: string }) => index.name).join(", ")
  );

  await disconnectDatabase();
  console.log("Phase 2 database verification passed.");
}

verifyDatabase().catch((error: Error) => {
  console.error("Phase 2 database verification failed:", error.message);
  process.exit(1);
});
