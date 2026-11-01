export type Proveedor = {
  id: string;
  name: string;
  phone: string;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
  pendingBalance?: number;
  monthExpense?: number;
  lastMovementDate?: string | null;
  lastMovementConcept?: string | null;
};

export type CrearProveedorInput = {
  name: string;
  phone: string;
  notes?: string;
  pendingBalance?: number;
};

export type ActualizarProveedorInput = {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  pendingBalance?: number;
};
