import { Link } from "react-router-dom";

const AuthLayout = ({
  title,
  subtitle,
  footerText,
  footerLink,
  footerLinkText,
  children,
}) => {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-[28px] shadow-[0_28px_70px_rgba(15,23,42,0.08)] p-8 sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Secure Access
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        {children}

        <div className="mt-8 text-center text-sm text-slate-600">
          {footerText}{" "}
          {footerLink && (
            <Link to={footerLink} className="font-semibold text-blue-600 transition hover:text-blue-700">
              {footerLinkText}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
