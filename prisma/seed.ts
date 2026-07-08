import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@myfurni.com",
      password: adminPassword,
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "kursi-sofa" },
      update: {},
      create: { name: "Kursi & Sofa", slug: "kursi-sofa" },
    }),
    prisma.category.upsert({
      where: { slug: "meja" },
      update: {},
      create: { name: "Meja", slug: "meja" },
    }),
    prisma.category.upsert({
      where: { slug: "lemari-rak" },
      update: {},
      create: { name: "Lemari & Rak", slug: "lemari-rak" },
    }),
    prisma.category.upsert({
      where: { slug: "dekorasi" },
      update: {},
      create: { name: "Dekorasi", slug: "dekorasi" },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  const products = [
    {
      name: "Sofa Minimalis Linen",
      slug: "sofa-minimalis-linen",
      description: "Sofa 3 kursi berbahan linen premium dengan rangka kayu jati solid. Busa density tinggi membuatnya nyaman untuk bersantai seharian. Cocok untuk ruang keluarga modern.",
      price: 5499000,
      stock: 5,
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
      categoryId: categories[0].id,
      featured: true,
    },
    {
      name: "Kursi Kayu Ukir Jepara",
      slug: "kursi-kayu-ukir-jepara",
      description: "Kursi kayu jati ukir tangan khas Jepara. Finishing natural wood dengan detail ukiran bunga yang elegan. Cocok sebagai kursi tamu atau ruang makan.",
      price: 1899000,
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop",
      categoryId: categories[0].id,
      featured: true,
    },
    {
      name: "Meja Makan Kayu Jati 6 Kursi",
      slug: "meja-makan-kayu-jati-6-kursi",
      description: "Set meja makan kayu jati solid dengan 6 kursi. Meja berukuran 180x90cm, cocok untuk keluarga. Finishing melamin anti noda dan tahan lama.",
      price: 7999000,
      stock: 3,
      imageUrl: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=600&h=600&fit=crop",
      categoryId: categories[1].id,
      featured: true,
    },
    {
      name: "Meja Kerja Minimalis",
      slug: "meja-kerja-minimalis",
      description: "Meja kerja ergonomis dengan desain minimalis modern. Dilengkapi laci penyimpanan dan cable management. Tersedia dalam warna oak dan walnut.",
      price: 2499000,
      stock: 10,
      imageUrl: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&h=600&fit=crop",
      categoryId: categories[1].id,
      featured: false,
    },
    {
      name: "Rak Buku Susun 5 Tingkat",
      slug: "rak-buku-susun-5-tingkat",
      description: "Rak buku kayu lapis 5 tingkat dengan kapasitas besar. Desain terbuka memudahkan akses. Cocok untuk ruang baca, kantor, atau ruang keluarga.",
      price: 1499000,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1597006335775-2bde790e64f7?w=600&h=600&fit=crop",
      categoryId: categories[2].id,
      featured: true,
    },
    {
      name: "Lemari Pakaian 4 Pintu",
      slug: "lemari-pakaian-4-pintu",
      description: "Lemari pakaian dengan 4 pintu sliding, dilengkapi gantungan dan rak lipat. Material MDF berkualitas dengan finishing melamin putih elegan.",
      price: 4499000,
      stock: 4,
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
      categoryId: categories[2].id,
      featured: false,
    },
    {
      name: "Lampu Gantung Rotan",
      slug: "lampu-gantung-rotan",
      description: "Lampu gantung anyaman rotan alami, memberikan nuansa hangat dan alami pada ruangan. Diameter 40cm, cocok untuk ruang tamu atau kamar tidur.",
      price: 459000,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop",
      categoryId: categories[3].id,
      featured: false,
    },
    {
      name: "Kasur Busa Inoac 180x200",
      slug: "kasur-busa-inoaac-180x200",
      description: "Kasur busa Inoac original dengan density 23, nyaman dan tidak mudah kempes. Tinggi 20cm, dilengkapi sarung kasur berbahan katun.",
      price: 2999000,
      stock: 7,
      imageUrl: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&h=600&fit=crop",
      categoryId: categories[3].id,
      featured: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Created ${products.length} products`);
  console.log("Seeding complete!");

  console.log("\n--- Login Credentials ---");
  console.log("Username: admin");
  console.log("Password: admin123");
  console.log("------------------------\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
