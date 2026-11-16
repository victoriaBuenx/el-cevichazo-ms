export type MetodoPago = "efectivo" | "transferencia";

export type EstadoPago = "pagado" | "pendiente";

export type Ticket = {
  id: string;
  folio: string;
  fecha: string; // YYYY-MM-DD o ISO
  proveedorId: string;
  proveedorNombre: string;
  descripcion: string;
  importe: number;
  metodoPago: MetodoPago;
  estadoPago: EstadoPago;
  observaciones?: string | null;
  comprobanteUrl?: string | null;
  comprobanteNombre?: string | null;
  comprobanteTransferenciaUrl?: string | null;
  registradoPor?: string;
  createdAt: string;
};

export type CrearTicketInput = {
  proveedorId: string;
  proveedorNombre: string;
  fecha: string;
  descripcion: string;
  importe: number;
  metodoPago: MetodoPago;
  estadoPago: EstadoPago;
  observaciones?: string;
  comprobanteUrl?: string;
  comprobanteNombre?: string;
  comprobanteTransferenciaUrl?: string;
};

export type ActualizarTicketInput = {
  id: string;
  proveedorId: string;
  proveedorNombre: string;
  fecha: string;
  descripcion: string;
  importe: number;
  metodoPago: MetodoPago;
  estadoPago: EstadoPago;
  observaciones?: string;
  comprobanteUrl?: string;
  comprobanteNombre?: string;
  comprobanteTransferenciaUrl?: string;
};
