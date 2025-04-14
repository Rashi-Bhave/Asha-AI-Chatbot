import api from './index';

/**
 * Fetches jobs from the API
 * 
 * @param {Object} filters - Optional filters to apply
 * @returns {Array} - Array of job objects
 */
export const fetchJobs = async (filters = {}) => {
  try {
    // In a real app, this would call the actual API with filters
    // const response = await api.get('/jobs', { params: filters });
    // return response.data;
    
    // For demo purposes, return mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock job data
    const jobs = [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'TechCorp Solutions',
        location: 'Remote',
        type: 'Full-time',
        salary: '₹20L - ₹30L per annum',
        description: 'We are looking for an experienced software engineer to join our team. You will be responsible for developing high-quality applications, collaborating with cross-functional teams, and mentoring junior developers.',
        postedDate: new Date('2024-04-10').toISOString(),
        applyUrl: 'https://example.com/apply/1',
        logo: 'https://randomuser.me/api/portraits/men/1.jpg',
        skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
        experienceLevel: 'Senior Level',
        industry: 'Technology',
      },
      {
        id: 2,
        title: 'Marketing Manager',
        company: 'Brand Innovators',
        location: 'Bangalore',
        type: 'Full-time',
        salary: '₹15L - ₹20L per annum',
        description: 'Join our dynamic marketing team to drive brand growth and engagement. You will develop marketing strategies, manage campaigns, analyze performance metrics, and collaborate with creative teams.',
        postedDate: new Date('2024-04-08').toISOString(),
        applyUrl: 'https://example.com/apply/2',
        logo: 'https://randomuser.me/api/portraits/women/2.jpg',
        skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
        experienceLevel: 'Mid Level',
        industry: 'Marketing & Advertising',
      },
      {
        id: 3,
        title: 'UX/UI Designer',
        company: 'Creative Solutions Inc',
        location: 'Hybrid - Mumbai',
        type: 'Full-time',
        salary: '₹12L - ₹18L per annum',
        description: 'Create exceptional user experiences for our digital products. You will conduct user research, create wireframes, design visually appealing interfaces, and collaborate with developers to implement your designs.',
        postedDate: new Date('2024-04-05').toISOString(),
        applyUrl: 'https://example.com/apply/3',
        logo: 'https://randomuser.me/api/portraits/women/3.jpg',
        skills: ['UI Design', 'UX Research', 'Figma', 'Adobe Creative Suite'],
        experienceLevel: 'Mid Level',
        industry: 'Design',
      },
      {
        id: 4,
        title: 'Data Analyst',
        company: 'DataWise Analytics',
        location: 'Remote',
        type: 'Full-time',
        salary: '₹10L - ₹15L per annum',
        description: 'Turn data into actionable insights for our organization. You will collect, process, and analyze data, create visualizations, and present findings to stakeholders to drive business decisions.',
        postedDate: new Date('2024-04-12').toISOString(),
        applyUrl: 'https://example.com/apply/4',
        logo: 'https://randomuser.me/api/portraits/women/4.jpg',
        skills: ['SQL', 'Python', 'Data Visualization', 'Statistical Analysis'],
        experienceLevel: 'Entry Level',
        industry: 'Data & Analytics',
      },
      {
        id: 5,
        title: 'Product Manager',
        company: 'InnovateTech',
        location: 'Hybrid - Delhi',
        type: 'Full-time',
        salary: '₹18L - ₹25L per annum',
        description: 'Lead the development of innovative products that solve real customer problems. You will define product vision, create roadmaps, prioritize features, and work with engineering, design, and marketing teams.',
        postedDate: new Date('2024-04-07').toISOString(),
        applyUrl: 'https://example.com/apply/5',
        logo: 'https://randomuser.me/api/portraits/men/5.jpg',
        skills: ['Product Management', 'Agile', 'User Stories', 'Market Research'],
        experienceLevel: 'Mid Level',
        industry: 'Technology',
      },
      {
        id: 6,
        title: 'HR Business Partner',
        company: 'People First Inc',
        location: 'Bangalore',
        type: 'Full-time',
        salary: '₹12L - ₹18L per annum',
        description: 'Support our organization\'s growth by aligning HR strategies with business goals. You will manage employee relations, develop talent management plans, and implement HR initiatives.',
        postedDate: new Date('2024-04-09').toISOString(),
        applyUrl: 'https://example.com/apply/6',
        logo: 'https://randomuser.me/api/portraits/women/6.jpg',
        skills: ['HR Management', 'Talent Development', 'Employee Relations', 'Organizational Development'],
        experienceLevel: 'Mid Level',
        industry: 'Human Resources',
      },
      {
        id: 7,
        title: 'Content Writer',
        company: 'WordCraft Media',
        location: 'Remote',
        type: 'Part-time',
        salary: '₹6L - ₹9L per annum',
        description: 'Create engaging content for various platforms and audiences. You will research topics, write clear and compelling copy, edit content, and collaborate with marketing and design teams.',
        postedDate: new Date('2024-04-11').toISOString(),
        applyUrl: 'https://example.com/apply/7',
        logo: 'https://randomuser.me/api/portraits/women/7.jpg',
        skills: ['Content Writing', 'Editing', 'SEO', 'Research'],
        experienceLevel: 'Entry Level',
        industry: 'Media & Communications',
      },
      {
        id: 8,
        title: 'Financial Analyst',
        company: 'Global Finance Group',
        location: 'Hybrid - Chennai',
        type: 'Full-time',
        salary: '₹14L - ₹20L per annum',
        description: 'Help our organization make sound financial decisions. You will analyze financial data, create forecasts, prepare reports, and provide recommendations to improve financial performance.',
        postedDate: new Date('2024-04-06').toISOString(),
        applyUrl: 'https://example.com/apply/8',
        logo: 'https://randomuser.me/api/portraits/men/8.jpg',
        skills: ['Financial Analysis', 'Excel', 'Forecasting', 'Budgeting'],
        experienceLevel: 'Mid Level',
        industry: 'Finance',
      },
      {
        id: 9,
        title: 'Customer Success Manager',
        company: 'Client Care Solutions',
        location: 'Remote',
        type: 'Full-time',
        salary: '₹10L - ₹15L per annum',
        description: 'Ensure our customers achieve their goals with our products. You will onboard new clients, provide product training, address concerns, and identify opportunities for account growth.',
        postedDate: new Date('2024-04-13').toISOString(),
        applyUrl: 'https://example.com/apply/9',
        logo: 'https://randomuser.me/api/portraits/women/9.jpg',
        skills: ['Customer Relationship Management', 'Account Management', 'Client Onboarding', 'Problem Solving'],
        experienceLevel: 'Entry Level',
        industry: 'Customer Service',
      },
      {
        id: 10,
        title: 'Project Coordinator',
        company: 'Project Excellence Ltd',
        location: 'Hybrid - Hyderabad',
        type: 'Contract',
        salary: '₹8L - ₹12L per annum',
        description: 'Support project managers in delivering successful projects. You will coordinate project activities, track progress, manage schedules, organize meetings, and maintain documentation.',
        postedDate: new Date('2024-04-10').toISOString(),
        applyUrl: 'https://example.com/apply/10',
        logo: 'https://randomuser.me/api/portraits/women/10.jpg',
        skills: ['Project Coordination', 'Documentation', 'Scheduling', 'Communication'],
        experienceLevel: 'Entry Level',
        industry: 'Project Management',
      }
    ];
    
    // Apply filters if provided
    let filteredJobs = [...jobs];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search)
      );
    }
    
    if (filters.location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.type) {
      filteredJobs = filteredJobs.filter(job => 
        job.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    if (filters.experienceLevel) {
      filteredJobs = filteredJobs.filter(job => 
        job.experienceLevel.toLowerCase() === filters.experienceLevel.toLowerCase()
      );
    }
    
    return filteredJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs. Please try again.');
  }
};

