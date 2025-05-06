import { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    
    name: '',
    phone: '',
    email: '',
    message: '',
    subscribe: false
  });

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'This field is required';
    }

    if (formData.phone && !/^\+?[0-9\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'This phone number isn\'t correct';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'This field is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'This email isn\'t correct';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear the error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, subscribe: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setFormState('submitting');
  
    const form = new FormData();
    form.append('name', formData.name);
    form.append('phone', formData.phone);
    form.append('email', formData.email);
    form.append('message', formData.message);
    form.append('subscribe', formData.subscribe ? 'Yes' : 'No');
    form.append('access_key', '87c6a13e-cb0a-4053-991b-c8c151167bff');
  
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: form,
      });
  
      if (response.ok) {
        setFormState('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
          subscribe: false,
        });
  
        // Reset success message after some time (optional)
        setTimeout(() => setFormState('idle'), 2500);
      } else {
        console.error('Form submission failed:', response.statusText);
        setFormState('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormState('error');
    }
  };
  

  return (
    <section className="py-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold mb-6">
              get in touch
            </h2>
            <p className="text-xl text-neutral/80 mb-10">
              Together, we'll make your organization thrive through premium, personalized digital products.
              <br /><br />
              Curious about how we can help you with your projects?
              <br /><br />
              Reach out and we'll be happy to discuss your plans!
            </p>
          </div>

          <div className="bg-black/20 p-8 rounded-xl">
            {formState === 'success' ? (
              <div className="text-center py-12">
                <div className="text-primary mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2">Thank you for your message</h3>
                <p className="text-neutral/80">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className={`w-full bg-transparent border-b ${errors.name ? 'border-red-500' : 'border-neutral/20'} pb-2 text-neutral focus:outline-none focus:border-primary transition-colors`}
                    value={formData.name}
                    onChange={handleChange}
                    disabled={formState === 'submitting'}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="mb-6">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    className={`w-full bg-transparent border-b ${errors.phone ? 'border-red-500' : 'border-neutral/20'} pb-2 text-neutral focus:outline-none focus:border-primary transition-colors`}
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={formState === 'submitting'}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="mb-6">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    className={`w-full bg-transparent border-b ${errors.email ? 'border-red-500' : 'border-neutral/20'} pb-2 text-neutral focus:outline-none focus:border-primary transition-colors`}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={formState === 'submitting'}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="mb-6">
                  <textarea
                    name="message"
                    placeholder="Your message"
                    rows={4}
                    className={`w-full bg-transparent border-b ${errors.message ? 'border-red-500' : 'border-neutral/20'} pb-2 text-neutral focus:outline-none focus:border-primary transition-colors resize-none`}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={formState === 'submitting'}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <div className="mb-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.subscribe}
                      onChange={handleCheckboxChange}
                      disabled={formState === 'submitting'}
                    />
                    <span className={`w-5 h-5 mr-2 border ${formData.subscribe ? 'bg-primary border-primary' : 'border-neutral/30'} rounded flex items-center justify-center transition-colors`}>
                      {formData.subscribe && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-background"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className="text-neutral/80">Subscribe to our newsletter</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={formState === 'submitting'}
                >
                  {formState === 'submitting' ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-background"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </div>
                  ) : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
