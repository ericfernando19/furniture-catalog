import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: RouteProps) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, stock, imageUrl, categoryId, featured } = body;

    let slug = slugify(name);
    const existing = await prisma.product.findFirst({
      where: { slug, NOT: { id: Number(id) } },
    });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        slug,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        categoryId: Number(categoryId),
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate produk" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}
