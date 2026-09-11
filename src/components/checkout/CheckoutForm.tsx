'use client';

import { useState } from 'react';
import { MapPin, CreditCard, User, Phone } from 'lucide-react';
import type { Address, PaymentInfo } from '@/types';

interface CheckoutFormProps {
  onShippingChange: (address: Address) => void;
  onPaymentChange: (payment: PaymentInfo) => void;
  errors: Record<string, string>;
}

export default function CheckoutForm({
  onShippingChange,
  onPaymentChange,
  errors,
}: CheckoutFormProps) {
  const [shipping, setShipping] = useState<Address>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const [payment, setPayment] = useState<PaymentInfo>({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: '',
  });

  function handleShippingChange(field: keyof Address, value: string) {
    const updated = { ...shipping, [field]: value };
    setShipping(updated);
    onShippingChange(updated);
  }

  function handlePaymentChange(field: keyof PaymentInfo, value: string) {
    let formatted = value;

    if (field === 'cardNumber') {
      formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .slice(0, 19);
    }

    if (field === 'expiry') {
      formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(?=\d)/, '$1/')
        .slice(0, 5);
    }

    if (field === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    }

    const updated = { ...payment, [field]: formatted };
    setPayment(updated);
    onPaymentChange(updated);
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <div className="space-y-8">
      {/* Shipping Address */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={shipping.fullName}
                onChange={(e) => handleShippingChange('fullName', e.target.value)}
                placeholder="John Doe"
                className={`${inputClass('fullName')} pl-10`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Street Address
            </label>
            <input
              type="text"
              value={shipping.address}
              onChange={(e) => handleShippingChange('address', e.target.value)}
              placeholder="123 Main Street"
              className={inputClass('address')}
            />
            {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
            <input
              type="text"
              value={shipping.city}
              onChange={(e) => handleShippingChange('city', e.target.value)}
              placeholder="New York"
              className={inputClass('city')}
            />
            {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
            <input
              type="text"
              value={shipping.state}
              onChange={(e) => handleShippingChange('state', e.target.value)}
              placeholder="NY"
              className={inputClass('state')}
            />
            {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Zip Code</label>
            <input
              type="text"
              value={shipping.zipCode}
              onChange={(e) => handleShippingChange('zipCode', e.target.value)}
              placeholder="10001"
              className={inputClass('zipCode')}
            />
            {errors.zipCode && <p className="text-xs text-red-600 mt-1">{errors.zipCode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
            <input
              type="text"
              value={shipping.country}
              onChange={(e) => handleShippingChange('country', e.target.value)}
              placeholder="United States"
              className={inputClass('country')}
            />
            {errors.country && <p className="text-xs text-red-600 mt-1">{errors.country}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={shipping.phone}
                onChange={(e) => handleShippingChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className={`${inputClass('phone')} pl-10`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-amber-700">
            This is a demo checkout. No real payment will be processed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cardholder Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={payment.cardholderName}
                onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                placeholder="John Doe"
                className={`${inputClass('cardholderName')} pl-10`}
              />
            </div>
            {errors.cardholderName && (
              <p className="text-xs text-red-600 mt-1">{errors.cardholderName}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Card Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={payment.cardNumber}
                onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                placeholder="4242 4242 4242 4242"
                className={`${inputClass('cardNumber')} pl-10`}
              />
            </div>
            {errors.cardNumber && (
              <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Expiry Date
            </label>
            <input
              type="text"
              value={payment.expiry}
              onChange={(e) => handlePaymentChange('expiry', e.target.value)}
              placeholder="MM/YY"
              className={inputClass('expiry')}
            />
            {errors.expiry && <p className="text-xs text-red-600 mt-1">{errors.expiry}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
            <input
              type="text"
              value={payment.cvv}
              onChange={(e) => handlePaymentChange('cvv', e.target.value)}
              placeholder="123"
              className={inputClass('cvv')}
            />
            {errors.cvv && <p className="text-xs text-red-600 mt-1">{errors.cvv}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
