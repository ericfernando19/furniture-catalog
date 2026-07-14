"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/admin/Badge";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/lib/utils";

interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  _count: { products: number };
}

interface CategoryManagerProps {
  categories: CategoryWithCount[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<CategoryWithCount | null>(null);
  const [deleting, setDeleting] = useState<CategoryWithCount | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success("Kategori berhasil ditambahkan");
      setName("");
      setCreateOpen(false);
      router.refresh();
    } catch {
      toast.error("Gagal menambahkan kategori");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit() {
    if (!editing || !name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success("Kategori berhasil diperbarui");
      setName("");
      setEditing(null);
      setEditOpen(false);
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui kategori");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Kategori berhasil dihapus");
      setDeleting(null);
      setDeleteOpen(false);
      router.refresh();
    } catch {
      toast.error("Gagal menghapus kategori");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-4">
        <Button onClick={() => setCreateOpen(true)} variant="primary">+ Tambah Kategori</Button>
      </div>

      {categories.length === 0 ? (
        <div className="card-admin px-5 py-12 text-center text-sm text-zinc-400">
          Belum ada kategori.
        </div>
      ) : (
        <div className="card-admin overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Slug</th>
                  <th>Produk</th>
                  <th>Tanggal</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="font-medium text-zinc-900 dark:text-zinc-100">{cat.name}</td>
                    <td className="text-zinc-500 dark:text-zinc-400">{cat.slug}</td>
                    <td>
                      <Badge variant="gold">{cat._count.products}</Badge>
                    </td>
                    <td className="text-zinc-500 dark:text-zinc-400">{formatDate(cat.createdAt)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditing(cat); setName(cat.name); setEditOpen(true); }}
                          className="rounded-md px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { setDeleting(cat); setDeleteOpen(true); }}
                          className="rounded-md px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Tambah Kategori">
        <Input
          id="newCategory"
          label="Nama Kategori"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama kategori"
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
          <Button onClick={handleCreate} loading={loading}>Simpan</Button>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Kategori">
        <Input
          id="editCategory"
          label="Nama Kategori"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama kategori"
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
          <Button onClick={handleEdit} loading={loading}>Simpan</Button>
        </div>
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Hapus Kategori">
        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
          <p>Apakah Anda yakin ingin menghapus kategori berikut?</p>
          <p className="break-words rounded-lg bg-red-50 px-4 py-3 font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400">
            {deleting?.name}
          </p>
          {deleting && deleting._count.products > 0 && (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              Kategori ini memiliki <strong>{deleting._count.products} produk</strong> yang juga akan terhapus.
            </p>
          )}
          <p className="text-xs text-zinc-400">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteOpen(false)}>Batal</Button>
          <Button variant="danger" onClick={handleDelete} loading={loading}>Ya, Hapus</Button>
        </div>
      </Modal>
    </>
  );
}
