
import { Event } from '@/data/mockEvents';

// Enhanced word lists for better pattern matching
const FOOD_TERMS = [
  'food', 'pizza', 'breakfast', 'lunch', 'dinner', 'snack', 'eat', 'meal', 
  'refreshment', 'catering', 'buffet', 'cuisine', 'drink', 'beverage', 'coffee',
  'sandwich', 'bagel', 'donut', 'cookie', 'fruit', 'vegetables', 'salad'
];

const ACADEMIC_TERMS = [
  'class', 'study', 'lecture', 'professor', 'academic', 'course', 'tutoring', 
  'workshop', 'seminar', 'research', 'laboratory', 'lab', 'project', 'assignment',
  'exam', 'test', 'quiz', 'presentation', 'thesis', 'dissertation', 'education',
  'learning', 'teaching', 'faculty', 'student', 'graduate', 'undergraduate'
];

const CAREER_TERMS = [
  'career', 'job', 'internship', 'resume', 'interview', 'network', 'fair',
  'employment', 'recruit', 'hiring', 'professional', 'industry', 'company',
  'business', 'corporate', 'skill', 'opportunity', 'position', 'application'
];

const SOCIAL_TERMS = [
  'social', 'party', 'meet', 'friend', 'fun', 'hang out', 'gathering', 'mixer',
  'celebration', 'event', 'club', 'organization', 'group', 'community', 'society',
  'entertainment', 'recreation', 'activity', 'game', 'sport', 'competition'
];

const TECHNOLOGY_TERMS = [
  'tech', 'coding', 'programming', 'computer', 'software', 'hardware', 'hackathon',
  'development', 'app', 'application', 'website', 'internet', 'digital', 'data',
  'algorithm', 'artificial intelligence', 'ai', 'machine learning', 'ml', 'cybersecurity',
  'security', 'network', 'database', 'cloud', 'web', 'mobile', 'game', 'virtual reality',
  'vr', 'augmented reality', 'ar', 'blockchain', 'cryptocurrency'
];

// Event theme vector space for semantic matching (simplified)
const EVENT_THEMES = {
  "Academic": new Set(ACADEMIC_TERMS),
  "Career": new Set(CAREER_TERMS),
  "Social": new Set(SOCIAL_TERMS),
  "Technology": new Set(TECHNOLOGY_TERMS),
  "Food": new Set(FOOD_TERMS),
  // More categories can be added here
};

/**
 * Calculates Jaccard similarity between two sets
 * (intersection size divided by union size)
 */
const calculateJaccardSimilarity = (setA: Set<string>, setB: Set<string>): number => {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
};

/**
 * Advanced tokenization function that handles various linguistic features
 */
const tokenizeText = (text: string): string[] => {
  // Convert to lowercase for consistency
  const normalizedText = text.toLowerCase()
    // Replace punctuation with spaces to separate words
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split by space and filter out empty strings
  return normalizedText.split(' ').filter(token => token.length > 0);
};

/**
 * Create a bag-of-words representation of text
 */
const createBagOfWords = (text: string): Set<string> => {
  return new Set(tokenizeText(text));
};

// Filter events based on search query
export const filterEventsByQuery = (events: Event[], query: string): Event[] => {
  if (!query) return events;
  
  const normalizedQuery = query.toLowerCase();
  const queryTokens = createBagOfWords(normalizedQuery);
  
  return events.filter(event => {
    // Calculate relevance score based on multiple fields
    const titleTokens = createBagOfWords(event.title);
    const descriptionTokens = createBagOfWords(event.description);
    const locationTokens = createBagOfWords(event.location);
    const categoryTokens = new Set(event.categories.map(cat => cat.toLowerCase()));
    
    // Combine all tokens related to the event
    const allEventTokens = new Set([
      ...titleTokens, 
      ...descriptionTokens, 
      ...locationTokens, 
      ...categoryTokens
    ]);
    
    // Calculate similarity using Jaccard coefficient
    const similarityScore = calculateJaccardSimilarity(queryTokens, allEventTokens);
    
    // Threshold for relevance (can be adjusted)
    return similarityScore > 0.05;
  });
};

