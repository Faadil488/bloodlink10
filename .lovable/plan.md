## Plan: BloodLink Kerala MVP

Build a premium responsive web application for emergency blood donor discovery across Kerala, replacing the current placeholder page with a full healthcare-tech product experience.

## Scope for this implementation

### 1. Public marketing website
Create a polished public frontend with separate SEO-friendly routes:

```text
/                 Home
/search           Donor search + map
/sos              Emergency SOS request
/register         Donor registration
/login            Login
```

Homepage sections:
- Sticky transparent navbar that becomes solid on scroll
- Hero section with “Find Donors Near Me” and “Become a Donor” CTAs
- Quick blood donor search module
- “Why BloodLink works” feature cards
- Kerala coverage section covering all 14 districts
- Animated statistics
- Testimonials
- Footer with key links

Design direction:
- Clean white healthcare UI
- Emergency red accents
- Soft red/pink gradients
- Glassmorphism cards
- Floating hero cards
- Subtle shadows and premium micro-interactions
- Fully responsive mobile-first layout

### 2. Donor search experience
Create a donor discovery page with:
- Blood group filter
- District filter
- Radius filter
- Available-only toggle
- Verified-only toggle
- Desktop split layout: results list on the left, map on the right
- Mobile list/map toggle
- Donor result cards showing:
  - Name
  - Blood group
  - Area and district
  - Approximate distance
  - Availability badge
  - Verified badge
  - Request contact button

The first version will use seeded sample Kerala donor data so the UI works immediately. After approval, this can be connected to real user-generated records through the backend.

### 3. Interactive Kerala map
Add a real Leaflet + OpenStreetMap map with:
- Kerala-centered default view
- District-level zoom behavior
- User location detection when permitted
- Pulsing current-location marker
- Custom marker styles for:
  - Available donors
  - Unavailable donors
  - Hospitals
  - Blood banks
- Marker popups with quick details
- Filter synchronization with the search results
- Lazy loading so the map does not slow the first page load

### 4. Emergency SOS page
Create an emergency request page with:
- Large animated SOS CTA area
- Form fields:
  - Name
  - Phone
  - Blood group needed
  - District
  - Hospital
  - Urgency level
  - Additional notes
- Clear validation messages
- Success confirmation after submission
- Emergency-focused visual treatment without feeling alarmist

### 5. Authentication and donor registration
Use the platform’s supported web stack rather than PHP/XAMPP. Implement authentication through Lovable Cloud/Supabase-style auth.

Registration/login flow:
- Donor registration page
- Email/password login
- Secure password handling through auth provider
- User profile records for donor-specific information
- Separate role table for `user`, `donor`, and `admin` roles

Donor profile data to store:
- Full name
- Email
- Phone
- Blood group
- District
- Area
- Latitude/longitude when available
- Last donation date
- Availability status
- Verification status

### 6. Donor dashboard
Create a protected donor dashboard route:

```text
/dashboard
```

Modules:
- Availability toggle
- Edit donor profile section
- Requests received list
- Donation history preview
- Profile strength meter
- Basic dashboard stats

Use route guards so protected content does not flash before login.

### 7. Admin dashboard
Create a protected admin area:

```text
/admin
```

Modules:
- KPI cards
- Manage users/donors
- Verify donors
- Add/manage hospitals
- Add/manage blood banks
- View SOS requests
- Remove suspicious/fake records

Admin access will be controlled server-side using a dedicated roles table, not client-side flags.

### 8. Backend data model
Create database-backed functionality for production-level behavior.

Recommended tables:

```text
profiles
- id
- user_id
- full_name
- email
- phone
- created_at

user_roles
- id
- user_id
- role

donors
- id
- user_id
- blood_group
- district
- area
- latitude
- longitude
- available
- verified
- last_donation
- created_at

blood_requests
- id
- requester_name
- phone
- blood_group
- district
- hospital
- urgency
- notes
- status
- created_at

hospitals
- id
- name
- district
- latitude
- longitude
- created_at

blood_banks
- id
- name
- district
- latitude
- longitude
- created_at

donation_history
- id
- donor_id
- donation_date
- location
- notes
```

Security rules:
- Users can only edit their own profile and donor record
- Donors can see requests relevant to them
- Admins can manage verification, hospitals, blood banks, SOS requests, and suspicious records
- Admin status checked server-side through `user_roles`
- Inputs validated before writes

### 9. Kerala coverage seed data
Add predefined Kerala support data:
- All 14 districts
- District coordinates for map focusing
- Sample hospitals
- Sample blood banks
- Sample donors for demo/search functionality

Districts:
- Thiruvananthapuram
- Kollam
- Pathanamthitta
- Alappuzha
- Kottayam
- Idukki
- Ernakulam
- Thrissur
- Palakkad
- Malappuram
- Kozhikode
- Wayanad
- Kannur
- Kasaragod

### 10. Animations and premium polish
Add subtle motion throughout:
- Page fade transitions
- Floating hero cards
- Animated gradient background
- Button hover lift/glow
- Card hover elevation
- Counter-up stats
- Map marker entrance animation
- Pulsing location dot
- Dashboard stat card slide-in
- Skeleton loading states for map/results/dashboard areas

Animations will stay professional and lightweight to preserve performance.

### 11. Metadata and quality
Update app metadata from “Lovable App” to BloodLink Kerala.

Each public route will include its own title and description for search/social sharing:
- Home
- Search
- SOS
- Register
- Login

Quality targets:
- Mobile-first responsive UI
- Fast initial load
- Lazy-loaded map assets
- Accessible forms and buttons
- Clear loading, empty, and error states

## Technical adaptation note

The PRD recommends PHP, MySQL, Bootstrap, and XAMPP, but this existing project is a TanStack Start React application. The implementation will use the project’s current supported stack:

```text
Frontend: React + TanStack Start + Tailwind CSS
Backend/database/auth: Lovable Cloud / Supabase-style backend
Maps: Leaflet + OpenStreetMap
Animations: CSS/Tailwind motion utilities, with lightweight React effects where useful
```

This preserves the product requirements while fitting the actual project architecture and deployment environment.

## Implementation order

1. Replace placeholder homepage and update global metadata/design tokens.
2. Add shared layout components: navbar, footer, cards, form helpers, district/blood-group constants.
3. Build public pages: home, search, SOS, register, login.
4. Add Leaflet map and Kerala sample data.
5. Enable backend database/auth and create secure tables/policies.
6. Connect registration, login, donor profiles, SOS requests, hospitals, and blood banks to the database.
7. Build protected donor dashboard.
8. Build protected admin dashboard with role-based access.
9. Add animations, skeleton loaders, responsive refinements, and final polish.