import "./MeetingMenu.css";

import CloseIcon from "../../assets/icons/Close.svg";
import Edit from "../../assets/icons/Edit.svg";
import Delete from "../../assets/icons/Delete.svg";

interface MeetingMenuProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export default function MeetingMenu({
  open,
  onClose,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: MeetingMenuProps) {
  if (!open) return null;

  return (
    <div className="meeting-menu-popup">

      <button
        className="menu-close"
        onClick={onClose}
      >
        <img
          src={CloseIcon}
          alt="Close"
        />
      </button>

      <div className="menu-card">

        {canEdit && (
          <>
            <button
              className="menu-item"
              onClick={onEdit}
            >
              <img src={Edit} alt="" />
              <span>Edit</span>
            </button>

            <div className="menu-divider" />
          </>
        )}

        {canDelete && (
          <button
            className="menu-item"
            onClick={onDelete}
          >
            <img src={Delete} alt="" />
            <span>Delete</span>
          </button>
        )}

      </div>

    </div>
  );
}