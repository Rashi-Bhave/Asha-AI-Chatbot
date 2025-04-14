import api from './index';

/**
 * Fetches mentorship programs from the API
 * 
 * @param {Object} filters - Optional filters to apply
 * @returns {Array} - Array of mentorship program objects
 */
export const fetchMentorships = async (filters = {}) => {
  try {
    // In a real app, this would call the actual API with filters
    // const response = await api.get('/mentorships', { params: filters });
    // return response.data;
    
    // For demo purposes, return mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock mentorship program data
    const mentorships = [
      {
        id: 1,
        title: 'Leadership Accelerator Program',
        mentor: 'Dr. Nandita Sharma',
        mentorTitle: 'CEO, TechInnovations India',
        focus: 'Executive Leadership Development',
        duration: '6 months',
        format: 'One-on-one sessions + Group workshops',
        description: 'This program is designed for mid-career women looking to advance into senior leadership positions. It combines personalized coaching with group learning to develop strategic leadership skills, executive presence, and organizational influence.',
        image: 'https://randomuser.me/api/portraits/women/21.jpg',
        industry: 'Technology',
        startDate: '2024-05-15',
        commitmentHours: '4-6 hours per month',
        application: 'https://example.com/mentorship/apply/1',
        testimonials: [
          {
            name: 'Priya Mehta',
            role: 'Director of Product, CloudTech',
            quote: 'This program transformed how I approach leadership challenges. The combination of one-on-one mentoring and peer learning was invaluable for my growth as a leader.',
            image: 'https://randomuser.me/api/portraits/women/22.jpg'
          }
        ],
        topics: [
          'Strategic thinking and decision-making',
          'Building and leading high-performing teams',
          'Organizational influence and stakeholder management',
          'Executive presence and communication',
          'Leading organizational change'
        ]
      },
      {
        id: 2,
        title: 'Tech Career Pathfinder',
        mentor: 'Ananya Kapoor',
        mentorTitle: 'Senior Engineering Manager, GlobalSoft',
        focus: 'Technical Career Advancement',
        duration: '4 months',
        format: 'Bi-weekly one-on-one sessions',
        description: 'Designed for women in technical roles looking to grow their careers in engineering, data science, or product development. This mentorship program provides guidance on technical skill development, career planning, and navigating challenges in tech-focused roles.',
        image: 'https://randomuser.me/api/portraits/women/23.jpg',
        industry: 'Software & Technology',
        startDate: '2024-06-01',
        commitmentHours: '2-3 hours per month',
        application: 'https://example.com/mentorship/apply/2',
        testimonials: [
          {
            name: 'Deepika Singh',
            role: 'Senior Developer, TechCorp',
            quote: 'My mentor provided practical advice that helped me navigate technical challenges and develop a clear path for my career growth in engineering leadership.',
            image: 'https://randomuser.me/api/portraits/women/24.jpg'
          }
        ],
        topics: [
          'Technical skill development roadmap',
          'Moving from individual contributor to technical leader',
          'Project portfolio development',
          'Technical interview preparation',
          'Work-life balance in demanding tech roles'
        ]
      },
      {
        id: 3,
        title: 'Entrepreneurship Launchpad',
        mentor: 'Ritu Malhotra',
        mentorTitle: 'Founder & CEO, GrowthVentures',
        focus: 'Business Development & Entrepreneurship',
        duration: '6 months',
        format: 'Monthly one-on-one + Peer group sessions',
        description: 'For women entrepreneurs at any stage of their business journey. This program provides guidance on business planning, funding strategies, operations, marketing, and leadership challenges specific to startup founders and small business owners.',
        image: 'https://randomuser.me/api/portraits/women/25.jpg',
        industry: 'Entrepreneurship',
        startDate: '2024-05-10',
        commitmentHours: '4-5 hours per month',
        application: 'https://example.com/mentorship/apply/3',
        testimonials: [
          {
            name: 'Meera Patel',
            role: 'Founder, EcoStyle',
            quote: 'The mentorship program gave me both practical business knowledge and emotional support during the challenging early phases of my startup journey.',
            image: 'https://randomuser.me/api/portraits/women/26.jpg'
          }
        ],
        topics: [
          'Business model development and validation',
          'Funding strategies and investor relations',
          'Marketing and customer acquisition',
          'Team building and organizational culture',
          'Financial management and growth planning'
        ]
      },
      {
        id: 4,
        title: 'Career Relaunch Program',
        mentor: 'Shalini Gupta',
        mentorTitle: 'HR Director, PrimeServices',
        focus: 'Career Re-entry After a Break',
        duration: '3 months',
        format: 'Weekly one-on-one sessions',
        description: 'Specifically designed for women returning to the workforce after a career break. This mentorship program focuses on skill refreshment, confidence building, current job market navigation, and strategies for successfully transitioning back to professional life.',
        image: 'https://randomuser.me/api/portraits/women/27.jpg',
        industry: 'Cross-industry',
        startDate: '2024-06-15',
        commitmentHours: '3-4 hours per month',
        application: 'https://example.com/mentorship/apply/4',
        testimonials: [
          {
            name: 'Anjali Sharma',
            role: 'Project Manager, ConsultPro',
            quote: 'After a 4-year career break, this program helped me rebuild my confidence and develop a strategy that led to a successful job search and smooth transition back to work.',
            image: 'https://randomuser.me/api/portraits/women/28.jpg'
          }
        ],
        topics: [
          'Skill gap assessment and development plan',
          'Resume and LinkedIn profile optimization',
          'Interview preparation and addressing career gaps',
          'Confidence rebuilding and personal branding',
          'Work-life integration strategies'
        ]
      },
      {
        id: 5,
        title: 'Marketing Excellence Mentorship',
        mentor: 'Vikram Seth',
        mentorTitle: 'CMO, Consumer Brands Group',
        focus: 'Marketing Career Development',
        duration: '4 months',
        format: 'Bi-weekly one-on-one sessions',
        description: 'For women in marketing roles looking to enhance their skills and advance their careers. This program covers various aspects of modern marketing including digital strategies, brand management, marketing analytics, team leadership, and career advancement in the marketing field.',
        image: 'https://randomuser.me/api/portraits/men/29.jpg',
        industry: 'Marketing & Advertising',
        startDate: '2024-06-01',
        commitmentHours: '2-3 hours per month',
        application: 'https://example.com/mentorship/apply/5',
        testimonials: [
          {
            name: 'Neha Reddy',
            role: 'Marketing Manager, RetailGiant',
            quote: 'The mentorship provided practical insights into modern marketing strategies and helped me develop leadership skills that led to my recent promotion.',
            image: 'https://randomuser.me/api/portraits/women/30.jpg'
          }
        ],
        topics: [
          'Digital marketing strategy development',
          'Brand building and management',
          'Marketing analytics and ROI measurement',
          'Team leadership and cross-functional collaboration',
          'Career pathing in marketing'
        ]
      },
      {
        id: 6,
        title: 'Financial Services Mentoring Circle',
        mentor: 'Aruna Chawla',
        mentorTitle: 'Senior VP, Global Investment Bank',
        focus: 'Finance Industry Career Growth',
        duration: '6 months',
        format: 'Monthly one-on-one + Group sessions',
        description: 'Designed for women working in or aspiring to advance in the financial services sector. This program provides guidance on technical skill development, industry knowledge, leadership capabilities, and strategies for navigating a traditionally male-dominated industry.',
        image: 'https://randomuser.me/api/portraits/women/31.jpg',
        industry: 'Financial Services',
        startDate: '2024-05-20',
        commitmentHours: '3-5 hours per month',
        application: 'https://example.com/mentorship/apply/6',
        testimonials: [
          {
            name: 'Tanya Khanna',
            role: 'Investment Analyst, CapitalFirm',
            quote: 'This mentorship provided me with both technical knowledge and crucial guidance on how to navigate office politics in the finance sector.',
            image: 'https://randomuser.me/api/portraits/women/32.jpg'
          }
        ],
        topics: [
          'Financial analysis and technical skills',
          'Industry trends and market knowledge',
          'Client relationship management',
          'Leadership in financial services',
          'Work-life balance in high-pressure environments'
        ]
      },
      {
        id: 7,
        title: 'First-Time Manager Support Program',
        mentor: 'Kavita Desai',
        mentorTitle: 'People Operations Director, TechSolutions',
        focus: 'New Manager Development',
        duration: '3 months',
        format: 'Weekly one-on-one sessions',
        description: 'Specifically designed for women transitioning from individual contributor to their first management role. This program focuses on developing essential management skills, team leadership, performance management, and establishing credibility as a new manager.',
        image: 'https://randomuser.me/api/portraits/women/33.jpg',
        industry: 'Cross-industry',
        startDate: '2024-06-10',
        commitmentHours: '3-4 hours per month',
        application: 'https://example.com/mentorship/apply/7',
        testimonials: [
          {
            name: 'Shreya Kumar',
            role: 'Team Lead, DataTech',
            quote: 'The structured approach to developing management skills helped me avoid common pitfalls and build a high-performing team during my first leadership role.',
            image: 'https://randomuser.me/api/portraits/women/34.jpg'
          }
        ],
        topics: [
          'Transitioning from peer to manager',
          'Team leadership and motivation',
          'Effective delegation and feedback',
          'Performance management and development',
          'Managing difficult conversations'
        ]
      },
      {
        id: 8,
        title: 'Healthcare Leadership Program',
        mentor: 'Dr. Aparna Joshi',
        mentorTitle: 'Hospital Administrator & Former Medical Director',
        focus: 'Healthcare Industry Leadership',
        duration: '6 months',
        format: 'Bi-weekly one-on-one + Quarterly workshops',
        description: 'For women working in healthcare looking to advance into leadership positions. This program addresses the unique challenges of healthcare leadership including clinical-administrative balance, regulatory compliance, quality improvement, and leading multidisciplinary teams.',
        image: 'https://randomuser.me/api/portraits/women/35.jpg',
        industry: 'Healthcare',
        startDate: '2024-05-15',
        commitmentHours: '3-5 hours per month',
        application: 'https://example.com/mentorship/apply/8',
        testimonials: [
          {
            name: 'Dr. Lakshmi Rao',
            role: 'Department Head, City Hospital',
            quote: 'This mentorship provided invaluable guidance on balancing clinical excellence with administrative leadership, helping me successfully transition to a department leadership role.',
            image: 'https://randomuser.me/api/portraits/women/36.jpg'
          }
        ],
        topics: [
          'Healthcare policy and regulatory environment',
          'Quality improvement and patient safety',
          'Leading clinical and administrative teams',
          'Healthcare innovation and change management',
          'Career advancement in healthcare organizations'
        ]
      }
    ];
    
    // Apply filters if provided
    let filteredMentorships = [...mentorships];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredMentorships = filteredMentorships.filter(mentorship => 
        mentorship.title.toLowerCase().includes(search) ||
        mentorship.description.toLowerCase().includes(search) ||
        mentorship.mentor.toLowerCase().includes(search) ||
        mentorship.focus.toLowerCase().includes(search)
      );
    }
    
    if (filters.industry) {
      filteredMentorships = filteredMentorships.filter(mentorship => 
        mentorship.industry.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }
    
    if (filters.focus) {
      filteredMentorships = filteredMentorships.filter(mentorship => 
        mentorship.focus.toLowerCase().includes(filters.focus.toLowerCase())
      );
    }
    
    if (filters.duration) {
      filteredMentorships = filteredMentorships.filter(mentorship => 
        mentorship.duration.toLowerCase().includes(filters.duration.toLowerCase())
      );
    }
    
    return filteredMentorships;
  } catch (error) {
    console.error('Error fetching mentorship programs:', error);
    throw new Error('Failed to fetch mentorship programs. Please try again.');
  }
};

