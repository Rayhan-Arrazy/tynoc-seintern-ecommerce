import { Package, Settings, CreditCard, Bell, LogOut } from 'lucide-react';
import Link from 'next/link';

const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'DU',
  memberSince: 'January 2024',
};

const ACCOUNT_SECTIONS = [
  { icon: Package, label: 'Order History', description: 'View your past orders', href: '#' },
  { icon: CreditCard, label: 'Payment Methods', description: 'Manage your payment options', href: '#' },
  { icon: Bell, label: 'Notifications', description: 'Configure alert preferences', href: '#' },
  { icon: Settings, label: 'Settings', description: 'Account preferences and security', href: '#' },
];

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
            {DEMO_USER.avatar}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{DEMO_USER.name}</h2>
            <p className="text-gray-500">{DEMO_USER.email}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {DEMO_USER.memberSince}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {ACCOUNT_SECTIONS.map((section) => (
          <Link
            key={section.label}
            href={section.href}
            className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <section.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{section.label}</h3>
              <p className="text-sm text-gray-500">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
        <div className="text-center py-10">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">No orders yet</p>
          <p className="text-sm text-gray-400 mb-4">When you place an order, it will appear here.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>

      <button className="mt-6 flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}
