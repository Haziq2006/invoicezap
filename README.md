# InvoiceZap.app - Freelancer Invoice Generator MVP

A simple, mobile-friendly SaaS for freelancers to create, send, and track invoices in under 30 seconds. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Quick Invoice Creation** - Generate professional invoices in under 30 seconds
- **Mobile-First Design** - Optimized for freelancers on the go
- **Multiple Templates** - 3 professional invoice templates included
- **PDF Export** - Download invoices as PDFs
- **Payment Tracking** - Monitor invoice status (Draft, Sent, Pending, Paid)
- **Freemium Model** - Free tier with unlimited invoices, paid plans for customization

## 🛠️ Tech Stack

- **Frontend**: React 18, Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS with custom components
- **Backend**: Supabase (database & authentication)
- **Payments**: Stripe integration
- **PDF Generation**: jsPDF
- **Email**: SendGrid
- **Hosting**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sec-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # SendGrid
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your_verified_sender_email
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup (Supabase)

1. **Create a new Supabase project**
2. **Set up the following tables:**

   ```sql
   -- Users table (extends Supabase auth.users)
   CREATE TABLE public.profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     first_name TEXT,
     last_name TEXT,
     plan TEXT DEFAULT 'free',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Clients table
   CREATE TABLE public.clients (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     email TEXT,
     company TEXT,
     address TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Invoices table
   CREATE TABLE public.invoices (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
     client_id UUID REFERENCES public.clients(id),
     invoice_number TEXT NOT NULL,
     status TEXT DEFAULT 'draft',
     issue_date DATE NOT NULL,
     due_date DATE NOT NULL,
     subtotal DECIMAL(10,2) NOT NULL,
     tax_rate DECIMAL(5,2) DEFAULT 0,
     tax_amount DECIMAL(10,2) DEFAULT 0,
     total DECIMAL(10,2) NOT NULL,
     notes TEXT,
     template TEXT DEFAULT 'basic',
     stripe_payment_intent_id TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Invoice items table
   CREATE TABLE public.invoice_items (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
     description TEXT NOT NULL,
     quantity INTEGER NOT NULL,
     unit_price DECIMAL(10,2) NOT NULL,
     total DECIMAL(10,2) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Set up Row Level Security (RLS)**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON public.profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON public.profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can view own clients" ON public.clients
     FOR ALL USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own invoices" ON public.invoices
     FOR ALL USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own invoice items" ON public.invoice_items
     FOR ALL USING (auth.uid() IN (
       SELECT user_id FROM public.invoices WHERE id = invoice_id
     ));
   ```

## 🔐 Authentication Setup

1. **Configure Supabase Auth**
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable Email and Google providers
   - Set up redirect URLs for your domain

2. **Update auth configuration**
   - The app is already set up to use Supabase auth
   - Update the auth functions in `app/signup/page.tsx` and `app/login/page.tsx`

## 💳 Stripe Integration

1. **Create a Stripe account**
2. **Set up webhooks**
   - Endpoint: `/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
3. **Update payment processing in invoice components**

## 📧 SendGrid Setup

1. **Create a SendGrid account**
2. **Verify your sender email**
3. **Create email templates for invoice delivery**
4. **Update the email sending functions**

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

## 📱 Available Routes

- `/` - Landing page
- `/signup` - User registration
- `/login` - User authentication
- `/dashboard` - Main dashboard
- `/invoice/new` - Create new invoice
- `/invoice/[id]` - View/edit invoice (TODO)
- `/clients` - Manage clients (TODO)
- `/templates` - Invoice templates (TODO)

## 🎨 Customization

- **Colors**: Update `tailwind.config.js` for brand colors
- **Templates**: Modify invoice templates in the components
- **Styling**: Custom CSS classes in `app/globals.css`

## 🔧 Development

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Recommended for code formatting
- **Hot Reload**: Automatic during development

## 📊 Performance

- **Next.js 14**: App Router with server components
- **Tailwind CSS**: Purged CSS for production
- **Image Optimization**: Next.js built-in image optimization
- **Code Splitting**: Automatic route-based code splitting

## 🚧 TODO (Post-MVP)

- [ ] Client management system
- [ ] Invoice templates customization
- [ ] Payment reminder system
- [ ] Analytics dashboard
- [ ] Multi-currency support
- [ ] Tax calculation automation
- [ ] Invoice import/export
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, email support@invoicezap.app or create an issue in the repository.

---

**Built with ❤️ for freelancers who deserve to get paid on time.**
