/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Popover, Transition } from "@headlessui/react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, type JSX, type SVGProps } from "react";
import { Container } from "./Container";
import { NavLink } from "./NavLink";
import { trackGAEvent } from "./analitycs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";

function MobileNavLink({
  href,
  children,
  target,
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
}) {
  return (
    <Popover.Button
      onClick={() => {
        trackGAEvent({
          action: "Nav Link Clicked",
          category: "Navigation",
          label: href,
        });
      }}
      as={Link}
      href={href}
      target={target}
      className="block w-full p-2"
    >
      {children}
    </Popover.Button>
  );
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-muted-foreground"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={cn("origin-center transition", open && "scale-90 opacity-0")}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={cn("origin-center transition", !open && "scale-90 opacity-0")}
      />
    </svg>
  );
}

function MobileNavigation() {
  const t = useTranslations("HomePage");
  const linkT = useTranslations("Link");
  const router = useRouter();

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center ui-not-focus-visible:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment as any}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-background/50" />
        </Transition.Child>

        <Transition.Child
          as={Fragment as any}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl border border-border bg-background p-4 text-lg tracking-tight text-primary shadow-xl ring-1 ring-border/5"
          >
            <MobileNavLink href="/#pricing">{t("navigation.pricing")}</MobileNavLink>
            <MobileNavLink href="/#faqs">{t("navigation.faqs")}</MobileNavLink>
            <MobileNavLink href={linkT("docs.intro")} target="_blank">
              {t("navigation.docs")}
            </MobileNavLink>
            <MobileNavLink href="/blog">{t("navigation.blog")}</MobileNavLink>
            <Button className="w-full" onClick={handleRegisterClick}>
              <div className="group flex-row relative mx-auto flex max-w-fit items-center justify-center rounded-2xl text-sm font-medium w-full">
                <span>{t("navigation.dashboard")}</span>
                <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </div>
            </Button>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export function Header() {
  const t = useTranslations("HomePage");
  const linkT = useTranslations("Link");
  const router = useRouter();

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <header className="bg-background py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="Home">
              <Image src="/icon.svg" alt="logo" width={50} height={50} />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <NavLink href="/#pricing">{t("navigation.pricing")}</NavLink>
              <NavLink href="/#faqs">{t("navigation.faqs")}</NavLink>
              <NavLink href={linkT("docs.intro")} target="_blank">
                {t("navigation.docs")}
              </NavLink>
              <NavLink href="/blog">{t("navigation.blog")}</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-4 md:gap-x-5">
            <Link href="https://x.com/ezeslucky" target="_blank">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-muted-foreground group-hover:fill-muted-foreground/70 hover:fill-muted-foreground/80"
              >
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
            </Link>

            <Button className="rounded-full max-md:hidden" onClick={handleRegisterClick}>
              <div className="group flex-row relative mx-auto flex max-w-fit items-center justify-center rounded-2xl text-sm font-medium w-full">
                <span>{t("navigation.dashboard")}</span>
                <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </div>
            </Button>

            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
