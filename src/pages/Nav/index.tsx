"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Nav() {
  const { status } = useSession()
  const router = useRouter();

  return (
    <nav className="df gap-4 px-6 py-2 shadow sticky top-0 z-1 bg-white">
      <Link href="/" className="mr-auto font-bold">
        Smamiri Journal
      </Link>

      {
        status !== "loading" && (
          status === "unauthenticated" ? <>
            <Link
              href="/signup"
              className="text-sm font-medium hover:text-blue-600"
            >
              Sign up
            </Link>

            <Link
              href="/login"
              className="px-4 py-1 text-sm bg-slate-900 text-white hover:bg-slate-700 transition-colors rounded-md"
            >
              Log in
            </Link>
          </>
            :
            <>
              <Link
                href="/my-journals"
                className="text-sm font-medium hover:text-blue-600"
              >
                Journal Entries
              </Link>
              <Link
                href="/create-journal"
                className="text-sm font-medium hover:text-blue-600"
              >
                Create Entry
              </Link>
              <Link
                href="/summary"
                className="text-sm font-medium hover:text-blue-600"
              >
                Summary
              </Link>
              <button
                className="text-sm bg-slate-900 text-white hover:bg-slate-700 transition-colors"
                onClick={() =>
                  signOut({ redirect: false }).then(() => {
                    router.push("/login");
                  })
                }
              >
                Sign out
              </button>
            </>
        )
      }
    </nav>
  )
}

export default Nav