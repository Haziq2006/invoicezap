'use client';

import { useState, useEffect } from 'react';
import { TemplateManager, InvoiceTemplate, TEMPLATE_CATEGORIES } from '@/lib/templateManager';
import { Search, Plus, Edit, Copy, Trash2, Eye, Download, Upload } from 'lucide-react';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [customizeForm, setCustomizeForm] = useState({
    name: '',
    layout: 'modern',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    headingFont: 'Inter',
    bodyFont: 'Inter'
  });

  const templateManager = TemplateManager.getInstance();

  useEffect(() => {
    const allTemplates = templateManager.getAllTemplates();
    setTemplates(allTemplates);
  }, [templateManager]);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCustomize = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setCustomizeForm({
      name: template.name,
      layout: template.config.layout,
      primaryColor: template.config.colors.primary,
      secondaryColor: template.config.colors.secondary,
      accentColor: template.config.colors.accent,
      headingFont: template.config.fonts.heading,
      bodyFont: template.config.fonts.body
    });
    setIsCustomizeModalOpen(true);
  };

  const handleCreateCustom = () => {
    setCustomizeForm({
      name: '',
      layout: 'modern',
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b',
      headingFont: 'Inter',
      bodyFont: 'Inter'
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveCustomization = () => {
    if (selectedTemplate) {
      // Update existing template
      const updatedTemplate = templateManager.updateTemplate(selectedTemplate.id, {
        name: customizeForm.name,
        config: {
          ...selectedTemplate.config,
          layout: customizeForm.layout as any,
          colors: {
            ...selectedTemplate.config.colors,
            primary: customizeForm.primaryColor,
            secondary: customizeForm.secondaryColor,
            accent: customizeForm.accentColor
          },
          fonts: {
            ...selectedTemplate.config.fonts,
            heading: customizeForm.headingFont,
            body: customizeForm.bodyFont
          }
        }
      });
      
      if (updatedTemplate) {
        const allTemplates = templateManager.getAllTemplates();
        setTemplates(allTemplates);
        setIsCustomizeModalOpen(false);
      }
    }
  };

  const handlePreview = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleCreateTemplate = () => {
    const newTemplate = templateManager.createCustomTemplate(customizeForm.name, {
      layout: customizeForm.layout as any,
      colors: {
        primary: customizeForm.primaryColor,
        secondary: customizeForm.secondaryColor,
        accent: customizeForm.accentColor,
        background: '#ffffff',
        text: '#1e293b'
      },
      fonts: {
        heading: customizeForm.headingFont,
        body: customizeForm.bodyFont,
        accent: customizeForm.headingFont
      }
    });
    
    if (newTemplate) {
      const allTemplates = templateManager.getAllTemplates();
      setTemplates(allTemplates);
      setIsCreateModalOpen(false);
    }
  };

  const handleDuplicate = (template: InvoiceTemplate) => {
    const duplicated = templateManager.duplicateTemplate(template.id, `${template.name} (Copy)`);
    if (duplicated) {
      const allTemplates = templateManager.getAllTemplates();
      setTemplates(allTemplates);
    }
  };

  const handleDelete = (template: InvoiceTemplate) => {
    if (template.type === 'built-in') return;
    
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      const deleted = templateManager.deleteTemplate(template.id);
      if (deleted) {
        const allTemplates = templateManager.getAllTemplates();
        setTemplates(allTemplates);
      }
    }
  };

  const handleExport = (template: InvoiceTemplate) => {
    const exported = templateManager.exportTemplate(template.id);
    if (exported) {
      const dataStr = JSON.stringify(exported, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.name}-template.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const templateData = JSON.parse(e.target?.result as string);
          const imported = templateManager.importTemplate(templateData);
          if (imported) {
            const allTemplates = templateManager.getAllTemplates();
            setTemplates(allTemplates);
            alert('Template imported successfully!');
          }
        } catch (error) {
          alert('Failed to import template. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Invoice Templates</h1>
          <p className="mt-2 text-gray-600">
            Choose from professional templates or create your own custom design
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleCreateCustom}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="text-sm text-gray-600">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{template.category}</div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">{template.name}</span>
                  {template.type === 'built-in' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Built-in
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(template)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </button>
                  
                  <button
                    onClick={() => handleCustomize(template)}
                    className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    title="Customize"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    title="Duplicate"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  
                  <button
                    onClick={() => handleExport(template)}
                    className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    title="Export"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                  
                  {template.type !== 'built-in' && (
                    <button
                      onClick={() => handleDelete(template)}
                      className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or create a new custom template.</p>
          </div>
        )}
      </div>

      {/* Customize Modal */}
      {isCustomizeModalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Customize Template</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={customizeForm.name}
                    onChange={(e) => setCustomizeForm({...customizeForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layout Style
                  </label>
                  <select
                    value={customizeForm.layout}
                    onChange={(e) => setCustomizeForm({...customizeForm, layout: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={customizeForm.primaryColor}
                      onChange={(e) => setCustomizeForm({...customizeForm, primaryColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      value={customizeForm.secondaryColor}
                      onChange={(e) => setCustomizeForm({...customizeForm, secondaryColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accent Color
                    </label>
                    <input
                      type="color"
                      value={customizeForm.accentColor}
                      onChange={(e) => setCustomizeForm({...customizeForm, accentColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heading Font
                    </label>
                    <select
                      value={customizeForm.headingFont}
                      onChange={(e) => setCustomizeForm({...customizeForm, headingFont: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Body Font
                    </label>
                    <select
                      value={customizeForm.bodyFont}
                      onChange={(e) => setCustomizeForm({...customizeForm, bodyFont: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsCustomizeModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomization}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create Custom Template</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={customizeForm.name}
                    onChange={(e) => setCustomizeForm({...customizeForm, name: e.target.value})}
                    placeholder="Enter template name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layout Style
                  </label>
                  <select
                    value={customizeForm.layout}
                    onChange={(e) => setCustomizeForm({...customizeForm, layout: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={customizeForm.primaryColor}
                      onChange={(e) => setCustomizeForm({...customizeForm, primaryColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      value={customizeForm.secondaryColor}
                      onChange={(e) => setCustomizeForm({...customizeForm, secondaryColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accent Color
                    </label>
                    <input
                      type="color"
                      value={customizeForm.accentColor}
                      onChange={(e) => setCustomizeForm({...customizeForm, accentColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heading Font
                    </label>
                    <select
                      value={customizeForm.headingFont}
                      onChange={(e) => setCustomizeForm({...customizeForm, headingFont: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Body Font
                    </label>
                    <select
                      value={customizeForm.bodyFont}
                      onChange={(e) => setCustomizeForm({...customizeForm, bodyFont: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  disabled={!customizeForm.name.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Template Preview: {selectedTemplate.name}</h2>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {/* Template Preview */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-white shadow-lg mx-auto max-w-2xl p-8">
                  {/* Invoice Preview */}
                  <div style={{ 
                    fontFamily: selectedTemplate.config.fonts.heading,
                    color: selectedTemplate.config.colors.text || '#000'
                  }}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h1 className="text-3xl font-bold" style={{ color: selectedTemplate.config.colors.primary }}>
                          Your Company Name
                        </h1>
                        <p className="text-gray-600 mt-2">
                          123 Business Street<br/>
                          London, UK, SW1A 1AA<br/>
                          hello@yourcompany.com
                        </p>
                      </div>
                      <div className="text-right">
                        <h2 className="text-2xl font-bold" style={{ color: selectedTemplate.config.colors.secondary }}>
                          INVOICE
                        </h2>
                        <p className="text-gray-600 mt-2">
                          Invoice #: INV-001<br/>
                          Date: {new Date().toLocaleDateString()}<br/>
                          Due: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="mb-8">
                      <h3 className="font-semibold mb-2" style={{ color: selectedTemplate.config.colors.primary }}>
                        Bill To:
                      </h3>
                      <p className="text-gray-700">
                        Sample Client<br/>
                        Client Company Ltd<br/>
                        456 Client Road<br/>
                        Manchester, UK, M1 1AA
                      </p>
                    </div>

                    {/* Line Items */}
                    <div className="mb-8">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr style={{ backgroundColor: selectedTemplate.config.colors.primary, color: 'white' }}>
                            <th className="text-left p-3 font-semibold">Description</th>
                            <th className="text-center p-3 font-semibold">Qty</th>
                            <th className="text-right p-3 font-semibold">Rate</th>
                            <th className="text-right p-3 font-semibold">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">Web Design Services</td>
                            <td className="text-center p-3">10</td>
                            <td className="text-right p-3">£50.00</td>
                            <td className="text-right p-3">£500.00</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Development & Testing</td>
                            <td className="text-center p-3">20</td>
                            <td className="text-right p-3">£40.00</td>
                            <td className="text-right p-3">£800.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-8">
                      <div className="w-64">
                        <div className="flex justify-between py-2">
                          <span>Subtotal:</span>
                          <span>£1,300.00</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span>VAT (20%):</span>
                          <span>£260.00</span>
                        </div>
                        <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg"
                             style={{ color: selectedTemplate.config.colors.primary }}>
                          <span>Total:</span>
                          <span>£1,560.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600 border-t pt-4">
                      <p>Thank you for your business!</p>
                      <p>Payment terms: Net 30 days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    handleCustomize(selectedTemplate);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Customize This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
