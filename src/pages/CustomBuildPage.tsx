import { useState } from 'react';
import { ModernNavbar } from '@/components/layout/ModernNavbar';
import { FooterSection } from '@/components/home/FooterSection';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Zap, CheckCircle } from 'lucide-react';

export function CustomBuildPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    projectType: '',
    description: '',
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Request submitted! We\'ll contact you within 24 hours.');
    setFormData({ name: '', email: '', department: '', projectType: '', description: '', deadline: '' });
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      <ModernNavbar />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 gradient-primary">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1B1B1B' }}>
              Custom <span className="gradient-text">Build Request</span>
            </h1>
            <p className="text-lg" style={{ color: '#4A4A4A' }}>
              Need a tailored project? Let us build it for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Benefits */}
            <div>
              <h2 className="text-xl font-semibold mb-6" style={{ color: '#1B1B1B' }}>Why Custom Build?</h2>
              <div className="space-y-4">
                {[
                  'Tailored to your exact requirements',
                  'Original, plagiarism-free work',
                  'Complete documentation included',
                  'Support during project presentation',
                  'Flexible pricing options'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" style={{ color: '#35C2A0' }} />
                    <span style={{ color: '#4A4A4A' }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1B1B1B' }}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1B1B1B' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1B1B1B' }}>Department</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20"
                    required
                  >
                    <option value="">Select department</option>
                    <option value="aiml">AIML</option>
                    <option value="computer">Computer</option>
                    <option value="mechanical">Mechanical</option>
                    <option value="civil">Civil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1B1B1B' }}>Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="microproject">Microproject</option>
                    <option value="capstone">Capstone Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1B1B1B' }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 min-h-[100px]"
                    placeholder="Describe your project requirements..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary text-white" size="lg">
                  Submit Request
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
