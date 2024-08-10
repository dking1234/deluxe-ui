import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import styles from './DataTable.module.css';

const DataTable = ({ columns, rows, slug }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRowClick = (params) => {
    navigate(`/${slug}/${params.row.id}`);
  };

  if (isMobile) {
    return (
      <div className={styles.mobileView}>
        {rows.map((row) => (
          <div key={row.id} className={styles.card} onClick={() => handleRowClick({ row })}>
            {columns.map((col) => (
              <div key={col.field} className={styles.cardItem}>
                <strong>{col.headerName}:</strong> {row[col.field]}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.dataTable}>
      <DataGrid
        className={styles.dataGrid}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        density="comfortable"
        onRowClick={handleRowClick}
        componentsProps={{
          filterPanel: {
            debounceMs: 300,
          },
        }}
      />
    </div>
  );
};

export default DataTable;
