// src/config/permissions.js

const permissions = {
  // 📌 Proposal Module Permissions
  proposal: {
    super_admin:    { canView: true, canAdd: true, canEdit: true, canDelete: true },
    admin:          { canView: true, canAdd: true, canEdit: true, canDelete: true },
    center_manager: { canView: true, canAdd: false, canEdit: false, canDelete: false },
    state_head:     { canView: true, canAdd: false, canEdit: false, canDelete: false },
    qt:             { canView: true, canAdd: false, canEdit: false, canDelete: false },
    mis:            { canView: true, canAdd: false, canEdit: false, canDelete: false },
    trainer:        { canView: true, canAdd: false, canEdit: false, canDelete: false }
  },

  // 📌 Project Module Permissions
  project: {
    super_admin:    { canView: true, canAdd: true, canEdit: true, canDelete: true },
    admin:          { canView: true, canAdd: true, canEdit: true, canDelete: true },
    center_manager: { canView: true, canAdd: false, canEdit: false, canDelete: false },
    state_head:     { canView: true, canAdd: false, canEdit: false, canDelete: false },
    qt:             { canView: true, canAdd: false, canEdit: false, canDelete: false },
    mis:            { canView: true, canAdd: false, canEdit: false, canDelete: false },
    trainer:        { canView: true, canAdd: false, canEdit: false, canDelete: false }
  },

  // 📌 Center Module Permissions
  center: {
    super_admin:    { canView: true, canAdd: true, canEdit: true, canDelete: true },
    admin:          { canView: true, canAdd: true, canEdit: true, canDelete: true },
    center_manager: { canView: true, canAdd: true, canEdit: true, canDelete: true }, // ✅ Center Manager allowed here
    state_head:     { canView: true, canAdd: false, canEdit: false, canDelete: false },
    qt:             { canView: true, canAdd: false, canEdit: false, canDelete: false },
    mis:            { canView: true, canAdd: false, canEdit: false, canDelete: false },
    trainer:        { canView: true, canAdd: false, canEdit: false, canDelete: false }
  },

  candidate: {
    super_admin: { canView: true, canAdd: true, canEdit: true, canDelete: true },
    admin:       { canView: true, canAdd: true, canEdit: true, canDelete: true },
    mis:         { canView: true, canAdd: true, canEdit: true, canDelete: true },

    state_head:     { canView: true, canAdd: false, canEdit: false, canDelete: false },
    center_manager: { canView: true, canAdd: false, canEdit: false, canDelete: false },
    qt:             { canView: true, canAdd: false, canEdit: false, canDelete: false },
    trainer:        { canView: true, canAdd: false, canEdit: false, canDelete: false }
  },

    batch: {
    super_admin: { canView: true, canAdd: true, canEdit: true, canDelete: true, canUpdateStatus: true },
    admin:       { canView: true, canAdd: true, canEdit: true, canDelete: true, canUpdateStatus: true },
    state_head:  { canView: true, canAdd: true, canEdit: true, canDelete: true, canUpdateStatus: false },

    center_manager: { canView: true, canAdd: false, canEdit: false, canDelete: false, canUpdateStatus: false },
    qt:             { canView: true, canAdd: false, canEdit: false, canDelete: false, canUpdateStatus: false },
    mis:            { canView: true, canAdd: false, canEdit: false, canDelete: false, canUpdateStatus: false },
    trainer:        { canView: true, canAdd: false, canEdit: false, canDelete: false, canUpdateStatus: false }
    },
    ojt: {
    super_admin: { canView: true, canAdd: true, canEdit: true, canDelete: true, canUpdateStatus: true },
    admin:       { canView: true, canAdd: true, canEdit: true, canDelete: true, canUpdateStatus: true },

    state_head:     { canView: true, canAdd: false, canEdit: false, canDelete: false, canUpdateStatus: false },
    center_manager: { canView: true, canAdd: false, canEdit: false, canDelete: false, canUpdateStatus: false },
    qt:             { canView: true, canAdd: false, canEdit: false, canDelete: false, canUpdateStatus: false },
    mis:            { canView: true, canAdd: false, canEdit: false, canDelete: false, canUpdateStatus: false },
    trainer:        { canView: true, canAdd: false, canEdit: false, canDelete: false, canUpdateStatus: false }
  },
  inspection: {
    super_admin: { canView: true, canAdd: true, canEdit: true, canDelete: true },
    admin:       { canView: true, canAdd: true, canEdit: true, canDelete: true },
    qt:          { canView: true, canAdd: true, canEdit: true, canDelete: true },

    state_head:     { canView: true, canAdd: false, canEdit: false, canDelete: false },
    center_manager: { canView: true, canAdd: false, canEdit: false, canDelete: false },
    mis:            { canView: true, canAdd: false, canEdit: false, canDelete: false },
    trainer:        { canView: true, canAdd: false, canEdit: false, canDelete: false }
  },
  placement: {
    super_admin: { canView: true, canAdd: true, canEdit: true },
    admin:       { canView: true, canAdd: true, canEdit: true },

    state_head:     { canView: true, canAdd: false, canEdit: false },
    center_manager: { canView: true, canAdd: false, canEdit: false },
    qt:             { canView: true, canAdd: false, canEdit: false },
    mis:            { canView: true, canAdd: false, canEdit: false },
    trainer:        { canView: true, canAdd: false, canEdit: false }
  },
 welcomeKit: {
    super_admin: { canView: true, canAdd: true, canEdit: true, canDelete: true },
    admin:       { canView: true, canAdd: true, canEdit: true, canDelete: true },
    trainer:     { canView: true, canAdd: true, canEdit: true, canDelete: true },
    center_manager: { canView: true, canAdd: false, canEdit: false, canDelete: false },
    state_head:     { canView: true, canAdd: false, canEdit: false, canDelete: false },
    qt:             { canView: true, canAdd: false, canEdit: false, canDelete: false },
    mis:            { canView: true, canAdd: false, canEdit: false, canDelete: false }
  }
};

module.exports = permissions;

