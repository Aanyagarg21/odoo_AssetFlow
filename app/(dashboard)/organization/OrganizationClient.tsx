
'use client';

import { useState } from 'react';
import {
  Building2,
  Package,
  Users,
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Check,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Tabs
const tabs = [
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'categories', label: 'Asset Categories', icon: Package },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'locations', label: 'Locations & Desks', icon: MapPin },
];

export default function OrganizationClient({
  profile,
  departments,
  categories,
  employees,
  locations,
  desks
}: any) {
  const [activeTab, setActiveTab] = useState('departments');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [slideOverMode, setSlideOverMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Handlers for opening/closing slide-over
  const openCreateSlideOver = () => {
    setSelectedItem(null);
    setSlideOverMode('create');
    setIsSlideOverOpen(true);
  };

  const openEditSlideOver = (item: any) => {
    setSelectedItem(item);
    setSlideOverMode('edit');
    setIsSlideOverOpen(true);
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'departments':
        return <DepartmentsTab
          departments={departments}
          employees={employees}
          searchTerm={searchTerm}
          onOpenCreate={openCreateSlideOver}
          onOpenEdit={openEditSlideOver}
        />;
      case 'categories':
        return <CategoriesTab
          categories={categories}
          searchTerm={searchTerm}
          onOpenCreate={openCreateSlideOver}
          onOpenEdit={openEditSlideOver}
        />;
      case 'employees':
        return <EmployeesTab
          employees={employees}
          departments={departments}
          searchTerm={searchTerm}
          onOpenCreate={openCreateSlideOver}
          onOpenEdit={openEditSlideOver}
        />;
      case 'locations':
        return <LocationsDesksTab
          locations={locations}
          desks={desks}
          employees={employees}
          searchTerm={searchTerm}
          onOpenCreate={openCreateSlideOver}
          onOpenEdit={openEditSlideOver}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Setup</h1>
        <p className="text-gray-600">Manage your departments, employees, categories, and locations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
            <Download size={18} />
            Import
          </button>
          <button
            onClick={openCreateSlideOver}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90"
          >
            <Plus size={18} />
            New
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Slide-over Form */}
      <AnimatePresence>
        {isSlideOverOpen && (
          <SlideOverForm
            mode={slideOverMode}
            activeTab={activeTab}
            item={selectedItem}
            departments={departments}
            employees={employees}
            locations={locations}
            onClose={() => setIsSlideOverOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Departments Tab
function DepartmentsTab({ departments, employees, searchTerm, onOpenCreate, onOpenEdit }: any) {
  const filteredDepartments = departments?.filter((d: any) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Parent</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Head</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employees</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDepartments.map((dept: any) => (
              <tr key={dept.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <span className="font-medium text-gray-900">{dept.name}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-600 font-mono">{dept.code}</span>
                </td>
                <td className="py-4 px-4">
                  {dept.parent_department ? (
                    <span className="text-gray-700">{dept.parent_department.name}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {dept.department_head ? (
                    <span className="text-gray-700">{dept.department_head.full_name}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {employees?.filter((e: any) => e.department_id === dept.id).length || 0}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dept.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {dept.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => onOpenEdit(dept)} className="text-gray-500 hover:text-blue-600">
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Categories Tab
function CategoriesTab({ categories, searchTerm, onOpenCreate, onOpenEdit }: any) {
  const filteredCategories = categories?.filter((c: any) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Warranty</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCategories.map((cat: any) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <span className="font-medium text-gray-900">{cat.name}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-600 font-mono">{cat.code}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-700">{cat.default_warranty_months} months</span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cat.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => onOpenEdit(cat)} className="text-gray-500 hover:text-blue-600">
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Employees Tab
function EmployeesTab({ employees, departments, searchTerm, onOpenCreate, onOpenEdit }: any) {
  const filteredEmployees = employees?.filter((e: any) =>
    e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRoleBadge = (role: string) => {
    const colors: any = {
      admin: 'bg-purple-100 text-purple-700',
      asset_manager: 'bg-blue-100 text-blue-700',
      department_head: 'bg-green-100 text-green-700',
      employee: 'bg-gray-100 text-gray-700',
      auditor: 'bg-orange-100 text-orange-700',
      technician: 'bg-cyan-100 text-cyan-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role] || colors.employee}`}>
        {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employee</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEmployees.map((emp: any) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center font-semibold text-blue-700">
                      {emp.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{emp.full_name}</p>
                      <p className="text-xs text-gray-500">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-600 font-mono">{emp.employee_code || '—'}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-700">{emp.department?.name || '—'}</span>
                </td>
                <td className="py-4 px-4">{getRoleBadge(emp.role)}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    emp.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => onOpenEdit(emp)} className="text-gray-500 hover:text-blue-600">
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Locations & Desks Tab
function LocationsDesksTab({ locations, desks, employees, searchTerm, onOpenCreate, onOpenEdit }: any) {
  const filteredLocations = locations?.filter((loc: any) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.building?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Locations List */}
      <div className="lg:col-span-1 card-premium overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-100">Locations</h3>
        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {filteredLocations.map((loc: any) => (
            <div key={loc.id} className="p-4 hover:bg-gray-50">
              <p className="font-medium text-gray-900">{loc.name}</p>
              <p className="text-sm text-gray-500">
                {loc.building} {loc.floor ? `• Floor ${loc.floor}` : ''}
                {loc.room ? `• Room ${loc.room}` : ''}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {desks?.filter((d: any) => d.location_id === loc.id).length} desks
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Desks List */}
      <div className="lg:col-span-2 card-premium overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-100">Desks</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Desk</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assigned To</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {desks?.map((desk: any) => (
                <tr key={desk.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{desk.desk_code}</span>
                    {desk.label && <span className="text-gray-500 ml-2">({desk.label})</span>}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-700">{desk.location?.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    {desk.assigned_employee ? (
                      <span className="text-gray-700">{desk.assigned_employee.full_name}</span>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button onClick={() => onOpenEdit(desk)} className="text-gray-500 hover:text-blue-600">
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Slide Over Form Component
function SlideOverForm({ mode, activeTab, item, departments, employees, locations, onClose }: any) {
  const [formData, setFormData] = useState<any>(item || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomFields, setShowCustomFields] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'departments':
        return mode === 'create' ? 'Create Department' : 'Edit Department';
      case 'categories':
        return mode === 'create' ? 'Create Category' : 'Edit Category';
      case 'employees':
        return mode === 'create' ? 'Invite Employee' : 'Edit Employee';
      case 'locations':
        return mode === 'create' ? 'Create Location' : 'Edit Location';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />
      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl border-l border-gray-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {activeTab === 'departments' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g. Engineering"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g. ENG"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Department</label>
                  <select
                    value={formData.parent_department_id || ''}
                    onChange={(e) => setFormData({ ...formData, parent_department_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">None</option>
                    {departments?.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Head</label>
                  <select
                    value={formData.department_head_id || ''}
                    onChange={(e) => setFormData({ ...formData, department_head_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">None</option>
                    {employees?.map((e: any) => (
                      <option key={e.id} value={e.id}>{e.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active !== false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
              </div>
            </>
          )}

          {activeTab === 'categories' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g. Electronics"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g. ELEC"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Warranty (Months)</label>
                <input
                  type="number"
                  value={formData.default_warranty_months || 12}
                  onChange={(e) => setFormData({ ...formData, default_warranty_months: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomFields(!showCustomFields)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  {showCustomFields ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showCustomFields ? 'Hide Custom Fields' : 'Configure Custom Fields'}
                </button>
              </div>

              {showCustomFields && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Custom fields configuration in JSON format:</p>
                  <textarea
                    value={formData.custom_fields ? JSON.stringify(formData.custom_fields, null, 2) : ''}
                    onChange={(e) => {
                      try {
                        setFormData({ ...formData, custom_fields: JSON.parse(e.target.value) });
                      } catch { }
                    }}
                    className="w-full h-40 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm"
                    placeholder={`{"processor":"text","RAM":"number","storage":"text"}`}
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active !== false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
              </div>
            </>
          )}

          {activeTab === 'employees' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code</label>
                  <input
                    type="text"
                    value={formData.employee_code || ''}
                    onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.department_id || ''}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">None</option>
                    {departments?.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {mode === 'edit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role || 'employee'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="employee">Employee</option>
                    <option value="department_head">Department Head</option>
                    <option value="asset_manager">Asset Manager</option>
                    <option value="auditor">Auditor</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
            </>
          )}

          {/* Form Actions */}
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
