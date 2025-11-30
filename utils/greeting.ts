export const getGreeting = (name: string): string => {
  const hour = new Date().getHours();
  const firstName = name.split(' ')[0]; // Get first name only
  if (hour < 12) return `Good Morning, ${firstName}`;
  if (hour < 17) return `Good Afternoon, ${firstName}`;
  return `Good Evening, ${firstName}`;
};

