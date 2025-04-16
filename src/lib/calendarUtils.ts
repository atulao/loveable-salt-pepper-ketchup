
/**
 * Calendar integration utilities for generating calendar links
 */
import { getEnhancedLocation } from './locationUtils';

/**
 * Format a date and time string into an ISO format used by calendar services
 * @param dateString - Date in string format (YYYY-MM-DD)
 * @param timeString - Time in string format (e.g. "2:00 PM")
 * @returns ISO formatted date string
 */
export const formatCalendarDateTime = (dateString: string, timeString: string): string => {
  // Parse the time string properly
  const [hourPart, minutePart] = timeString.split(':');
  
  // Extract minutes and period (AM/PM)
  const minutesMatch = minutePart.match(/(\d+)\s*([APap][Mm])/);
  if (!minutesMatch) {
    console.error(`Invalid time format: ${timeString}`);
    return new Date().toISOString(); // Fallback to current time
  }
  
  const minutes = parseInt(minutesMatch[1]);
  const period = minutesMatch[2].toUpperCase();
  
  let hour = parseInt(hourPart);
  
  // Convert 12-hour format to 24-hour format
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  // Create a new date object with the correct parsing
  // First ensure the date string is in the correct format
  const [year, month, day] = dateString.split('-').map(num => parseInt(num));
  
  // JavaScript months are 0-indexed, so we subtract 1 from the month
  const date = new Date(year, month - 1, day, hour, minutes);
  
  // Log the input and resulting date for debugging
  console.log(`Date input: ${dateString} ${timeString}`);
  console.log(`Parsed date: ${date.toISOString()}`);
  
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

/**
 * Generate a Google Calendar event URL
 */
export const generateGoogleCalendarUrl = (
  title: string,
  description: string,
  location: string,
  startDateTime: string,
  endDateTime: string
): string => {
  // Use enhanced location with coordinates
  const enhancedLocation = getEnhancedLocation(location);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    location: enhancedLocation,
    dates: `${startDateTime}/${endDateTime}`,
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generate an iCal file download for Apple Calendar and other iCal-compatible calendars
 */
export const generateICalString = (
  title: string,
  description: string,
  location: string,
  startDateTime: string,
  endDateTime: string
): string => {
  // Use enhanced location with coordinates
  const enhancedLocation = getEnhancedLocation(location);
  
  // Create a UID for the event based on title and start time
  const uid = `${title.replace(/\s+/g, '')}-${startDateTime}@njit-events.com`;
  
  // Format current timestamp for DTSTAMP
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  
  // Remove colons and other formatting from the ISO strings
  const start = startDateTime.replace(/[-:]/g, '');
  const end = endDateTime.replace(/[-:]/g, '');
  
  // Escape special characters in text fields
  const escapedTitle = title.replace(/,/g, '\\,').replace(/;/g, '\\;');
  const escapedLocation = enhancedLocation.replace(/,/g, '\\,').replace(/;/g, '\\;');
  const escapedDescription = description.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NJIT//Events Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapedTitle}`,
    `DESCRIPTION:${escapedDescription}`,
    `LOCATION:${escapedLocation}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
};

/**
 * Generate calendar URLs for different platforms
 */
export const generateCalendarUrls = (
  title: string,
  description: string,
  location: string,
  dateString: string,
  startTimeString: string,
  endTimeString: string
) => {
  console.log(`Generating calendar URLs for: ${dateString} from ${startTimeString} to ${endTimeString}`);
  
  // Format dates for calendar services
  const startDateTime = formatCalendarDateTime(dateString, startTimeString);
  const endDateTime = formatCalendarDateTime(dateString, endTimeString);
  
  // Use enhanced location with coordinates
  const enhancedLocation = getEnhancedLocation(location);
  
  return {
    google: generateGoogleCalendarUrl(title, description, location, startDateTime, endDateTime),
    ical: `data:text/calendar;charset=utf8,${encodeURIComponent(
      generateICalString(title, description, location, startDateTime, endDateTime)
    )}`,
    // Outlook Web uses the same format as Google Calendar but with enhanced location
    outlook: `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&location=${encodeURIComponent(enhancedLocation)}&body=${encodeURIComponent(description)}&startdt=${encodeURIComponent(startDateTime)}&enddt=${encodeURIComponent(endDateTime)}`,
  };
};

/**
 * Download an iCal file
 */
export const downloadICalFile = (
  title: string,
  description: string,
  location: string,
  dateString: string,
  startTimeString: string,
  endTimeString: string
) => {
  const startDateTime = formatCalendarDateTime(dateString, startTimeString);
  const endDateTime = formatCalendarDateTime(dateString, endTimeString);
  
  const icalString = generateICalString(
    title,
    description,
    location,
    startDateTime,
    endDateTime
  );
  
  const blob = new Blob([icalString], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.replace(/\s+/g, '-')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
