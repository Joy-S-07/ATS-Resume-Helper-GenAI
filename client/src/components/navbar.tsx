"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Briefcase, Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  const navLinks = [
    { name: "ATS Checker", href: "ats-checker" },
    { name: "Resume Builder", href: "resume-builder" },
    { name: "Interview Prep", href: "interview" },
    { name: "Roadmaps", href: "roadmaps" },
  ];

  return (
    <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <Briefcase className="w-6 h-6 text-primary" />
          <span>CareerAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={`/${link.href}`}
                  className="relative group text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="icon"
            variant="ghost"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border p-4 bg-background">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={`/${link.href}`}
                  className="relative group inline-block text-muted-foreground hover:text-foreground transition-colors py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
            <li>
              <Button className="w-full mt-2" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export { Navbar };
