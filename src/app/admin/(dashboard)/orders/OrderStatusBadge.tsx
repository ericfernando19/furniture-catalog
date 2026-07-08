import { Badge } from "@/components/admin/Badge";

interface OrderStatusBadgeProps {
  status: string;
}

const statusColors: Record<string, "gold" | "warning" | "success" | "danger"> = {
  BARU: "gold",
  DIPROSES: "warning",
  SELESAI: "success",
  DIBATALKAN: "danger",
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant={statusColors[status] || "default"}>
      {status}
    </Badge>
  );
}
