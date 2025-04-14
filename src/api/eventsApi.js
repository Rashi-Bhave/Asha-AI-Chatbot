import api from './index';

/**
 * Fetches events from the API
 * 
 * @param {Object} filters - Optional filters to apply
 * @returns {Array} - Array of event objects
 */
export const fetchEvents = async (filters = {}) => {
  try {
    // In a real app, this would call the actual API with filters
    // const response = await api.get('/events', { params: filters });
    // return response.data;
    
    // For demo purposes, return mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Current date for relative date calculations
    const currentDate = new Date();
    
    // Mock event data
    const events = [
      {
        id: 1,
        title: 'Women in Tech Leadership Summit',
        description: 'Join industry leaders for a day of inspiration, learning, and networking. This summit features keynote speakers, panel discussions, and workshops focused on advancing women in technology leadership roles.',
        date: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        location: 'Taj Bangalore, MG Road',
        virtual: false,
        category: 'Conference',
        image: 'https://picsum.photos/id/3/400/200',
        registrationUrl: 'https://example.com/events/register/1',
        price: '₹2,000',
        speakers: [
          { name: 'Priya Sharma', role: 'CTO, TechInnovate', image: 'https://randomuser.me/api/portraits/women/11.jpg' },
          { name: 'Anita Desai', role: 'VP Engineering, GlobalTech', image: 'https://randomuser.me/api/portraits/women/12.jpg' }
        ],
        agenda: [
          { time: '09:00 - 10:00', title: 'Registration & Networking Breakfast' },
          { time: '10:00 - 11:00', title: 'Keynote: Breaking the Glass Ceiling in Tech' },
          { time: '11:15 - 12:30', title: 'Panel: Navigating Leadership Challenges' },
          { time: '12:30 - 13:30', title: 'Lunch & Networking' },
          { time: '13:30 - 15:00', title: 'Workshop: Strategic Decision Making' },
          { time: '15:15 - 16:30', title: 'Fireside Chat: Career Growth Strategies' },
          { time: '16:30 - 17:30', title: 'Closing Remarks & Networking' }
        ]
      },
      {
        id: 2,
        title: 'Returning to Work: Strategies for Success',
        description: 'This virtual workshop is designed for women returning to the workforce after a career break. Learn practical strategies for updating your skills, rebuilding confidence, navigating the job market, and successfully transitioning back to professional life.',
        date: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        location: 'Online',
        virtual: true,
        category: 'Workshop',
        image: 'https://picsum.photos/id/96/400/200',
        registrationUrl: 'https://example.com/events/register/2',
        price: 'Free',
        speakers: [
          { name: 'Meera Kapoor', role: 'Career Coach', image: 'https://randomuser.me/api/portraits/women/13.jpg' }
        ],
        agenda: [
          { time: '14:00 - 14:15', title: 'Introduction & Welcome' },
          { time: '14:15 - 14:45', title: 'Skill Assessment & Update Strategies' },
          { time: '14:45 - 15:15', title: 'Building Confidence & Handling Interview Questions' },
          { time: '15:15 - 15:45', title: 'Navigating Today\'s Job Market' },
          { time: '15:45 - 16:15', title: 'Q&A Session' }
        ]
      },
      {
        id: 3,
        title: 'Financial Planning for Career Transitions',
        description: 'Learn essential financial planning strategies to support your career transitions, whether you\'re changing industries, starting a business, or taking time off. This webinar covers budgeting, saving, investing, and managing financial risks.',
        date: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        location: 'Online',
        virtual: true,
        category: 'Webinar',
        image: 'https://picsum.photos/id/20/400/200',
        registrationUrl: 'https://example.com/events/register/3',
        price: 'Free',
        speakers: [
          { name: 'Neha Singh', role: 'Financial Advisor', image: 'https://randomuser.me/api/portraits/women/14.jpg' }
        ],
        agenda: [
          { time: '18:00 - 18:10', title: 'Introduction' },
          { time: '18:10 - 18:30', title: 'Budgeting for Career Transitions' },
          { time: '18:30 - 18:50', title: 'Emergency Funds & Insurance' },
          { time: '18:50 - 19:10', title: 'Investment Strategies' },
          { time: '19:10 - 19:30', title: 'Q&A Session' }
        ]
      },
      {
        id: 4,
        title: 'Networking Mixer: Women in STEM',
        description: 'Expand your professional network at this casual mixer for women in STEM fields. Connect with peers, mentors, and potential collaborators while enjoying refreshments in a relaxed setting.',
        date: new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        location: 'The Leela Palace, Bangalore',
        virtual: false,
        category: 'Networking',
        image: 'https://picsum.photos/id/26/400/200',
        registrationUrl: 'https://example.com/events/register/4',
        price: '₹500',
        speakers: [],
        agenda: [
          { time: '18:00 - 18:30', title: 'Arrival & Registration' },
          { time: '18:30 - 19:00', title: 'Welcome & Speed Networking' },
          { time: '19:00 - 20:30', title: 'Open Networking & Refreshments' },
          { time: '20:30 - 21:00', title: 'Wrap-up & Future Events Information' }
        ]
      },
      {
        id: 5,
        title: 'Digital Marketing Masterclass for Entrepreneurs',
        description: 'This hands-on workshop will teach women entrepreneurs effective digital marketing strategies to grow their businesses. Topics include social media marketing, content creation, SEO basics, and email marketing campaigns.',
        date: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        location: 'WeWork Galaxy, Residency Road, Bangalore',
        virtual: false,
        category: 'Workshop',
        image: 'https://picsum.photos/id/112/400/200',
        registrationUrl: 'https://example.com/events/register/5',
        price: '₹1,500',
        speakers: [
          { name: 'Shreya Jain', role: 'Digital Marketing Consultant', image: 'https://randomuser.me/api/portraits/women/15.jpg' }
        ],
        agenda: [
          { time: '09:30 - 10:00', title: 'Registration & Coffee' },
          { time: '10:00 - 11:15', title: 'Social Media Strategy Development' },
          { time: '11:30 - 12:45', title: 'Content Creation & Planning' },
          { time: '12:45 - 13:30', title: 'Lunch Break' },
          { time: '13:30 - 14:45', title: 'SEO Fundamentals' },
          { time: '15:00 - 16:15', title: 'Email Marketing Campaigns' },
          { time: '16:15 - 16:45', title: 'Q&A and Workshop Conclusion' }
        ]
      },
      {
        id: 6,
        title: 'Career Fair: Women in Technology',
        description: 'Connect with top employers committed to gender diversity in tech. This career fair features on-the-spot interviews, resume reviews, and networking opportunities with hiring managers from leading companies.',
        date: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        location: 'Sheraton Grand, Raja Nagar, Bangalore',
        virtual: false,
        category: 'Career Fair',
        image: 'https://picsum.photos/id/119/400/200',
        registrationUrl: 'https://example.com/events/register/6',
        price: 'Free',
        speakers: [],
        agenda: [
          { time: '10:00 - 16:00', title: 'Employer Booths Open' },
          { time: '10:30 - 12:30', title: 'Resume Review Sessions' },
          { time: '12:30 - 13:30', title: 'Lunch Break' },
          { time: '13:30 - 14:30', title: 'Panel: What Employers Are Looking For' },
          { time: '14:30 - 16:00', title: 'On-site Interviews' }
        ]
      },
      {
        id: 7,
        title: 'Panel Discussion: Building Inclusive Workplaces',
        description: 'This panel discussion brings together diversity and inclusion leaders to share strategies for creating more inclusive workplace cultures. Learn about best practices, challenges, and successful initiatives from different industries.',
        date: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        location: 'Online',
        virtual: true,
        category: 'Panel Discussion',
        image: 'https://picsum.photos/id/131/400/200',
        registrationUrl: 'https://example.com/events/register/7',
        price: 'Free',
        speakers: [
          { name: 'Ritu Sharma', role: 'Head of D&I, MegaCorp', image: 'https://randomuser.me/api/portraits/women/16.jpg' },
          { name: 'Arjun Singh', role: 'HR Director, TechGlobal', image: 'https://randomuser.me/api/portraits/men/17.jpg' },
          { name: 'Divya Mehta', role: 'Workplace Culture Consultant', image: 'https://randomuser.me/api/portraits/women/18.jpg' }
        ],
        agenda: [
          { time: '15:00 - 15:10', title: 'Introduction of Panelists' },
          { time: '15:10 - 15:40', title: 'Discussion: Current Challenges in Workplace Inclusion' },
          { time: '15:40 - 16:10', title: 'Discussion: Successful Diversity Initiatives' },
          { time: '16:10 - 16:40', title: 'Discussion: Measuring Impact & Future Trends' },
          { time: '16:40 - 17:00', title: 'Audience Q&A' }
        ]
      },
      {
        id: 8,
        title: 'Workshop: Negotiation Skills for Women',
        description: 'Develop effective negotiation skills for salary discussions, promotions, and workplace conflicts. This interactive workshop includes theory, role-playing exercises, and personalized feedback to help you become a more confident negotiator.',
        date: new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
        location: 'Hyatt Centric, MG Road, Bangalore',
        virtual: false,
        category: 'Workshop',
        image: 'https://picsum.photos/id/225/400/200',
        registrationUrl: 'https://example.com/events/register/8',
        price: '₹1,200',
        speakers: [
          { name: 'Sonali Patel', role: 'Negotiation Coach', image: 'https://randomuser.me/api/portraits/women/19.jpg' }
        ],
        agenda: [
          { time: '09:30 - 10:00', title: 'Welcome & Introduction' },
          { time: '10:00 - 11:00', title: 'Negotiation Fundamentals' },
          { time: '11:15 - 12:30', title: 'Salary Negotiation Techniques' },
          { time: '12:30 - 13:30', title: 'Lunch Break' },
          { time: '13:30 - 14:45', title: 'Role-Playing Exercises' },
          { time: '15:00 - 16:00', title: 'Handling Difficult Conversations' },
          { time: '16:00 - 16:30', title: 'Personalized Feedback & Conclusion' }
        ]
      }
    ];
    
    // Apply filters if provided
    let filteredEvents = [...events];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search)
      );
    }
    
    if (filters.category) {
      filteredEvents = filteredEvents.filter(event => 
        event.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.virtual !== undefined) {
      filteredEvents = filteredEvents.filter(event => 
        event.virtual === filters.virtual
      );
    }
    
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.date) >= startDate
        );
      }
      
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.date) <= endDate
        );
      }
    }
    
    // Sort by date (closest first)
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return filteredEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events. Please try again.');
  }
};

