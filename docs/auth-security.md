# Authentication & Security

This project implements **Supabase Authentication** with **Row Level Security (RLS)** to protect user data.

## 🛡 Row Level Security (RLS)

The `incidents` table in Supabase should be configured with the following policies:

1. **Insert Auth**: `Allow INSERT for authenticated users`.
2. **Owner Read/Write**: `Allow ALL for authenticated users where reporter_id = auth.uid()`.

## 🔑 Technical Authentication Flow

To allow field testing without a complex login UI, we use a **Silent Technical Login** pattern.

### `authService.ensureSession()`
This method is called automatically by the `useAuth` hook upon app initialization.

1. **Check Session**: It checks if a valid Supabase JWT exists in local storage.
2. **Silent Sign-In**: If no session is found, it uses `VITE_TECH_AUTH_EMAIL` and `VITE_TECH_AUTH_PASSWORD` from the `.env` file to authenticate silently.
3. **Identity Capture**: This ensures every incident created has a valid `reporter_id` linked to a real Supabase User, satisfying RLS requirements.

## 🔄 User Data Mapping
The `AppUser` model normalized metadata from Supabase:
- `id`: The UUID from `auth.users`.
- `role`: Extracted from `user_metadata.role` (defaults to `technician`).
- `name`: Extracted from metadata or email prefix.