// Filter events based on selected categories
export const filterEventsByCategories = (events: Event[], categories: string[]): Event[] => {
  if (!categories.length) return events;
  
  return events.filter(event => {
    return event.categories.some(category => categories.includes(category));
  });
};

// Filter events based on free food availability
export const filterEventsByFreeFood = (events: Event[], hasFreeFood: boolean): Event[] => {
  if (!hasFreeFood) return events;
  
  return events.filter(event => event.hasFreeFood);
};

// Filter events based on user persona (Commuter or Resident)
export const filterEventsByPersona = (events: Event[], persona: 'commuter' | 'resident'): Event[] => {
  if (persona === 'commuter') {
    // Prioritize daytime events, events with food, and commuter-specific activities
    return events.filter(event => {
      const isCommuter = event.categories.includes('Commuter');
      const hasFreeFood = event.hasFreeFood;
      
      // Check if it's a daytime event (between 8AM and 5PM)
      const startTime = event.time;
      const isDaytime = startTime.includes('AM') || 
                        (startTime.includes('PM') && 
                         parseInt(startTime.split(':')[0]) < 5);
      
      return isCommuter || hasFreeFood || isDaytime;
    });
  } else {
    // For resident mode, prioritize residence hall events and evening activities
    return events.filter(event => {
      const isResident = event.categories.includes('Resident');
      
      // Check if it's an evening event (after 5PM)
      const startTime = event.time;
      const isEvening = startTime.includes('PM') && 
                        parseInt(startTime.split(':')[0]) >= 5;
      
      return isResident || isEvening;
    });
  }
};

/**
 * Enhanced NLP function to process natural language queries with better pattern matching
 * and intention recognition.
 */
export const processNaturalLanguageQuery = (query: string): { 
  processedQuery: string;
  categories: string[];
  hasFreeFood: boolean;
} => {
  const normalizedQuery = query.toLowerCase();
  const queryTokens = tokenizeText(normalizedQuery);
  const querySet = new Set(queryTokens);
  
  const result = {
    processedQuery: query,
    categories: [] as string[],
    hasFreeFood: false
  };
  
  // Enhanced food detection with broader term matching
  for (const term of FOOD_TERMS) {
    if (normalizedQuery.includes(term)) {
      if (!result.categories.includes('Food')) {
        result.categories.push('Food');
      }
      break;
    }
  }
  
  // Check for free food specifically - using more context-aware patterns
  if (
    (normalizedQuery.includes('free') && result.categories.includes('Food')) ||
    normalizedQuery.includes('free food') || 
    normalizedQuery.includes('free pizza') || 
    normalizedQuery.includes('free breakfast') || 
    normalizedQuery.includes('free lunch') || 
    normalizedQuery.includes('free dinner') || 
    normalizedQuery.includes('free snack')
  ) {
    result.hasFreeFood = true;
  }
  
  // Semantic matching for categories using Jaccard similarity
  for (const [category, termSet] of Object.entries(EVENT_THEMES)) {
    const similarity = calculateJaccardSimilarity(querySet, termSet);
    
    // Add category if similarity passes threshold
    if (similarity > 0.05 && !result.categories.includes(category)) {
      result.categories.push(category);
    }
  }
  
  // Handle time-based queries
  if (
    normalizedQuery.includes('morning') || 
    normalizedQuery.includes('early') ||
    normalizedQuery.includes('breakfast')
  ) {
    // Morning events - no category change but can be used for time filtering
  } else if (
    normalizedQuery.includes('evening') || 
    normalizedQuery.includes('night') ||
    normalizedQuery.includes('late')
  ) {
    // Evening events - more likely social
    if (!result.categories.includes('Social')) {
      result.categories.push('Social');
    }
  }
  
  // Handle location-based queries (residence halls vs academic buildings)
  if (
    normalizedQuery.includes('residence') || 
    normalizedQuery.includes('dorm') ||
    normalizedQuery.includes('housing')
  ) {
    if (!result.categories.includes('Resident')) {
      result.categories.push('Resident');
    }
  } else if (
    normalizedQuery.includes('class') || 
    normalizedQuery.includes('building') ||
    normalizedQuery.includes('hall') && !normalizedQuery.includes('residence')
  ) {
    if (!result.categories.includes('Academic')) {
      result.categories.push('Academic');
    }
  }
  
  return result;
};

