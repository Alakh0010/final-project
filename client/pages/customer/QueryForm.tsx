import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PaperClipIcon, 
  PhoneIcon, 
  QuestionMarkCircleIcon, 
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import styles from './QueryForm.module.css';

interface Query {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  brand?: string;
  updates?: {
    date: string;
    status: string;
    message: string;
  }[];
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface FormErrors {
  name?: string;
  query?: string;
  category?: string;
  brand?: string;
}

const QueryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    query: '',
    category: '',
    priority: 'medium',
    brand: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showQuickFAQ, setShowQuickFAQ] = useState(false);
  const [selectedQuickFAQ, setSelectedQuickFAQ] = useState<FAQ | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  // List of available brands
  const brands = [
    'Apple',
    'Samsung',
    'Sony',
    'Microsoft',
    'Google',
    'Amazon',
    'Dell',
    'HP',
    'Lenovo',
    'Other'
  ];

  const [submittedQueries, setSubmittedQueries] = useState<Query[]>([
    {
      id: '1',
      name: 'John Doe',
      category: 'Technical Support',
      status: 'resolved',
      createdAt: '2024-03-20T10:00:00Z',
      priority: 'high',
      description: 'Unable to connect to the network after system update',
      brand: 'Apple',
      updates: [
        {
          date: '2024-03-20T10:00:00Z',
          status: 'pending',
          message: 'Query submitted'
        },
        {
          date: '2024-03-20T11:30:00Z',
          status: 'in-progress',
          message: 'Technical team is investigating the issue'
        },
        {
          date: '2024-03-20T14:45:00Z',
          status: 'resolved',
          message: 'Issue resolved by updating network drivers'
        }
      ]
    },
    {
      id: '2',
      name: 'Jane Smith',
      category: 'Billing',
      status: 'in-progress',
      createdAt: '2024-03-20T11:30:00Z',
      priority: 'medium',
      description: 'Incorrect billing amount on last month\'s invoice',
      brand: 'Microsoft',
      updates: [
        {
          date: '2024-03-20T11:30:00Z',
          status: 'pending',
          message: 'Query submitted'
        },
        {
          date: '2024-03-20T13:15:00Z',
          status: 'in-progress',
          message: 'Billing team is reviewing the invoice'
        }
      ]
    },
    {
      id: '3',
      name: 'Mike Johnson',
      category: 'Product Inquiry',
      status: 'pending',
      createdAt: '2024-03-20T12:15:00Z',
      priority: 'low',
      description: 'Information about product specifications and availability',
      brand: 'Samsung',
      updates: [
        {
          date: '2024-03-20T12:15:00Z',
          status: 'pending',
          message: 'Query submitted'
        }
      ]
    }
  ]);

  const faqs: FAQ[] = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password. Make sure to use a strong password with a mix of letters, numbers, and special characters.",
      category: "Account"
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most products. Items must be in their original condition with all packaging and accessories. Contact our support team to initiate a return, and we'll provide you with a return shipping label.",
      category: "Returns"
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the continental US. International shipping may take 7-14 business days. Express shipping options are available for faster delivery.",
      category: "Shipping"
    },
    {
      question: "What is covered under the product warranty?",
      answer: "Our standard warranty covers manufacturing defects for 12 months from the date of purchase. This includes hardware malfunctions and factory defects. Normal wear and tear, accidental damage, and unauthorized modifications are not covered.",
      category: "Warranty"
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'Order History' section. Click on the specific order to view its tracking information. You'll also receive email updates with tracking details.",
      category: "Shipping"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. For business customers, we also offer net-30 payment terms upon approval.",
      category: "Payment"
    }
  ];

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const quickFAQs: FAQ[] = [
    {
      question: "How to reset password",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password. Make sure to use a strong password with a mix of letters, numbers, and special characters.",
      category: "Account"
    },
    {
      question: "Return policy",
      answer: "We offer a 30-day return policy for most products. Items must be in their original condition with all packaging and accessories. Contact our support team to initiate a return, and we'll provide you with a return shipping label.",
      category: "Returns"
    },
    {
      question: "Shipping information",
      answer: "Standard shipping typically takes 3-5 business days within the continental US. International shipping may take 7-14 business days. Express shipping options are available for faster delivery. You can track your order through your account dashboard.",
      category: "Shipping"
    },
    {
      question: "Product warranty",
      answer: "Our standard warranty covers manufacturing defects for 12 months from the date of purchase. This includes hardware malfunctions and factory defects. Normal wear and tear, accidental damage, and unauthorized modifications are not covered.",
      category: "Warranty"
    }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.query.trim()) {
      newErrors.query = 'Query is required';
    } else if (formData.query.length < 10) {
      newErrors.query = 'Query must be at least 10 characters long';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.brand) {
      newErrors.brand = 'Please select a brand';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', { ...formData, attachments });
      setShowSuccess(true);
      
      // Wait for animation to complete before redirecting
      setTimeout(() => {
        navigate('/success');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAttachments(Array.from(e.dataTransfer.files));
    }
  };

  const handleViewDetails = (query: Query) => {
    setSelectedQuery(query);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedQuery(null);
  };

  const handleFAQClick = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setExpandedFAQ(null);
  };

  const handleQuickFAQClick = (faq: FAQ) => {
    setSelectedQuickFAQ(faq);
    setShowQuickFAQ(true);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        {showSuccess ? (
          <div className={styles.successOverlay}>
            <div className={styles.successMessage}>
              <div className={styles.successContent}>
                <CheckCircleIcon className={styles.successIcon} />
                <h3>Query Submitted Successfully!</h3>
                <p>Thank you for your submission. We'll get back to you soon.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h1>Submit Your Query</h1>
              <p className={styles.subtitle}>We'll get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={errors.name ? styles.inputError : ''}
                  />
                  {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? styles.inputError : ''}
                  >
                    <option value="">Select category</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing</option>
                    <option value="product">Product Inquiry</option>
                  </select>
                  {errors.category && <span className={styles.errorMessage}>{errors.category}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="brand">Brand</label>
                  <select
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className={errors.brand ? styles.inputError : ''}
                  >
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  {errors.brand && <span className={styles.errorMessage}>{errors.brand}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="query">Your Query</label>
                <textarea
                  id="query"
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                  placeholder="Describe your issue in detail"
                  rows={4}
                  className={errors.query ? styles.inputError : ''}
                />
                {errors.query && <span className={styles.errorMessage}>{errors.query}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Attachments</label>
                <div 
                  className={`${styles.fileUploadArea} ${dragActive ? styles.dragActive : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <PaperClipIcon className={styles.fileIcon} />
                  <p>Click to upload or drag and drop</p>
                  <p className={styles.fileTypes}>PNG, JPG, PDF (max 10MB)</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                  />
                </div>

                {attachments.length > 0 && (
                  <div className={styles.attachmentsList}>
                    {attachments.map((file, index) => (
                      <div key={index} className={styles.attachmentItem}>
                        <span className={styles.attachmentName}>{file.name}</span>
                        <button 
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className={styles.removeButton}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className={styles.spinner}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className={styles.spinnerCircle}
                        cx="12"
                        cy="12"
                        r="10"
                      ></circle>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Submit Query'
                )}
              </button>
            </form>
          </div>
        )}

        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <PhoneIcon className={styles.fileIcon} />
            <h3>Need Help?</h3>
            <p>Our support team is available 24/7 to assist you with any questions or concerns.</p>
            <a href="tel:+1234567890">+1 (234) 567-890</a>
          </div>
          
          <div className={styles.infoCard}>
            <QuestionMarkCircleIcon className={styles.fileIcon} />
            <h3>Frequently Asked Questions</h3>
            <ul className={styles.quickFAQList}>
              {quickFAQs.map((faq, index) => (
                <li key={index}>
                  <button 
                    className={styles.quickFAQButton}
                    onClick={() => handleQuickFAQClick(faq)}
                  >
                    {faq.question}
                  </button>
                </li>
              ))}
            </ul>
            <button 
              className={styles.viewFAQButton}
              onClick={() => setShowFAQ(true)}
            >
              View All FAQs
            </button>
          </div>
        </div>
      </div>

      <div className={styles.trackingPanel}>
        <div className={styles.trackingHeader}>
          <h2>Your Queries</h2>
          <span className={styles.queryCount}>{submittedQueries.length} queries</span>
        </div>

        <div className={styles.queryList}>
          {submittedQueries.map((query) => (
            <div key={query.id} className={styles.queryCard}>
              <div className={styles.queryHeader}>
                <span className={`${styles.statusBadge} ${styles[query.status]}`}>
                  {query.status === 'pending' && <ClockIcon className={styles.statusIcon} />}
                  {query.status === 'in-progress' && <ChatBubbleLeftRightIcon className={styles.statusIcon} />}
                  {query.status === 'resolved' && <CheckBadgeIcon className={styles.statusIcon} />}
                  {query.status}
                </span>
                <span className={`${styles.priorityBadge} ${styles[query.priority]}`}>
                  {query.priority}
                </span>
              </div>
              
              <h3 className={styles.queryTitle}>{query.category}</h3>
              <p className={styles.queryDate}>
                Submitted on {new Date(query.createdAt).toLocaleDateString()}
              </p>
              
              <div className={styles.queryFooter}>
                <span className={styles.queryId}>#{query.id}</span>
                <button 
                  className={styles.viewDetailsBtn}
                  onClick={() => handleViewDetails(query)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDetails && selectedQuery && (
        <div className={styles.detailsOverlay}>
          <div className={styles.detailsModal}>
            <div className={styles.detailsHeader}>
              <h2>Query Details</h2>
              <button 
                onClick={handleCloseDetails}
                className={styles.closeButton}
              >
                <XMarkIcon className={styles.closeIcon} />
              </button>
            </div>

            <div className={styles.detailsContent}>
              <div className={styles.detailsSection}>
                <div className={styles.detailsRow}>
                  <div className={styles.detailItem}>
                    <UserIcon className={styles.detailIcon} />
                    <div>
                      <label>Customer</label>
                      <p>{selectedQuery.name}</p>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <CalendarIcon className={styles.detailIcon} />
                    <div>
                      <label>Submitted</label>
                      <p>{new Date(selectedQuery.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.detailsRow}>
                  <div className={styles.detailItem}>
                    <TagIcon className={styles.detailIcon} />
                    <div>
                      <label>Category</label>
                      <p>{selectedQuery.category}</p>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <TagIcon className={styles.detailIcon} />
                    <div>
                      <label>Brand</label>
                      <p>{selectedQuery.brand}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.statusSection}>
                  <div className={styles.currentStatus}>
                    <span className={`${styles.statusBadge} ${styles[selectedQuery.status]}`}>
                      {selectedQuery.status === 'pending' && <ClockIcon className={styles.statusIcon} />}
                      {selectedQuery.status === 'in-progress' && <ChatBubbleLeftRightIcon className={styles.statusIcon} />}
                      {selectedQuery.status === 'resolved' && <CheckBadgeIcon className={styles.statusIcon} />}
                      {selectedQuery.status}
                    </span>
                    <span className={`${styles.priorityBadge} ${styles[selectedQuery.priority]}`}>
                      {selectedQuery.priority} Priority
                    </span>
                  </div>
                </div>

                <div className={styles.descriptionSection}>
                  <h3>Description</h3>
                  <p>{selectedQuery.description}</p>
                </div>

                <div className={styles.updatesSection}>
                  <h3>Progress Updates</h3>
                  <div className={styles.timeline}>
                    {selectedQuery.updates?.map((update, index) => (
                      <div key={index} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineHeader}>
                            <span className={`${styles.statusBadge} ${styles[update.status]}`}>
                              {update.status}
                            </span>
                            <span className={styles.timelineDate}>
                              {new Date(update.date).toLocaleString()}
                            </span>
                          </div>
                          <p className={styles.timelineMessage}>{update.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQuickFAQ && selectedQuickFAQ && (
        <div className={styles.quickFAQOverlay}>
          <div className={styles.quickFAQModal}>
            <div className={styles.quickFAQHeader}>
              <h2>{selectedQuickFAQ.question}</h2>
              <button 
                onClick={() => setShowQuickFAQ(false)}
                className={styles.closeButton}
              >
                <XMarkIcon className={styles.closeIcon} />
              </button>
            </div>

            <div className={styles.quickFAQContent}>
              <p>{selectedQuickFAQ.answer}</p>
            </div>

            <div className={styles.quickFAQFooter}>
              <button 
                className={styles.viewAllButton}
                onClick={() => {
                  setShowQuickFAQ(false);
                  setShowFAQ(true);
                }}
              >
                View All FAQs
              </button>
            </div>
          </div>
        </div>
      )}

      {showFAQ && (
        <div className={styles.faqOverlay}>
          <div className={styles.faqModal}>
            <div className={styles.faqHeader}>
              <h2>Frequently Asked Questions</h2>
              <button 
                onClick={() => setShowFAQ(false)}
                className={styles.closeButton}
              >
                <XMarkIcon className={styles.closeIcon} />
              </button>
            </div>

            <div className={styles.faqCategories}>
              {categories.map(category => (
                <button
                  key={category}
                  className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className={styles.faqList}>
              {filteredFAQs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => handleFAQClick(index)}
                  >
                    <span>{faq.question}</span>
                    {expandedFAQ === index ? (
                      <ChevronUpIcon className={styles.faqIcon} />
                    ) : (
                      <ChevronDownIcon className={styles.faqIcon} />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryForm;

