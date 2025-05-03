import UserProfileUpdate from "../../../components/user/user-profile";
import { Suspense } from "react";

export default function PostNewJob() {
    return (
      <div className="px-6 space-y-4">
        <Suspense fallback={<div>Loading...</div>}>
          <UserProfileUpdate />
        </Suspense>
      </div>
    );
  }