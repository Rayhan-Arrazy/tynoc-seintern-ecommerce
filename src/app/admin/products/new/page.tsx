'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import type { Category } from '@/types';

const DUMMY_IMAGES = [
  'https://cdn.dummyjson.com/products/images/beauty/essence-mascara-black-pearl/thumbnail.webp',
  'https://cdn.dummyjson.com/products/images/fragrances/cologne-perfume/thumbnail.webp',
  'https://cdn.dummyjson.com/products/images/furniture/office-chair/thumbnail.webp',
  'https://cdn.dummyjson.com/products/images/groceries/orange/thumbnail.webp',
  'https://cdn.dummyjson.com/products/images/home-accessories/asia-map/thumbnail.webp',
];

interface FormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  originalPrice: string;
  categoryId: string;
  category: string;
  stock: string;
  rating: string;
  features: string[];
  tags: string;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  imageUrl: string;
}

const initialFormData: FormData = {
  name: '',
  slug: '',
  description: '',
  price: '',
  originalPrice: '',
  categoryId: '',
  category: '',
  stock: '',
  rating: '0',
  features: [],
  tags: '',
  isFeatured: false,
  isNew: false,
  isOnSale: false,
  imageUrl: '',
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCategories(json.data);
        }
      })
      .catch(() => {});
  }, []);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function updateField(field: keyof FormData, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && typeof value === 'string') {
        next.slug = generateSlug(value);
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function addFeature() {
    const trimmed = newFeature.trim();
    if (trimmed && !form.features.includes(trimmed)) {
      setForm((prev) => ({ ...prev, features: [...prev.features, trimmed] }));
      setNewFeature('');
    }
  }

  function removeFeature(feature: string) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = 'Valid price is required';
    if (!form.stock || isNaN(Number(form.stock)))
      errs.stock = 'Stock is required';
    if (!form.categoryId) errs.categoryId = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const selectedCategory = categories.find((c) => c.id === form.categoryId);
      const payload = {
        name: form.name.trim(),
        slug: form.slug,
        description: form.description.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice
          ? Number(form.originalPrice)
          : Number(form.price),
        categoryId: form.categoryId,
        category: selectedCategory || {
          id: '',
          name: '',
          slug: '',
          description: '',
          image: '',
          productCount: 0,
        },
        stock: Number(form.stock),
        rating: Number(form.rating) || 0,
        features: form.features,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        isFeatured: form.isFeatured,
        isNew: form.isNew,
        isOnSale: form.isOnSale,
        images: form.imageUrl ? [form.imageUrl] : [],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        router.push('/admin/products');
      } else {
        alert(json.error || 'Failed to create product');
      }
    } catch {
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g. Wireless Headphones"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product description..."
          />
        </div>

        {/* Price + Original Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="29.99"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.originalPrice}
              onChange={(e) => updateField('originalPrice', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="39.99"
            />
          </div>
        </div>

        {/* Category + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => updateField('categoryId', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => updateField('stock', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="100"
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating (0-5)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.rating}
            onChange={(e) => updateField('rating', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => updateField('imageUrl', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://cdn.dummyjson.com/products/images/..."
          />
          {form.imageUrl && (
            <div className="mt-2 w-20 h-20 rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs text-gray-500">Suggestions:</span>
            {DUMMY_IMAGES.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => updateField('imageUrl', url)}
                className="text-xs text-blue-600 hover:underline truncate max-w-[150px]"
              >
                {url.split('/').slice(-2, -1)[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Features
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFeature();
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a feature and press Enter"
            />
            <Button type="button" variant="secondary" size="md" onClick={addFeature}>
              Add
            </Button>
          </div>
          {form.features.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => updateField('tags', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="wireless, audio, headphones"
          />
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => updateField('isFeatured', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => updateField('isNew', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            New
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isOnSale}
              onChange={(e) => updateField('isOnSale', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            On Sale
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" size="lg" loading={loading}>
            Create Product
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
