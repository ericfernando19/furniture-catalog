"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";

interface DeleteButtonProps {
  productId: number;
  productName: string;
}

export function DeleteButton({ productId, productName }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Produk berhasil dihapus");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus produk");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
      >
        Hapus
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Hapus Produk">
        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
          <p>Apakah Anda yakin ingin menghapus produk berikut?</p>
          <p className="break-words rounded-lg bg-red-50 px-4 py-3 font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400">
            {productName}
          </p>
          <p className="text-xs text-zinc-400">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={loading}>
            Ya, Hapus
          </Button>
        </div>
      </Modal>
    </>
  );
}
