"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          IntelliSites
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <NavItem href="/" label="Home" active={pathname === "/"} />
          <NavItem href="/chat" label="Chat" active={pathname === "/chat"} />
          <NavItem href="/docs" label="Docs" active={pathname === "/docs"} />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-lg" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t px-6 py-4 space-y-3 text-sm">
          <NavItem
            href="/"
            label="Home"
            active={pathname === "/"}
            onClick={() => setOpen(false)}
          />
          <NavItem
            href="/chat"
            label="Chat"
            active={pathname === "/chat"}
            onClick={() => setOpen(false)}
          />
          <NavItem
            href="/docs"
            label="Docs"
            active={pathname === "/docs"}
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </nav>
  );
}

function NavItem({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block transition-colors ${
        active
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