/**
 * Fetches a single job by ID
 * 
 * @param {string|number} jobId - ID of the job to fetch
 * @returns {Object} - Job object
 */
export const fetchJobById = async (jobId) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.get(`/jobs/${jobId}`);
    // return response.data;
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get all jobs and find the one with matching ID
    const jobs = await fetchJobs();
    const job = jobs.find(j => j.id.toString() === jobId.toString());
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    return job;
  } catch (error) {
    console.error(`Error fetching job with ID ${jobId}:`, error);
    throw new Error('Failed to fetch job details. Please try again.');
  }
};

/**
 * Applies for a job
 * 
 * @param {string|number} jobId - ID of the job to apply for
 * @param {Object} applicationData - Application data (resume, cover letter, etc.)
 * @returns {Object} - Application status
 */
export const applyForJob = async (jobId, applicationData) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    // return response.data;
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Validate application data
    if (!applicationData.resume) {
      throw new Error('Resume is required');
    }
    
    // Return success response
    return {
      success: true,
      applicationId: `app-${Date.now()}`,
      message: 'Application submitted successfully',
    };
  } catch (error) {
    console.error(`Error applying for job with ID ${jobId}:`, error);
    throw new Error('Failed to submit application. Please try again.');
  }
};

/**
 * Saves a job to user's favorites
 * 
 * @param {string|number} jobId - ID of the job to save
 * @returns {Object} - Save status
 */
export const saveJob = async (jobId) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.post(`/jobs/${jobId}/save`);
    // return response.data;
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return success response
    return {
      success: true,
      message: 'Job saved successfully',
    };
  } catch (error) {
    console.error(`Error saving job with ID ${jobId}:`, error);
    throw new Error('Failed to save job. Please try again.');
  }
};