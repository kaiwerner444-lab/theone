import { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in <span className="text-orange-DEFAULT">Touch</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Have questions about our products or need assistance with your research? Our team is here to help.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="pill-panel p-6">
              <div className="w-12 h-12 rounded-full bg-orange-DEFAULT/10 flex items-center justify-center mb-4"><Mail className="w-6 h-6 text-orange-DEFAULT" /></div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-white/60 text-sm">research@pep.center</p>
              <p className="text-white/60 text-sm">support@pep.center</p>
            </div>
            <div className="pill-panel p-6">
              <div className="w-12 h-12 rounded-full bg-orange-DEFAULT/10 flex items-center justify-center mb-4"><Phone className="w-6 h-6 text-orange-DEFAULT" /></div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-white/60 text-sm">+1 (555) 123-4567</p>
              <p className="text-white/60 text-sm">Mon-Fri 9am-5pm EST</p>
            </div>
            <div className="pill-panel p-6">
              <div className="w-12 h-12 rounded-full bg-orange-DEFAULT/10 flex items-center justify-center mb-4"><MapPin className="w-6 h-6 text-orange-DEFAULT" /></div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-white/60 text-sm">123 Research Boulevard</p>
              <p className="text-white/60 text-sm">Science Park, CA 94025</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="pill-panel p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-green-500" /></div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-white/60">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-sm text-white/60 mb-2">Your Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" /></div>
                    <div><label className="block text-sm text-white/60 mb-2">Email Address</label><input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" /></div>
                  </div>
                  <div><label className="block text-sm text-white/60 mb-2">Subject</label><select name="subject" value={formData.subject} onChange={handleChange} required><option value="">Select a subject</option><option value="general">General Inquiry</option><option value="product">Product Question</option><option value="order">Order Support</option><option value="research">Research Collaboration</option><option value="other">Other</option></select></div>
                  <div><label className="block text-sm text-white/60 mb-2">Message</label><textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="How can we help you?" /></div>
                  <button type="submit" disabled={isSubmitting} className="w-full btn-primary flex items-center justify-center gap-2">{isSubmitting ? 'Sending...' : <><>Send Message</><Send className="w-5 h-5" /></>}</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
