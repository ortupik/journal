"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function SignOutBtn() {
  const router = useRouter();

  return (
    <button
      className="text-sm bg-slate-900 text-white hover:bg-slate-700 transition-colors px-4 py-2 rounded-md"
      onClick={() =>
        signOut({ redirect: false }).then(() => {
          router.push("/login");
        })
      }
    >
      Sign out
    </button>
  );
}

export default SignOutBtn;
