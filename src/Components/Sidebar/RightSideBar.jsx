import React, { useState } from 'react';
import axios from 'axios';
import styles from './RightSideBar.module.css'; // Adjust the import path as necessary

const RightSideBar = ({ quotationId, currentStatus, currentNotes, onStatusUpdate, onNotesUpdate, onDelete }) => {
  const [updatedStatus, setUpdatedStatus] = useState(currentStatus);
  const [updatedNotes, setUpdatedNotes] = useState(currentNotes);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingNotes, setUpdatingNotes] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/quotations/${quotationId}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onStatusUpdate(updatedStatus);
      setUpdatingStatus(false);
    } catch (error) {
      console.error(`Error updating status: ${error.message}`);
    }
  };

  const handleUpdateNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/quotations/${quotationId}`,
        { notes: updatedNotes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onNotesUpdate(updatedNotes);
      setUpdatingNotes(false);
    } catch (error) {
      console.error(`Error updating notes: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/quotations/${quotationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDelete();
    } catch (error) {
      console.error(`Error deleting quotation: ${error.message}`);
    }
  };

  return (
    <div className={styles.rightSideBar}>
      {updatingStatus && (
        <div className={styles.modal}>
          <h3>Update Status</h3>
          <select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button onClick={handleUpdateStatus}>Save</button>
          <button onClick={() => setUpdatingStatus(false)}>Cancel</button>
        </div>
      )}

      {updatingNotes && (
        <div className={styles.modal}>
          <h3>Update Notes</h3>
          <textarea
            value={updatedNotes}
            onChange={(e) => setUpdatedNotes(e.target.value)}
            placeholder={currentNotes || 'No notes'}
          />
          <button onClick={handleUpdateNotes}>Save</button>
          <button onClick={() => setUpdatingNotes(false)}>Cancel</button>
        </div>
      )}

      {deleteConfirm && (
        <div className={styles.modal}>
          <h3>Are you sure you want to delete this quotation?</h3>
          <button onClick={handleDelete}>Yes, Delete</button>
          <button onClick={() => setDeleteConfirm(false)}>Cancel</button>
        </div>
      )}

      <button onClick={() => setUpdatingStatus(true)}>Update Status</button>
      <button onClick={() => setUpdatingNotes(true)}>Update Notes</button>
      <button onClick={() => setDeleteConfirm(true)}>Delete</button>
    </div>
  );
};

export default RightSideBar;