/**
 * Fetches a single event by ID
 * 
 * @param {string|number} eventId - ID of the event to fetch
 * @returns {Object} - Event object
 */
export const fetchEventById = async (eventId) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.get(`/events/${eventId}`);
    // return response.data;
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get all events and find the one with matching ID
    const events = await fetchEvents();
    const event = events.find(e => e.id.toString() === eventId.toString());
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    return event;
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    throw new Error('Failed to fetch event details. Please try again.');
  }
};

/**
 * Registers user for an event
 * 
 * @param {string|number} eventId - ID of the event to register for
 * @param {Object} registrationData - Registration details
 * @returns {Object} - Registration status
 */
export const registerForEvent = async (eventId, registrationData) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.post(`/events/${eventId}/register`, registrationData);
    // return response.data;
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate registration data
    if (!registrationData.name || !registrationData.email) {
      throw new Error('Name and email are required');
    }
    
    // Return success response
    return {
      success: true,
      registrationId: `reg-${Date.now()}`,
      message: 'Registration successful',
    };
  } catch (error) {
    console.error(`Error registering for event with ID ${eventId}:`, error);
    throw new Error('Failed to register for event. Please try again.');
  }
};

/**
 * Saves an event to user's calendar/favorites
 * 
 * @param {string|number} eventId - ID of the event to save
 * @returns {Object} - Save status
 */
export const saveEvent = async (eventId) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.post(`/events/${eventId}/save`);
    // return response.data;
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return success response
    return {
      success: true,
      message: 'Event saved to your calendar',
    };
  } catch (error) {
    console.error(`Error saving event with ID ${eventId}:`, error);
    throw new Error('Failed to save event. Please try again.');
  }
};