import axios from 'axios';

// API Services
import { fetchJobs } from '../api/jobsApi';
import { fetchEvents } from '../api/eventsApi';
import { fetchMentorships } from '../api/mentorshipApi';

// Services
import { performSemanticSearch } from '../utils/semanticSearch';
import { retrieveKnowledge } from '../utils/ragUtils';
import { analyzeIntent } from './nlpService';
import { trackEvent } from './analyticsService';

// Mock API endpoint for the AI model
const API_URL = 'https://api.jobsforher.org/asha-ai/chat';

// Process the user's message using RAG and other services
export const processUserMessage = async (message, conversationHistory) => {
  try {
    // Analyze user intent to determine the type of query
    const intent = await analyzeIntent(message);
    trackEvent('user_intent_detected', { intent });
    
    // Retrieve relevant knowledge based on the message and intent
    const knowledge = await retrieveKnowledge(message, intent);
    
    // Check if we need to include special data attachments
    let attachment = null;
    
    // Fetch data from APIs based on intent
    if (intent.includes('job')) {
      // For job-related queries, fetch and attach job listings
      const jobs = await fetchJobs();
      
      // Use semantic search to find most relevant job
      const relevantJobs = await performSemanticSearch(message, jobs, 'job');
      
      if (relevantJobs.length > 0) {
        attachment = {
          type: 'job',
          data: relevantJobs[0],
        };
      }
    } else if (intent.includes('event')) {
      // For event-related queries, fetch and attach events
      const events = await fetchEvents();
      
      // Use semantic search to find most relevant event
      const relevantEvents = await performSemanticSearch(message, events, 'event');
      
      if (relevantEvents.length > 0) {
        attachment = {
          type: 'event',
          data: relevantEvents[0],
        };
      }
    } else if (intent.includes('mentor')) {
      // For mentorship-related queries, fetch and attach mentorship programs
      const mentorships = await fetchMentorships();
      
      // Use semantic search to find most relevant mentorship program
      const relevantMentorships = await performSemanticSearch(message, mentorships, 'mentorship');
      
      if (relevantMentorships.length > 0) {
        attachment = {
          type: 'mentorship',
          data: relevantMentorships[0],
        };
      }
    }
    
    // In a real implementation, we would call the AI model API
    // For demo purposes, we'll simulate the API response
    
    // Prepare the chat context with conversation history and retrieved knowledge
    const context = {
      conversation: conversationHistory,
      knowledge: knowledge,
    };
    
    // Simulate API call
    // In a real implementation, we would call:
    // const response = await axios.post(API_URL, {
    //   message,
    //   context,
    // });
    
    // For demo, generate a simulated response
    const aiResponse = generateSimulatedResponse(message, intent, attachment);
    
    return {
      text: aiResponse,
      attachment,
    };
    
  } catch (error) {
    console.error('Error processing message:', error);
    throw new Error('Failed to process message. Please try again.');
  }
};

// Function to generate simulated responses for demo purposes
const generateSimulatedResponse = (message, intent, attachment) => {
  // Simulate thinking time
  const thinkingDelay = Math.random() * 1000 + 500;
  
  // Basic message patterns for different intents
  if (intent.includes('job')) {
    if (attachment) {
      return `I found a job opportunity that might interest you: ${attachment.data.title} at ${attachment.data.company}. This ${attachment.data.type} position is located in ${attachment.data.location}. Would you like me to find more similar opportunities?`;
    } else {
      return `I'd be happy to help you find job opportunities that match your interests and skills. Could you tell me more about the type of roles you're looking for or any specific industries you're interested in?`;
    }
  } else if (intent.includes('event')) {
    if (attachment) {
      return `I found an upcoming event you might be interested in: "${attachment.data.title}" on ${new Date(attachment.data.date).toLocaleDateString()}. It will be held ${attachment.data.virtual ? 'virtually' : `at ${attachment.data.location}`}. Would you like more details about this event?`;
    } else {
      return `There are several upcoming events hosted by JobsForHer Foundation. These events cover networking opportunities, skill development workshops, and career fairs. Would you like me to show you events in a specific category or time frame?`;
    }
  } else if (intent.includes('mentor')) {
    if (attachment) {
      return `I found a mentorship program that might be a good fit: "${attachment.data.title}" led by ${attachment.data.mentor}. This program focuses on ${attachment.data.focus} and runs for ${attachment.data.duration}. Would you like to learn more about how to apply?`;
    } else {
      return `JobsForHer Foundation offers various mentorship programs designed to help women advance in their careers. These programs connect mentees with experienced professionals who provide guidance, feedback, and support. What type of mentorship are you looking for?`;
    }
  } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return `Hello! I'm Asha, an AI assistant for JobsForHer Foundation. I can help you explore career opportunities, find job listings, learn about community events, or connect with mentorship programs. How can I assist you today?`;
  } else if (intent.includes('help')) {
    return `I'd be happy to help! As Asha, I can assist you with:
    
1. Finding job opportunities tailored to your skills and interests
2. Discovering upcoming events and workshops
3. Exploring mentorship programs
4. Providing information about women's career development resources

What would you like to know more about?`;
  } else {
    return `Thank you for your message. I'm Asha, an AI assistant dedicated to helping women advance in their careers. I can provide information about job opportunities, events, mentorship programs, and more. Could you please specify what kind of career information you're looking for, and I'll do my best to assist you?`;
  }
};

// Function to extract entities from user messages
export const extractEntities = (message) => {
  const entities = {
    jobTypes: [],
    locations: [],
    skills: [],
    industries: [],
    experience: [],
  };
  
  // Simple keyword matching for demo purposes
  // In a real app, this would use more sophisticated NLP
  
  // Job types
  const jobTypeKeywords = ['full-time', 'part-time', 'contract', 'remote', 'hybrid', 'internship'];
  jobTypeKeywords.forEach(type => {
    if (message.toLowerCase().includes(type)) {
      entities.jobTypes.push(type);
    }
  });
  
  // Skills (simplified list)
  const skillKeywords = ['programming', 'marketing', 'design', 'sales', 'management', 'finance', 'hr', 'communication'];
  skillKeywords.forEach(skill => {
    if (message.toLowerCase().includes(skill)) {
      entities.skills.push(skill);
    }
  });
  
  // Industries
  const industryKeywords = ['tech', 'healthcare', 'finance', 'education', 'retail', 'manufacturing'];
  industryKeywords.forEach(industry => {
    if (message.toLowerCase().includes(industry)) {
      entities.industries.push(industry);
    }
  });
  
  return entities;
};