/**
 * Fetches a single mentorship program by ID
 * 
 * @param {string|number} mentorshipId - ID of the mentorship program to fetch
 * @returns {Object} - Mentorship program object
 */
export const fetchMentorshipById = async (mentorshipId) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.get(`/mentorships/${mentorshipId}`);
    // return response.data;
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get all mentorship programs and find the one with matching ID
    const mentorships = await fetchMentorships();
    const mentorship = mentorships.find(m => m.id.toString() === mentorshipId.toString());
    
    if (!mentorship) {
      throw new Error('Mentorship program not found');
    }
    
    return mentorship;
  } catch (error) {
    console.error(`Error fetching mentorship program with ID ${mentorshipId}:`, error);
    throw new Error('Failed to fetch mentorship program details. Please try again.');
  }
};

/**
 * Applies for a mentorship program
 * 
 * @param {string|number} mentorshipId - ID of the mentorship program to apply for
 * @param {Object} applicationData - Application data (profile, motivation, etc.)
 * @returns {Object} - Application status
 */
export const applyForMentorship = async (mentorshipId, applicationData) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.post(`/mentorships/${mentorshipId}/apply`, applicationData);
    // return response.data;
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Validate application data
    if (!applicationData.name || !applicationData.email || !applicationData.motivation) {
      throw new Error('Name, email, and motivation statement are required');
    }
    
    // Return success response
    return {
      success: true,
      applicationId: `app-m-${Date.now()}`,
      message: 'Application submitted successfully',
    };
  } catch (error) {
    console.error(`Error applying for mentorship program with ID ${mentorshipId}:`, error);
    throw new Error('Failed to submit application. Please try again.');
  }
};

/**
 * Saves a mentorship program to user's favorites
 * 
 * @param {string|number} mentorshipId - ID of the mentorship program to save
 * @returns {Object} - Save status
 */
export const saveMentorship = async (mentorshipId) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.post(`/mentorships/${mentorshipId}/save`);
    // return response.data;
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return success response
    return {
      success: true,
      message: 'Mentorship program saved successfully',
    };
  } catch (error) {
    console.error(`Error saving mentorship program with ID ${mentorshipId}:`, error);
    throw new Error('Failed to save mentorship program. Please try again.');
  }
};