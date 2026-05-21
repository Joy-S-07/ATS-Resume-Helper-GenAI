import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Briefcase, Menu, Moon, Sun, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch — theme is unknown on first render
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "ATS Checker", href: "#ats" },
    { name: "Interview Prep", href: "#interview" },
    { name: "Roadmaps", href: "#roadmaps" },
  ];

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl text-foreground">
          <Briefcase className="w-6 h-6 text-primary" />
          <span>CareerAI</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleTheme}
              size="icon"
              variant="ghost"
              aria-label="Toggle theme"
            >
              {mounted && isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Button>Sign In</Button>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            onClick={toggleTheme}
            size="icon"
            variant="ghost"
            aria-label="Toggle theme"
          >
            {mounted && isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
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
        <div className="md:hidden border-t border-border p-4 bg-background animate-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="block p-2 hover:bg-accent rounded-md text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <Button className="w-full mt-2">Sign In</Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export { Navbar };
