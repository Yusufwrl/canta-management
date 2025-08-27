export interface Product {
  id: string;
  code: string; // Ürün kodu (örnek: 001, 002, etc.)
  name: string;
  brand: string;
  color: string;
  category: 'sirt-cantasi' | 'okul-cantasi' | 'el-cantasi' | 'laptop-cantasi' | 'diger';
  model?: string; // Optional yapıldı
  description?: string;
  purchasePrice: number; // Alış fiyatı
  salePrice: number; // Satış fiyatı
  suggestedSalePrice?: number; // Önerilen satış fiyatı
  images: string[]; // Resim dosya yolları
  inStock: boolean;
  barcode?: string; // Barkod alanı eklendi
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: 'gelir' | 'gider';
  amount: number;
  description: string;
  category?: string;
  productId?: string; // Ürün satışı için
  date: Date;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export interface FilterOptions {
  search?: string;
  brand?: string;
  color?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  lowStockProducts: number;
}
