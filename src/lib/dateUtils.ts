import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export function formatRelativeTime(isoString: string | undefined): string {
  if (!isoString || isoString === 'Just now') return 'Just now';
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    
    // For very recent things (less than 1 minute)
    if (new Date().getTime() - date.getTime() < 60000) {
      return 'Just now';
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    return isoString;
  }
}

export function formatDateTime(isoString: string | undefined): string {
  if (!isoString || isoString === 'Just now') return 'Just now';
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy, h:mm a');
    }
  } catch (e) {
    return isoString;
  }
}
