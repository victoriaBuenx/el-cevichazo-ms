"use client";

import { BellIcon } from "@phosphor-icons/react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";

export function AppTopbar() {
  const { user, logout, isLoggingOut } = useAuth();
  const displayName =
    user?.nombre || user?.userName || user?.email?.split("@")[0] || "Usuario";
  const displayRole = user?.rol || user?.role || "Usuario";

  const getInitial = (name?: string) => {
    return name?.trim().charAt(0).toUpperCase() || "E";
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 md:hidden" />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <BellIcon className="size-4" />
        <Separator orientation="vertical" className="h-5" />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar
                  size="sm"
                  className="ring-primary/20 transition-transform group-hover:scale-105"
                >
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {getInitial(displayName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent className="w-32">
            <DropdownMenuGroup>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                disabled={isLoggingOut}
                onClick={() => logout()}
              >
                {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
          <div className="hidden flex-col md:flex">
            <span className="text-xs font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
              {displayName}
            </span>
            <span className="text-[10px] leading-tight text-muted-foreground capitalize">
              {displayRole.toLowerCase()}
            </span>
          </div>
        </DropdownMenu>
      </div>
    </header>
  );
}
