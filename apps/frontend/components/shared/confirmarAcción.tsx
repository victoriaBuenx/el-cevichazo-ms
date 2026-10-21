"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { cn } from "cn";

type ConfirmarAcciónProps = {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  titulo: string;
  descripción: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: "default" | "destructive" | "success";
  icono?: React.ReactNode;
  onConfirmar?: () => void;
};

const varianteClasses = {
  default: {
    media: "bg-primary/10 text-primary ring-1 ring-primary/20",
    action: "",
  },
  destructive: {
    media: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
    action: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
  success: {
    media: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    action: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  },
};

export function ConfirmarAcción({
  abierto,
  onAbiertoChange,
  titulo,
  descripción,
  textoConfirmar = "Aceptar",
  textoCancelar = "Cancelar",
  variante = "default",
  icono,
  onConfirmar,
}: ConfirmarAcciónProps) {
  const estilos = varianteClasses[variante];

  return (
    <AlertDialog open={abierto} onOpenChange={onAbiertoChange}>
      <AlertDialogContent className="p-0 gap-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <AlertDialogHeader>
            {icono && (
              <AlertDialogMedia
                className={cn(
                  "size-10 rounded-full [&_svg:not([class*='size-'])]:size-5",
                  estilos.media,
                )}
              >
                {icono}
              </AlertDialogMedia>
            )}
            <AlertDialogTitle className="text-base font-semibold">
              {titulo}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {descripción}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="px-6 py-4 bg-muted/30 border-t">
          <AlertDialogCancel size="lg">{textoCancelar}</AlertDialogCancel>
          <AlertDialogAction
            size="lg"
            className={cn("gap-1.5", estilos.action)}
            onClick={() => {
              onConfirmar?.();
              onAbiertoChange(false);
            }}
          >
            {textoConfirmar}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
