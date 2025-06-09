"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Menu as MenuIcon, X as CloseIcon, User } from "lucide-react";
import { HeaderLogo } from "@/components/ui/header-logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Fermer le menu au clic extérieur ou touche ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  return (
    <header className="w-full mt-6 mb-10 px-0">
      <div className="flex flex-row items-center justify-between bg-white rounded-2xl shadow-lg sm:px-6 px-2 py-4 sm:mx-4 mx-1 gap-2 sm:gap-4">
        <div className="flex items-center gap-4">
          <div className="">
            <HeaderLogo />
          </div>
          <Link
            href="/"
            className="text-3xl font-extrabold text-primary tracking-tight hover:opacity-90 transition"
          >
            Element Hunter
          </Link>
        </div>
        {/* Menu burger mobile */}
        <button
          className="sm:hidden ml-auto p-2 rounded-md hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(true)}
        >
          <MenuIcon className="w-7 h-7 text-primary" />
        </button>
        {/* Liens principaux desktop */}
        <div className="hidden sm:flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
          {session ? (
            <>
              <Button variant="glossy" asChild>
                <Link href="/dashboard">API</Link>
              </Button>
              <Button variant="glossyAccent" asChild>
                <Link href="/scans">My Scans</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback className="bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <span className="font-medium">{session.user?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {session.user?.email}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="glossy" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="glossyAccent" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
        {/* Drawer mobile */}
        {open && (
          <div className="fixed inset-0 z-50 bg-foreground/40 flex">
            <div
              ref={drawerRef}
              className="bg-white w-64 max-w-full h-full shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-left duration-200"
              tabIndex={-1}
              aria-label="Menu principal"
            >
              <button
                className="self-end mb-2 p-2 rounded-md hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
              >
                <CloseIcon className="w-6 h-6 text-primary" />
              </button>
              {session ? (
                <>
                  <Button
                    variant="glossy"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/">API</Link>
                  </Button>
                  <Button
                    variant="glossyAccent"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/scans">My Scans</Link>
                  </Button>
                  <div className="flex flex-col gap-2 bg-secondary/20 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={session.user?.image || ""}
                          alt={session.user?.name || ""}
                        />
                        <AvatarFallback className="bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{session.user?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {session.user?.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="glossyDestructive"
                      onClick={() => {
                        setOpen(false);
                        signOut();
                      }}
                    >
                      Sign out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="glossy"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    variant="glossyAccent"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/register">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
            {/* Zone cliquable pour fermer */}
            <div className="flex-1" onClick={() => setOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
}
