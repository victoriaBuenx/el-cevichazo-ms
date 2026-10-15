"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HouseIcon,
  ShoppingCartSimpleIcon,
  WrenchIcon,
  ArrowsCounterClockwiseIcon,
  ClockCounterClockwiseIcon,
  ChartBarIcon,
  UsersIcon,
  GearIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import logo from "../../public/logoCevi.png";

const navMain = [
  {
    title: "Inicio",
    url: "/app",
    icon: HouseIcon,
    exact: true,
  },
];

const navGastos = [
  {
    title: "Proveedores",
    url: "/app/gastos/proveedores",
    icon: ShoppingCartSimpleIcon,
  },
  {
    title: "Servicios",
    url: "/app/gastos/servicios",
    icon: WrenchIcon,
  },
  {
    title: "Gastos Recurrentes",
    url: "/app/gastos/recurrentes",
    icon: ArrowsCounterClockwiseIcon,
  },
];

const navAnalisis = [
  {
    title: "Historial",
    url: "/app/analisis/historial",
    icon: ClockCounterClockwiseIcon,
  },
  {
    title: "Análisis",
    url: "/app/analisis",
    icon: ChartBarIcon,
  },
];

const navAdmin = [
  {
    title: "Usuarios",
    url: "/app/administracion/usuarios",
    icon: UsersIcon,
  },
  {
    title: "Configuración",
    url: "/app/administracion/configuracion",
    icon: GearIcon,
  },
];

function isActive(pathname: string, url: string, exact = false) {
  if (exact) return pathname === url;
  return pathname === url || pathname.startsWith(url + "/");
}

interface NavGroupProps {
  label: string;
  items: { title: string; url: string; icon: React.ElementType }[];
  pathname: string;
  defaultOpen?: boolean;
}

function NavGroup({
  label,
  items,
  pathname,
  defaultOpen = true,
}: NavGroupProps) {
  const hasActive = items.some((item) => isActive(pathname, item.url));
  const [open, setOpen] = useState(defaultOpen || hasActive);

  return (
    <SidebarGroup className="py-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 w-full shrink-0 items-center justify-between rounded-md px-2",
          "text-xs font-semibold uppercase text-sidebar-foreground/50",
          "transition-colors hover:text-sidebar-foreground/80",
          "group-data-[collapsible=icon]:hidden",
        )}
      >
        <span>{label}</span>
        <CaretDownIcon
          className={cn(
            "size-3 shrink-0 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const active = isActive(pathname, item.url);
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={item.title}
                    render={<Link href={item.url} />}
                    className={cn(
                      "gap-3 transition-all duration-150",
                      active
                        ? "bg-sidebar-primary/10 text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        active
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/50",
                      )}
                    />
                    <span>{item.title}</span>
                    {active && (
                      <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </div>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="h-svh overflow-hidden">
      <SidebarHeader className="px-2 py-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src={logo}
              alt="Logo El Cevichazo"
              fill
              className="object-cover h-16 w-auto rounded-lg"
            />
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-bold leading-tight tracking-tight text-sidebar-foreground">
              El Cevichazo
            </span>
            <span className="truncate text-[10px] leading-tight text-sidebar-foreground/50">
              Control de gastos
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0 px-1 py-2">
        <SidebarSeparator className="mb-2" />
        <SidebarGroup className="pb-2">
          <SidebarMenu>
            {navMain.map((item) => {
              const active = isActive(pathname, item.url, item.exact);
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={item.title}
                    render={<Link href={item.url} />}
                    className={cn(
                      "gap-3 transition-all duration-150",
                      active
                        ? "bg-sidebar-primary/10 text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        active
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/50",
                      )}
                    />
                    <span>{item.title}</span>
                    {active && (
                      <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="mb-1" />
        <NavGroup
          label="Gastos"
          items={navGastos}
          pathname={pathname}
          defaultOpen={true}
        />
        <SidebarSeparator className="my-1" />
        <NavGroup
          label="Análisis"
          items={navAnalisis}
          pathname={pathname}
          defaultOpen={true}
        />
        <SidebarSeparator className="my-1" />
        <NavGroup
          label="Administración"
          items={navAdmin}
          pathname={pathname}
          defaultOpen={true}
        />
      </SidebarContent>
      <SidebarFooter className="px-3 py-3">
        <div className="group-data-[collapsible=icon]:hidden">
          <p className="text-[10px] text-sidebar-foreground/30 text-center">
            © {new Date().getFullYear()} El Cevichazo
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
