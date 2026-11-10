# Security Specification — Pâmela Boccaletti Real Estate App

## 1. Data Invariants
1. **Public Property Access**: Only properties with `status == 'published'` are readable by unauthenticated visitors. Draft and archived properties are visible only to verified administrators.
2. **Leads Isolation & Integrity**: Public users can create inquiries (`leads`), but can NEVER read, update, or delete existing leads. Only verified administrators can read and update leads (status, notes).
3. **Admin Exclusivity**: The admin user bootstrap email is `juniorwebcode@gmail.com`. Admin rights require authenticated identity matching verified email or `/admins/{uid}` document lookup.
4. **Site Settings & Landing Pages**: Site settings and landing pages are readable by visitors, but can only be modified by verified administrators.
5. **Path ID & String Length Guards**: All document IDs must conform to `^[a-zA-Z0-9_\\-]+$` up to 128 characters. All text inputs (names, phones, descriptions) have upper bounds to eliminate resource exhaustion and Denial-of-Wallet attacks.
6. **No Self-Privilege Escalation**: Anonymous or standard users cannot create admin documents or elevate their own role.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Unauthenticated Lead Scraping**: `GET /leads/{leadId}` by unauthenticated visitor -> `PERMISSION_DENIED`
2. **Lead List Harvester**: `LIST /leads` by unauthenticated visitor -> `PERMISSION_DENIED`
3. **Property Price Modification by Visitor**: `UPDATE /properties/{propertyId}` with `{ price: 10 }` without admin auth -> `PERMISSION_DENIED`
4. **Draft Property Leak**: `GET /properties/{propertyId}` where `status == 'draft'` by unauthenticated visitor -> `PERMISSION_DENIED`
5. **Shadow Field Injection on Lead Creation**: `CREATE /leads/{leadId}` with `{ isAdmin: true, status: 'new' }` -> `PERMISSION_DENIED` (strictly defined keys)
6. **Oversized String Injection Attack**: `CREATE /leads/{leadId}` with 500KB message -> `PERMISSION_DENIED` (string size <= 2000 chars)
7. **Malicious Document ID**: `CREATE /leads/../../evil-id` -> `PERMISSION_DENIED` (regex guard)
8. **Admin Privilege Escalation via User Create**: `CREATE /admins/{myUid}` by unauthenticated user -> `PERMISSION_DENIED`
9. **Fake Admin Email Claim**: Request token claiming admin email with `email_verified == false` -> `PERMISSION_DENIED`
10. **Deletion of Properties by Public**: `DELETE /properties/{propertyId}` -> `PERMISSION_DENIED`
11. **Site Settings Vandalism**: `UPDATE /siteSettings/global` by unauthenticated user -> `PERMISSION_DENIED`
12. **Landing Page Deletion by Public**: `DELETE /landingPages/{landingPageId}` -> `PERMISSION_DENIED`
