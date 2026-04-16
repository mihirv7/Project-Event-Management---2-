export const stats = [
  { label: 'Total Users', value: '12,480', growth: '+18.2%', type: 'users' },
  { label: 'Active Events', value: '128', growth: '+9.4%', type: 'events' },
  { label: 'Bookings', value: '2,986', growth: '+14.1%', type: 'bookings' },
  { label: 'Revenue', value: '₹8.4L', growth: '+22.8%', type: 'payments' },
]

export const chartData = [
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 55 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 64 },
  { month: 'Jun', value: 88 },
]

export const recentActivities = [
  { title: 'New user registered: Rahul Patel', time: '5 minutes ago' },
  { title: 'Premium Wedding Package added', time: '22 minutes ago' },
  { title: 'Corporate Event updated successfully', time: '1 hour ago' },
  { title: 'Payment received for Music Night', time: '2 hours ago' },
]

export const users = [
  { id: 1, name: 'Rahul Patel', email: 'rahul@example.com', role: 'Customer', status: 'Active' },
  { id: 2, name: 'Sneha Shah', email: 'sneha@example.com', role: 'Organizer', status: 'Active' },
  { id: 3, name: 'Karan Mehta', email: 'karan@example.com', role: 'Customer', status: 'Pending' },
  { id: 4, name: 'Priya Desai', email: 'priya@example.com', role: 'Vendor', status: 'Blocked' },
]

export const events = [
  { id: 1, name: 'Royal Wedding Night', category: 'Wedding', date: '2026-04-12', location: 'Surat', status: 'Active' },
  { id: 2, name: 'Corporate Annual Meet', category: 'Corporate', date: '2026-04-25', location: 'Ahmedabad', status: 'Upcoming' },
  { id: 3, name: 'DJ Music Festival', category: 'Music', date: '2026-05-08', location: 'Vadodara', status: 'Draft' },
]

export const packages = [
  { id: 1, name: 'Silver Package', price: '₹15,000', events: 'Birthday / Small Event', status: 'Active' },
  { id: 2, name: 'Gold Package', price: '₹35,000', events: 'Wedding / Corporate', status: 'Popular' },
  { id: 3, name: 'Platinum Package', price: '₹75,000', events: 'Luxury Events', status: 'Premium' },
]

export const bookings = [
  { id: 101, customer: 'Aman Joshi', event: 'Wedding Night', package: 'Gold', amount: '₹35,000', status: 'Confirmed' },
  { id: 102, customer: 'Nidhi Shah', event: 'Birthday Bash', package: 'Silver', amount: '₹15,000', status: 'Pending' },
  { id: 103, customer: 'Riya Patel', event: 'Corporate Meet', package: 'Platinum', amount: '₹75,000', status: 'Paid' },
]

export const vendors = [
  { id: 1, name: 'DJ Rax', service: 'DJ', city: 'Surat', status: 'Approved' },
  { id: 2, name: 'Glow Decor', service: 'Decoration', city: 'Ahmedabad', status: 'Pending' },
  { id: 3, name: 'Food Fiesta', service: 'Catering', city: 'Vadodara', status: 'Approved' },
]

export const payments = [
  { id: 'PAY-001', customer: 'Aman Joshi', amount: '₹35,000', method: 'UPI', status: 'Success' },
  { id: 'PAY-002', customer: 'Nidhi Shah', amount: '₹15,000', method: 'Card', status: 'Pending' },
  { id: 'PAY-003', customer: 'Riya Patel', amount: '₹75,000', method: 'Net Banking', status: 'Success' },
]

export const reviews = [
  { id: 1, user: 'Neha', event: 'Wedding Night', rating: '5/5', comment: 'Amazing arrangements!', status: 'Published' },
  { id: 2, user: 'Jay', event: 'Corporate Meet', rating: '4/5', comment: 'Very professional team.', status: 'Published' },
  { id: 3, user: 'Mira', event: 'Birthday Bash', rating: '3/5', comment: 'Good but can improve timing.', status: 'Pending' },
]
