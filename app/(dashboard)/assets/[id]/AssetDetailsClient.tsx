
'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  Download,
  Printer,
  QrCode,
  Calendar,
  FileText,
  Activity,
  ClipboardList,
  Wrench,
  Clock,
  User,
  MapPin,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'allocation', label: 'Allocation History', icon: ClipboardList },
  { id: 'maintenance', label: 'Maintenance History', icon: Wrench },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'audit', label: 'Audits', icon: FileText },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'activity', label: 'Activity Log', icon: Activity },
];

export default function AssetDetailsClient({ asset }: any) {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    const colors: any = {
      available: 'bg-green-100 text-green-700',
      allocated: 'bg-blue-100 text-blue-700',
      under_maintenance: 'bg-orange-100 text-orange-700',
      lost: 'bg-red-100 text-red-700',
      retired: 'bg-gray-100 text-gray-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Back & Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/assets" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            Back to Assets
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
            <QrCode size={18} />
            Download QR
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
            <Printer size={18} />
            Print Label
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90">
            <Edit2 size={18} />
            Edit Asset
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            {asset.image_url ? (
              <img src={asset.image_url} alt={asset.name} className="h-24 w-24 rounded-lg object-cover" />
            ) : (
              <div className="h-24 w-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{asset.name}</h1>
              <p className="text-gray-500 font-mono">{asset.asset_tag}</p>
            </div>
            {getStatusBadge(asset.status)}
          </div>

          {/* Quick Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-premium p-4">
              <div className="text-sm text-gray-500 mb-1">Category</div>
              <div className="font-medium text-gray-900">{asset.category?.name || '—'}</div>
            </div>
            <div className="card-premium p-4">
              <div className="text-sm text-gray-500 mb-1">Condition</div>
              <div className="font-medium text-gray-900 capitalize">{asset.condition || '—'}</div>
            </div>
            <div className="card-premium p-4">
              <div className="text-sm text-gray-500 mb-1">Assigned To</div>
              <div className="font-medium text-gray-900">{asset.assigned_employee?.full_name || '—'}</div>
            </div>
            <div className="card-premium p-4">
              <div className="text-sm text-gray-500 mb-1">Location</div>
              <div className="font-medium text-gray-900">{asset.location?.name || '—'}</div>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="card-premium p-6 flex flex-col items-center justify-center">
          <div className="h-40 w-40 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
            <div className="h-32 w-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              QR CODE
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">Scan to view asset details</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex gap-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <TabContent activeTab={activeTab} asset={asset} />
    </div>
  );
}

// Tab Content
function TabContent({ activeTab, asset }: any) {
  switch (activeTab) {
    case 'overview':
      return <OverviewTab asset={asset} />;
    case 'allocation':
      return <HistoryTab title="Allocation History" icon={User} />;
    case 'maintenance':
      return <HistoryTab title="Maintenance History" icon={Wrench} />;
    case 'bookings':
      return <HistoryTab title="Bookings" icon={Calendar} />;
    case 'audit':
      return <HistoryTab title="Audit History" icon={ClipboardList} />;
    case 'documents':
      return <DocumentsTab />;
    case 'activity':
      return <HistoryTab title="Activity Log" icon={Activity} />;
    default:
      return null;
  }
}

// Overview Tab
function OverviewTab({ asset }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Asset Information</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">Manufacturer</span>
            <span className="font-medium text-gray-900">{asset.manufacturer || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">Model</span>
            <span className="font-medium text-gray-900">{asset.model || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">Serial Number</span>
            <span className="font-medium text-gray-900 font-mono">{asset.serial_number || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">Acquisition Date</span>
            <span className="font-medium text-gray-900">{asset.acquisition_date || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">Acquisition Cost</span>
            <span className="font-medium text-gray-900">{asset.acquisition_cost ? `$${asset.acquisition_cost.toLocaleString()}` : '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">Warranty Expiry</span>
            <span className="font-medium text-gray-900">{asset.warranty_expiry_date || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500">Expected Retirement</span>
            <span className="font-medium text-gray-900">{asset.expected_retirement_date || '—'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Assignment</h3>
          <div className="space-y-3">
            {asset.location && (
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-400" size={18} />
                <span className="text-gray-700">{asset.location.name}</span>
              </div>
            )}
            {asset.department && (
              <div className="flex items-center gap-3">
                <Building2 className="text-gray-400" size={18} />
                <span className="text-gray-700">{asset.department.name}</span>
              </div>
            )}
            {asset.assigned_employee && (
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={18} />
                <span className="text-gray-700">{asset.assigned_employee.full_name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {asset.is_shared && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Shared</span>
            )}
            {asset.is_bookable && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Bookable</span>
            )}
            {!asset.is_shared && !asset.is_bookable && (
              <span className="text-gray-500 text-sm">No tags</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// History Tab
function HistoryTab({ title, icon: Icon }: any) {
  const historyItems = [
    { date: '2024-01-15', description: 'Asset created', user: 'John Doe' },
    { date: '2024-01-20', description: 'Assigned to Jane Smith', user: 'Jane Smith' },
    { date: '2024-02-10', description: 'Maintenance completed', user: 'Mike Johnson' },
  ];

  return (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {historyItems.map((item, i) => (
          <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:pb-0 last:border-0">
            <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
            <div className="flex-1">
              <p className="text-gray-900">{item.description}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <User size={14} />
                <span>{item.user}</span>
                <span>•</span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Documents Tab
function DocumentsTab() {
  const documents = [
    { name: 'Warranty Card.pdf', type: 'PDF', date: '2024-01-15' },
    { name: 'Purchase Invoice.pdf', type: 'PDF', date: '2024-01-14' },
    { name: 'User Manual.pdf', type: 'PDF', date: '2024-01-10' },
  ];

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90">
          <Upload size={18} />
          Upload Document
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 transition-all">
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="text-gray-400" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{doc.name}</p>
              <p className="text-sm text-gray-500">{doc.type} • {doc.date}</p>
            </div>
            <button className="text-gray-500 hover:text-blue-600">
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
