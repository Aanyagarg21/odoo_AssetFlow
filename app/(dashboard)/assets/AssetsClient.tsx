
'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Upload,
  QrCode,
  Grid,
  List,
  Filter,
  X,
  Eye,
  Edit2,
  MoreHorizontal,
  Image as ImageIcon,
  FileText,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AssetsClient({
  profile,
  assets,
  categories,
  departments,
  locations,
  employees
}: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({
    category: '',
    status: '',
    condition: '',
    department: '',
    location: '',
    assignedEmployee: '',
    isShared: '',
    isBookable: '',
  });
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  // Filter assets
  const filteredAssets = assets?.filter((asset: any) => {
    const matchesSearch =
      asset.asset_tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filters.category || asset.category_id === filters.category;
    const matchesStatus = !filters.status || asset.status === filters.status;
    const matchesCondition = !filters.condition || asset.condition === filters.condition;
    const matchesDepartment = !filters.department || asset.department_id === filters.department;
    const matchesLocation = !filters.location || asset.location_id === filters.location;
    const matchesAssigned = !filters.assignedEmployee || asset.assigned_employee_id === filters.assignedEmployee;
    const matchesShared = filters.isShared === '' || asset.is_shared === (filters.isShared === 'true');
    const matchesBookable = filters.isBookable === '' || asset.is_bookable === (filters.isBookable === 'true');

    return matchesSearch && matchesCategory && matchesStatus && matchesCondition && matchesDepartment && matchesLocation && matchesAssigned && matchesShared && matchesBookable;
  }) || [];

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      condition: '',
      department: '',
      location: '',
      assignedEmployee: '',
      isShared: '',
      isBookable: '',
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assets</h1>
          <p className="text-gray-600">{assets?.length} total assets in your organization</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
            <QrCode size={18} />
            Scan QR
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
            <Upload size={18} />
            Import
          </button>
          <button
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90"
          >
            <Plus size={18} />
            Register Asset
          </button>
        </div>
      </div>

      {/* Search & View Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search assets by tag, name, serial number, manufacturer, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              showFilters ? 'bg-blue-100 text-blue-700 border-blue-200' : 'text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            Filters
          </button>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="card-premium overflow-hidden mb-6"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">All</option>
                    {categories?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">All</option>
                    <option value="available">Available</option>
                    <option value="allocated">Allocated</option>
                    <option value="under_maintenance">Under Maintenance</option>
                    <option value="lost">Lost</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">All</option>
                    <option value="new">New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="damaged">Damaged</option>
                    <option value="unusable">Unusable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">All</option>
                    {departments?.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assets View */}
      {viewMode === 'table' ? (
        <AssetTable assets={filteredAssets} />
      ) : (
        <AssetGrid assets={filteredAssets} />
      )}

      {/* Asset Registration Slide Over */}
      <AnimatePresence>
        {isSlideOverOpen && (
          <AssetRegistrationForm onClose={() => setIsSlideOverOpen(false)} categories={categories} departments={departments} locations={locations} employees={employees} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Asset Table
function AssetTable({ assets }: any) {
  const getStatusBadge = (status: string) => {
    const colors: any = {
      available: 'bg-green-100 text-green-700',
      allocated: 'bg-blue-100 text-blue-700',
      under_maintenance: 'bg-orange-100 text-orange-700',
      lost: 'bg-red-100 text-red-700',
      retired: 'bg-gray-100 text-gray-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Asset</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assigned</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Condition</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assets.map((asset: any) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {asset.image_url ? (
                      <img src={asset.image_url} alt={asset.name} className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{asset.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{asset.asset_tag}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-700">{asset.category?.name}</span>
                </td>
                <td className="py-4 px-4">
                  {asset.assigned_employee ? (
                    <span className="text-gray-700">{asset.assigned_employee.full_name}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-4 px-4">{getStatusBadge(asset.status)}</td>
                <td className="py-4 px-4">
                  <span className="text-gray-700 capitalize">{asset.condition}</span>
                </td>
                <td className="py-4 px-4">
                  {asset.location ? (
                    <span className="text-gray-700">{asset.location.name}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/assets/${asset.id}`} className="text-gray-500 hover:text-blue-600">
                      <Eye size={18} />
                    </Link>
                    <button className="text-gray-500 hover:text-blue-600">
                      <Edit2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Asset Grid
function AssetGrid({ assets }: any) {
  const getStatusBadge = (status: string) => {
    const colors: any = {
      available: 'bg-green-100 text-green-700',
      allocated: 'bg-blue-100 text-blue-700',
      under_maintenance: 'bg-orange-100 text-orange-700',
      lost: 'bg-red-100 text-red-700',
      retired: 'bg-gray-100 text-gray-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets.map((asset: any) => (
        <Link href={`/assets/${asset.id}`} key={asset.id}>
          <div className="card-premium hover:shadow-lg transition-all group">
            {asset.image_url ? (
              <img src={asset.image_url} alt={asset.name} className="w-full h-48 object-cover rounded-t-lg" />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{asset.name}</h3>
                {getStatusBadge(asset.status)}
              </div>
              <p className="text-xs text-gray-500 font-mono mb-3">{asset.asset_tag}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {asset.category && <span>{asset.category.name}</span>}
                {asset.location && (
                  <>
                    <span>•</span>
                    <span>{asset.location.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Asset Registration Form
function AssetRegistrationForm({ onClose, categories, departments, locations, employees }: any) {
  const [formData, setFormData] = useState<any>({
    name: '',
    category_id: '',
    manufacturer: '',
    model: '',
    serial_number: '',
    acquisition_date: '',
    acquisition_cost: '',
    warranty_expiry_date: '',
    condition: 'good',
    location_id: '',
    department_id: '',
    is_shared: false,
    is_bookable: false,
    expected_retirement_date: '',
    next_maintenance_date: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-3xl bg-white shadow-2xl border-l border-gray-200 overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Register New Asset</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Select a category</option>
                {categories?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="damaged">Damaged</option>
                <option value="unusable">Unusable</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
              <input
                type="text"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Cost</label>
              <input
                type="number"
                value={formData.acquisition_cost}
                onChange={(e) => setFormData({ ...formData, acquisition_cost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Date</label>
              <input
                type="date"
                value={formData.acquisition_date}
                onChange={(e) => setFormData({ ...formData, acquisition_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry</label>
              <input
                type="date"
                value={formData.warranty_expiry_date}
                onChange={(e) => setFormData({ ...formData, warranty_expiry_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Date</label>
              <input
                type="date"
                value={formData.next_maintenance_date}
                onChange={(e) => setFormData({ ...formData, next_maintenance_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={formData.location_id}
                onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">Select location</option>
                {locations?.map((l: any) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">Select department</option>
                {departments?.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_shared}
                onChange={(e) => setFormData({ ...formData, is_shared: e.target.checked })}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">Shared Resource</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_bookable}
                onChange={(e) => setFormData({ ...formData, is_bookable: e.target.checked })}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">Bookable</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90"
            >
              {isSubmitting ? 'Registering...' : 'Register Asset'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
