'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import type { Address, PaymentInfo } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { state: authState } = useAuth();
  const { state, getSubtotal } = useCart();
  const { items, loading } = state;

  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentInfo>({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !authState.loading) {
      if (!authState.user) {
        router.push('/auth/login');
      } else if (items.length === 0) {
        router.push('/cart');
      }
    }
  }, [loading, authState.user, authState.loading, items, router]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!shippingAddress.address.trim()) newErrors.address = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!shippingAddress.country.trim()) newErrors.country = 'Country is required';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone is required';

    if (!paymentMethod.cardholderName.trim()) newErrors.cardholderName = 'Name is required';
    if (!paymentMethod.cardNumber.trim() || paymentMethod.cardNumber.replace(/\s/g, '').length < 16)
      newErrors.cardNumber = 'Valid card number is required';
    if (!paymentMethod.expiry.trim() || paymentMethod.expiry.length < 5)
      newErrors.expiry = 'Valid expiry is required';
    if (!paymentMethod.cvv.trim() || paymentMethod.cvv.length < 3)
      newErrors.cvv = 'Valid CVV is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handlePlaceOrder() {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const subtotal = getSubtotal();
      const shipping = subtotal > 50 ? 0 : 9.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authState.user!.id,
          items: items.map((item) => ({
            id: item.id,
            productId: item.productId,
            product: item.product,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress,
          paymentMethod: {
            cardNumber: paymentMethod.cardNumber.slice(-4).padStart(paymentMethod.cardNumber.length, '*'),
            expiry: paymentMethod.expiry,
            cardholderName: paymentMethod.cardholderName,
          },
          subtotal,
          shipping,
          tax,
          total,
        }),
      });

      if (!res.ok) throw new Error('Failed to place order');

      const data = await res.json();
      router.push(`/orders/${data.data.id}`);
    } catch {
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading || authState.loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="mt-3 text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-gray-900" />
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm
            onShippingChange={setShippingAddress}
            onPaymentChange={setPaymentMethod}
            errors={errors}
          />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary onSubmit={handlePlaceOrder} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
