export interface InvoiceTemplate {
  id: string;
  name: string;
  type: 'built-in' | 'custom' | 'marketplace';
  category: 'professional' | 'creative' | 'minimal' | 'corporate';
  thumbnail: string;
  config: TemplateConfig;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateConfig {
  layout: 'modern' | 'classic' | 'minimal' | 'creative';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  sections: {
    header: boolean;
    companyInfo: boolean;
    clientInfo: boolean;
    lineItems: boolean;
    totals: boolean;
    footer: boolean;
    terms: boolean;
  };
  branding: {
    logo: boolean;
    companyName: boolean;
    tagline: boolean;
  };
}

export class TemplateManager {
  private static instance: TemplateManager;
  private templates: Map<string, InvoiceTemplate> = new Map();

  private constructor() {
    this.initializeBuiltInTemplates();
  }

  static getInstance(): TemplateManager {
    if (!TemplateManager.instance) {
      TemplateManager.instance = new TemplateManager();
    }
    return TemplateManager.instance;
  }

  // Static methods for API usage
  static async getTemplateById(id: string): Promise<InvoiceTemplate | null> {
    const instance = TemplateManager.getInstance();
    return instance.getTemplateById(id) || null;
  }

  static async getAllTemplates(): Promise<InvoiceTemplate[]> {
    const instance = TemplateManager.getInstance();
    return instance.getAllTemplates();
  }

