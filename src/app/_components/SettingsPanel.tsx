"use client";

import { useEffect, useState } from "react";
import { showToast } from "./ToastProvider";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">("profile");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profile updated successfully", "success");
    onClose();
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Preferences saved", "success");
    onClose();
  };

  return (
    <>
      <div className={`settings-panel ${isOpen ? "open" : ""}`}>
        <div className="settings-header">
          <h3 className="settings-title">Account & Settings</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="settings-tabs">
          <button className={`settings-tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>Profile</button>
          <button className={`settings-tab ${activeTab === "preferences" ? "active" : ""}`} onClick={() => setActiveTab("preferences")}>Preferences</button>
        </div>

        <div className="settings-content">
          {activeTab === "profile" ? (
            <form onSubmit={handleSaveProfile}>
              <div className="settings-avatar-row">
                <div className="settings-avatar-big">JH</div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 700 }}>Jenny Howard</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Super Admin</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" defaultValue="Jenny Howard" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" defaultValue="j.howard@pricabe.co.zw" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" defaultValue="+263 77 123 4567" />
              </div>
              
              <div className="settings-section" style={{ marginTop: "2rem" }}>
                <div className="settings-section-label">Security</div>
                <button type="button" className="client-btn" style={{ width: "100%", background: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border-color)" }}>Change Password</button>
              </div>

              <button type="submit" className="btn settings-save-btn">Save Profile</button>
            </form>
          ) : (
            <form onSubmit={handleSavePreferences}>
              <div className="settings-section">
                <div className="settings-section-label">Application Settings</div>
                
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Compact Tables</div>
                    <div className="settings-toggle-sub">Reduce padding in data tables</div>
                  </div>
                  <button type="button" className="toggle-switch" onClick={e => e.currentTarget.classList.toggle("on")}></button>
                </div>
                
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Email Notifications</div>
                    <div className="settings-toggle-sub">Receive daily summary reports</div>
                  </div>
                  <button type="button" className="toggle-switch on" onClick={e => e.currentTarget.classList.toggle("on")}></button>
                </div>
              </div>

              <div className="settings-section">
                <div className="settings-section-label">Regional</div>
                <div className="form-group">
                  <label className="form-label">Default Date Format</label>
                  <select className="form-select" defaultValue="DD/MM/YYYY">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn settings-save-btn">Save Preferences</button>
            </form>
          )}
        </div>
      </div>
      
      {/* Overlay to close the panel when clicking outside */}
      {isOpen && (
        <div className="sidebar-overlay" style={{ zIndex: 290 }} onClick={onClose}></div>
      )}
    </>
  );
}
