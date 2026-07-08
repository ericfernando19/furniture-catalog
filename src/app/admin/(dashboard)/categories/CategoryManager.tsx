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
        <div className="rounded-2xl border border-gray-100 bg-white py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-[#2C1810] dark:text-gray-400">
          Belum ada kategori.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-[#2C1810]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Nama</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Slug</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Produk</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Tanggal</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-[#1A120B]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <td className="px-5 py-4 text-sm font-semibold text-[#3E2723] dark:text-[#F5EDE0]">{cat.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{cat.slug}</td>
                    <td className="px-5 py-4">
                      <Badge variant="gold">{cat._count.products}</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(cat.createdAt)}</td>
                    <td className="px-5 py-4 text-right text-sm">
                      <button
                        onClick={() => { setEditing(cat); setName(cat.name); setEditOpen(true); }}
                        className="rounded-lg px-3 py-1.5 font-semibold text-[#8B6914] transition-colors hover:bg-[#8B6914]/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => { setDeleting(cat); setDeleteOpen(true); }}
                        className="rounded-lg px-3 py-1.5 font-semibold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Hapus
                      </button>
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
        <div className="text-sm text-[#4A3728] dark:text-gray-300 space-y-3">
          <p>Apakah Anda yakin ingin menghapus kategori berikut?</p>
          <p className="break-words rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {deleting?.name}
          </p>
          {deleting && deleting._count.products > 0 && (
            <p className="rounded-xl bg-yellow-50 px-4 py-3 text-xs text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
              Kategori ini memiliki <strong>{deleting._count.products} produk</strong> yang juga akan terhapus.
            </p>
          )}
          <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteOpen(false)}>Batal</Button>
          <Button variant="danger" onClick={handleDelete} loading={loading}>Ya, Hapus</Button>
        </div>
      </Modal>
    </>
  );
}
