# Precabe ERP - Master Reference Log

This document tracks all major interactive upgrades and system modifications.

## [Current Phase] - HR, Payroll, Fuel & POS Upgrades
**Date:** July 2026

### 1. Human Resources (HR) System Upgrade
- **Comprehensive Profiles:** Upgraded the `Staff` database schema to include `phone`, `email`, `address`, `nextOfKin`, `hireDate`, `status`, and `notes`.
- **HR Portal UI:** Built a dedicated HR dashboard (`/hr`) featuring a premium gradient background.
- **Interactive Modals:** Added an "Add Employee" and "Edit Employee" form modal for full CRUD capabilities.
- **Secure Terminations:** Implemented a "Deactivate / Activate" toggle for staff. Terminated staff are marked as `Inactive`, preserving their payroll history without cluttering the active roster.
- **Advanced UI Controls:** Added a real-time search bar to find employees by name/role. Added a Sort By dropdown (Alphabetical, Highest Salary, Lowest Salary, By Department). Added a view toggle (Grid View vs List View).
- **Admin Dashboard Integration:** Ensure the executive dashboard (`/hrm`) strictly filters out `Inactive` employees to maintain accurate active headcounts.

### 2. Payroll Management
- **CSV Export:** Added a fully functional "Export Payslips (CSV)" button to the Payroll dashboard, allowing accountants to download the monthly roster, Gross Pay, PAYE, and NSSA data directly into Excel.

### 3. POS & Retail Operations
- **Markup Fixes:** Fixed a critical bug in the Point of Sale system where the Grand Total was hardcoded to a 100% markup (cost * 2). It has now been corrected to match the intended 20% markup displayed on the items.
- **Dynamic Pricing Display:** Updated POS item cards to clearly show Cost Price, Markup, and Final Selling Price.

### 4. Fuel Management
- **Tank Configuration:** Ran a backend seed script to officially register the 5000L Petrol Tank (`KW-TANK-P1`), making it available in the dropdown menus.
- **Fuel Receipts Logic:** Fixed a severe bug in the `logFuelAction` server action where fuel *receipts* were being treated as *dispatches*, resulting in a false "Not enough fuel in tank" error when trying to fill an empty tank.

---

*End of Log*