/**
 * Analyzes event descriptions to suggest additional categories
 * using simple keyword-based semantic analysis
 */
export const suggestEventCategories = (description: string): string[] => {
  const normalizedText = description.toLowerCase();
  const textTokens = createBagOfWords(normalizedText);
  const suggestedCategories: string[] = [];
  
  // Use Jaccard similarity to find matching categories
  for (const [category, termSet] of Object.entries(EVENT_THEMES)) {
    const similarity = calculateJaccardSimilarity(textTokens, termSet);
    
    // Add category if similarity passes threshold
    if (similarity > 0.08) {
      suggestedCategories.push(category);
    }
  }
  
  return suggestedCategories;
};

/**
 * Get recommended events based on user preferences and past interactions
 * without relying on external API calls
 */
export const getRecommendedEvents = (
  events: Event[], 
  viewedEvents: string[] = [], 
  userInterests: string[] = [],
  userPersona: 'commuter' | 'resident' = 'commuter'
): Event[] => {
  // Convert interests and viewed events to sets for faster lookups
  const interestsSet = new Set(userInterests.map(i => i.toLowerCase()));
  const viewedEventsSet = new Set(viewedEvents);
  
  // Score each event based on multiple factors
  const scoredEvents = events.map(event => {
    let score = 0;
    
    // Don't recommend already viewed events as strongly
    if (viewedEventsSet.has(event.id)) {
      score -= 5;
    }
    
    // Higher score for events matching user interests
    event.categories.forEach(category => {
      if (interestsSet.has(category.toLowerCase())) {
        score += 3;
      }
    });
    
    // Persona-based scoring
    if (userPersona === 'commuter') {
      // Commuters prefer daytime events and those with free food
      const startTime = event.time;
      const isDaytime = startTime.includes('AM') || 
                       (startTime.includes('PM') && parseInt(startTime.split(':')[0]) < 5);
      
      if (isDaytime) score += 2;
      if (event.hasFreeFood) score += 2;
      if (event.categories.includes('Commuter')) score += 3;
    } else {
      // Residents prefer evening events and those in residence halls
      const startTime = event.time;
      const isEvening = startTime.includes('PM') && parseInt(startTime.split(':')[0]) >= 5;
      
      if (isEvening) score += 2;
      if (event.categories.includes('Resident')) score += 3;
      
      // Check if location is a residence hall
      const location = event.location.toLowerCase();
      if (
        location.includes('hall') || 
        location.includes('residence') || 
        location.includes('dorm')
      ) {
        score += 2;
      }
    }
    
    return { event, score };
  });
  
  // Sort by score (highest first) and return the events
  return scoredEvents
    .sort((a, b) => b.score - a.score)
    .map(item => item.event);
};

/**
 * Calculate semantic similarity between query and text
 * using a simple bag-of-words approach with Jaccard similarity
 */
export const calculateSemanticSimilarity = (query: string, text: string): number => {
  const queryTokens = createBagOfWords(query);
  const textTokens = createBagOfWords(text);
  
  return calculateJaccardSimilarity(queryTokens, textTokens);
};

/**
 * Perform semantic search on events without external API calls
 */
export const semanticSearchEvents = (events: Event[], query: string): Event[] => {
  if (!query.trim()) return events;
  
  // Calculate similarity scores for each event
  const scoredEvents = events.map(event => {
    // Combine all relevant text fields
    const eventText = `${event.title} ${event.description} ${event.categories.join(' ')}`;
    
    // Calculate similarity score
    const score = calculateSemanticSimilarity(query, eventText);
    
    return { event, score };
  });
  
  // Sort by similarity score (highest first) and filter low relevance
  return scoredEvents
    .filter(item => item.score > 0.05) // Only return somewhat relevant results
    .sort((a, b) => b.score - a.score)
    .map(item => item.event);
};
