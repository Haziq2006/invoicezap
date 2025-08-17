'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Building,
  User,
  Filter
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'

interface Client {
  id: string
  name: string
  email: string
  company: string
  phone: string
  address: string
  totalInvoices: number
  totalRevenue: number
  lastInvoiceDate: string | null
  createdAt: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCompany, setFilterCompany] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - replace with Supabase
  useEffect(() => {
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@acmecorp.com',
        company: 'Acme Corporation',
        phone: '+44 20 1234 5678',
        address: '123 Business St, London, UK',
        totalInvoices: 12,
        totalRevenue: 8500,
        lastInvoiceDate: '2024-01-15',
        createdAt: '2023-06-01'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@techstart.com',
        company: 'TechStart Inc',
        phone: '+44 20 8765 4321',
        address: '456 Innovation Ave, Manchester, UK',
        totalInvoices: 8,
        totalRevenue: 6200,
        lastInvoiceDate: '2024-01-10',
        createdAt: '2023-08-15'
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@designstudio.com',
        company: 'Design Studio',
        phone: '+44 20 5555 1234',
        address: '789 Creative Lane, Birmingham, UK',
        totalInvoices: 15,
        totalRevenue: 12400,
        lastInvoiceDate: '2024-01-20',
        createdAt: '2023-05-10'
      }
    ]
    setClients(mockClients)
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    address: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editingClient) {
        // Update existing client
        const updatedClients = clients.map(client => 
          client.id === editingClient.id 
            ? { ...client, ...formData }
            : client
        )
        setClients(updatedClients)
        toast.success('Client updated successfully!')
      } else {
        // Add new client
        const newClient: Client = {
          id: Date.now().toString(),
          ...formData,
          totalInvoices: 0,
          totalRevenue: 0,
          lastInvoiceDate: null,
          createdAt: new Date().toISOString().split('T')[0]
        }
        setClients([...clients, newClient])
        toast.success('Client added successfully!')
      }
      
      setShowAddModal(false)
      setEditingClient(null)
      setFormData({ name: '', email: '', company: '', phone: '', address: '' })
    } catch (error) {
      toast.error('Failed to save client. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      company: client.company,
      phone: client.phone,
      address: client.address
    })
    setShowAddModal(true)
  }

  const handleDelete = async (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        const updatedClients = clients.filter(client => client.id !== clientId)
        setClients(updatedClients)
        toast.success('Client deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete client. Please try again.')
      }
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCompany = filterCompany === 'all' || client.company === filterCompany
    return matchesSearch && matchesCompany
  })

  const companies = Array.from(new Set(clients.map(client => client.company)))

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Client</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="card mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="all">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{client.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Building className="h-4 w-4" />
                      <span>{client.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-gray-400 hover:text-blue-600 p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <Building className="h-4 w-4 mt-0.5" />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-gray-900">{client.totalInvoices}</div>
                      <div className="text-gray-500">Invoices</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">£{client.totalRevenue.toLocaleString()}</div>
                      <div className="text-gray-500">Revenue</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {client.lastInvoiceDate ? new Date(client.lastInvoiceDate).toLocaleDateString() : 'Never'}
                      </div>
                      <div className="text-gray-500">Last Invoice</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/invoice/new?client=${client.id}`}
                    className="btn-primary w-full text-center"
                  >
                    Create Invoice
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCompany !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first client.'
                }
              </p>
              {!searchTerm && filterCompany === 'all' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary"
                >
                  Add Your First Client
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit Client Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    required
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    required
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="input-field"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-field"
                    placeholder="+44 20 1234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="input-field"
                    rows={3}
                    placeholder="Full address"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingClient(null)
                      setFormData({ name: '', email: '', company: '', phone: '', address: '' })
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex-1"
                  >
                    {isLoading ? 'Saving...' : (editingClient ? 'Update Client' : 'Add Client')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
