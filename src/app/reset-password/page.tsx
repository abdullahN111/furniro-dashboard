import { Suspense } from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-slate-100 flex justify-center items-center px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <span className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