  static async createTemplate(templateData: Omit<InvoiceTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<InvoiceTemplate> {
    const instance = TemplateManager.getInstance();
    return instance.createCustomTemplate(templateData.name, templateData.config);
  }

  static async updateTemplate(id: string, updates: Partial<InvoiceTemplate>): Promise<InvoiceTemplate> {
    const instance = TemplateManager.getInstance();
    const result = instance.updateTemplate(id, updates);
    if (!result) {
      throw new Error('Template not found or update failed');
    }
    return result;
  }

  static async deleteTemplate(id: string): Promise<boolean> {
    const instance = TemplateManager.getInstance();
    return instance.deleteTemplate(id);
  }

  static async duplicateTemplate(id: string, newName: string): Promise<InvoiceTemplate> {
    const instance = TemplateManager.getInstance();
    const result = instance.duplicateTemplate(id, newName);
    if (!result) {
      throw new Error('Template not found or duplication failed');
    }
    return result;
  }

  static async exportTemplate(id: string): Promise<any> {
    const instance = TemplateManager.getInstance();
    return instance.exportTemplate(id);
  }

  static async importTemplate(templateData: any, userId?: string): Promise<InvoiceTemplate> {
    const instance = TemplateManager.getInstance();
    const result = instance.importTemplate(templateData);
    if (!result) {
      throw new Error('Template import failed');
    }
    return result;
  }

  static async getUserTemplates(userId: string, filters?: { category?: string; search?: string }): Promise<InvoiceTemplate[]> {
    const instance = TemplateManager.getInstance();
    // For now, return all templates since we don't have user-specific templates yet
    // TODO: Implement user-specific template filtering when Supabase is integrated
    return instance.getAllTemplates();
  }

  static async getBuiltInTemplates(filters?: { category?: string; search?: string }): Promise<InvoiceTemplate[]> {
    const instance = TemplateManager.getInstance();
    return instance.getAllTemplates().filter(template => template.type === 'built-in');
  }

  private initializeBuiltInTemplates() {
    const builtInTemplates: InvoiceTemplate[] = [
      {
        id: 'modern-professional',
        name: 'Modern Professional',
        type: 'built-in',
        category: 'professional',
        thumbnail: '/templates/modern-professional.png',
        config: {
          layout: 'modern',
          colors: {
            primary: '#2563eb',
            secondary: '#64748b',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1e293b'
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter',
            accent: 'Inter'
          },
          sections: {
            header: true,
            companyInfo: true,
            clientInfo: true,
            lineItems: true,
            totals: true,
            footer: true,
            terms: true
          },
          branding: {
            logo: true,
            companyName: true,
            tagline: false
          }
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        type: 'built-in',
        category: 'minimal',
        thumbnail: '/templates/minimal-clean.png',
        config: {
          layout: 'minimal',
          colors: {
            primary: '#000000',
            secondary: '#6b7280',
            accent: '#000000',
            background: '#ffffff',
            text: '#111827'
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter',
            accent: 'Inter'
          },
          sections: {
            header: false,
            companyInfo: true,
            clientInfo: true,
            lineItems: true,
            totals: true,
            footer: false,
            terms: false
          },
          branding: {
            logo: false,
            companyName: true,
            tagline: false
          }
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'creative-bold',
        name: 'Creative Bold',
        type: 'built-in',
        category: 'creative',
        thumbnail: '/templates/creative-bold.png',
        config: {
          layout: 'creative',
          colors: {
            primary: '#7c3aed',
            secondary: '#a855f7',
            accent: '#f59e0b',
            background: '#f8fafc',
            text: '#1e293b'
          },
          fonts: {
            heading: 'Poppins',
            body: 'Inter',
            accent: 'Poppins'
          },
          sections: {
            header: true,
            companyInfo: true,
            clientInfo: true,
            lineItems: true,
            totals: true,
            footer: true,
            terms: true
          },
          branding: {
            logo: true,
            companyName: true,
            tagline: true
          }
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    builtInTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Get all templates
  getAllTemplates(): InvoiceTemplate[] {
    return Array.from(this.templates.values());
  }

  // Get templates by category
  getTemplatesByCategory(category: string): InvoiceTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  // Get active templates
  getActiveTemplates(): InvoiceTemplate[] {
    return this.getAllTemplates().filter(template => template.isActive);
  }

  // Get template by ID
  getTemplateById(id: string): InvoiceTemplate | undefined {
    return this.templates.get(id);
  }

  // Create custom template
  createCustomTemplate(name: string, config: Partial<TemplateConfig>): InvoiceTemplate {
    const template: InvoiceTemplate = {
      id: `custom-${Date.now()}`,
      name,
      type: 'custom',
      category: 'professional',
      thumbnail: '/templates/custom-template.png',
      config: {
        layout: 'modern',
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#f59e0b',
          background: '#ffffff',
          text: '#1e293b'
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter',
          accent: 'Inter'
        },
        sections: {
          header: true,
          companyInfo: true,
          clientInfo: true,
          lineItems: true,
          totals: true,
          footer: true,
          terms: true
        },
        branding: {
          logo: true,
          companyName: true,
          tagline: false
        },
        ...config
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.templates.set(template.id, template);
    return template;
  }

  // Update template
  updateTemplate(id: string, updates: Partial<InvoiceTemplate>): InvoiceTemplate | null {
    const template = this.templates.get(id);
    if (!template) return null;

    const updatedTemplate: InvoiceTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date()
    };

    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  // Delete template
  deleteTemplate(id: string): boolean {
    const template = this.templates.get(id);
    if (!template || template.type === 'built-in') return false;

    return this.templates.delete(id);
  }

  // Duplicate template
  duplicateTemplate(id: string, newName: string): InvoiceTemplate | null {
    const template = this.templates.get(id);
    if (!template) return null;

    const duplicatedTemplate: InvoiceTemplate = {
      ...template,
      id: `copy-${Date.now()}`,
      name: newName,
      type: 'custom',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.templates.set(duplicatedTemplate.id, duplicatedTemplate);
    return duplicatedTemplate;
  }

  // Import template from external source
  importTemplate(templateData: any): InvoiceTemplate | null {
    try {
      // Validate template data
      if (!templateData.name || !templateData.config) {
        throw new Error('Invalid template data');
      }

      const template: InvoiceTemplate = {
        id: `imported-${Date.now()}`,
        name: templateData.name,
        type: 'custom',
        category: templateData.category || 'professional',
        thumbnail: templateData.thumbnail || '/templates/imported-template.png',
        config: templateData.config,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.templates.set(template.id, template);
      return template;
    } catch (error) {
      console.error('Failed to import template:', error);
      return null;
    }
  }

  // Export template
  exportTemplate(id: string): any | null {
    const template = this.templates.get(id);
    if (!template) return null;

    return {
      name: template.name,
      category: template.category,
      thumbnail: template.thumbnail,
      config: template.config
    };
  }

  // Get template preview HTML
  generateTemplatePreview(template: InvoiceTemplate, sampleData: any): string {
    // This would generate HTML preview of the template
    // Implementation would depend on the template engine
    return `<div class="template-preview">Template preview for ${template.name}</div>`;
  }

  // Validate template configuration
  validateTemplateConfig(config: TemplateConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.layout) errors.push('Layout is required');
    if (!config.colors.primary) errors.push('Primary color is required');
    if (!config.fonts.heading) errors.push('Heading font is required');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Template categories and their descriptions
export const TEMPLATE_CATEGORIES = {
  professional: {
    name: 'Professional',
    description: 'Clean, business-focused designs suitable for corporate use',
    icon: '💼'
  },
  creative: {
    name: 'Creative',
    description: 'Bold, artistic designs for creative businesses',
    icon: '🎨'
  },
  minimal: {
    name: 'Minimal',
    description: 'Simple, clean designs focusing on content',
    icon: '✨'
  },
  corporate: {
    name: 'Corporate',
    description: 'Traditional business designs for established companies',
    icon: '🏢'
  }
};

// Default template configurations
export const DEFAULT_TEMPLATE_CONFIGS = {
  modern: {
    layout: 'modern',
    colors: { primary: '#2563eb', secondary: '#64748b', accent: '#f59e0b' },
    fonts: { heading: 'Inter', body: 'Inter', accent: 'Inter' }
  },
  classic: {
    layout: 'classic',
    colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#dc2626' },
    fonts: { heading: 'Georgia', body: 'Times New Roman', accent: 'Georgia' }
  },
  minimal: {
    layout: 'minimal',
    colors: { primary: '#000000', secondary: '#6b7280', accent: '#000000' },
    fonts: { heading: 'Inter', body: 'Inter', accent: 'Inter' }
  }
};
