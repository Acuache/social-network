import Galaxy from "@/components/Galaxy";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen"
    >
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary dark:bg-black relative overflow-hidden items-center justify-center ">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Galaxy />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none">
          <div className="group pointer-events-auto cursor-default flex flex-col items-center">
            <h1 className="text-7xl font-bold tracking-widest text-white/90 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-700 ease-out group-hover:tracking-[0.4em] group-hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.6)] group-hover:text-white">
              ACUACHE
            </h1>
            <div className="mt-4 h-px w-32 bg-linear-to-r from-transparent via-white/50 to-transparent transition-all duration-700 ease-out group-hover:w-64 group-hover:via-white/80" />
            <p className="mt-4 text-sm tracking-[0.5em] uppercase text-white/50 transition-all duration-700 ease-out group-hover:tracking-[0.7em] group-hover:text-white/70">
              Social Network
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background relative dark:bg-[#282828] ">
        <div style={{ width: '100%', height: '100%', position: 'absolute' }} className="z-1 lg:hidden dark:bg-black bg-black lg:bg-none">
          <Galaxy />
        </div>
        <div className="w-full max-w-md z-2 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;