import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ExportOptions = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text('Food Waste Report', 14, 15);

      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

      // Prepare table data
      const tableData = data.map(item => [
        formatDate(item.date),
        item.notes || 'N/A',
        `${item.foodPrepared?.toFixed(2) || '0'} kg`,
        `${item.foodWasted?.toFixed(2) || '0'} kg`,
        `${((item.foodWasted / item.foodPrepared) * 100).toFixed(1)}%`
      ]);

      // Add table
      doc.autoTable({
        head: [['Date', 'Food Item', 'Prepared', 'Wasted', 'Waste %']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      // Add summary
      const totalWaste = data.reduce((sum, item) => sum + (item.foodWasted || 0), 0);
      const totalPrepared = data.reduce((sum, item) => sum + (item.foodPrepared || 0), 0);
      const averageWaste = (totalWaste / totalPrepared * 100).toFixed(1);

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Total Food Prepared: ${totalPrepared.toFixed(2)} kg`, 14, finalY);
      doc.text(`Total Food Wasted: ${totalWaste.toFixed(2)} kg`, 14, finalY + 7);
      doc.text(`Average Waste Percentage: ${averageWaste}%`, 14, finalY + 14);

      // Save the PDF
      doc.save('food-waste-report.pdf');
      
      setSnackbar({
        open: true,
        message: 'PDF exported successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setSnackbar({
        open: true,
        message: 'Error exporting PDF',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const exportToExcel = async () => {
    setLoading(true);
    try {
      // Prepare data
      const excelData = data.map(item => ({
        Date: formatDate(item.date),
        'Food Item': item.notes || 'N/A',
        'Prepared (kg)': item.foodPrepared?.toFixed(2) || '0',
        'Wasted (kg)': item.foodWasted?.toFixed(2) || '0',
        'Waste %': `${((item.foodWasted / item.foodPrepared) * 100).toFixed(1)}%`,
        'Event Type': item.event_type || 'N/A',
        'Attendees': item.attendees || 'N/A'
      }));

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Add column widths
      const colWidths = [
        { wch: 15 }, // Date
        { wch: 20 }, // Food Item
        { wch: 12 }, // Prepared
        { wch: 12 }, // Wasted
        { wch: 10 }, // Waste %
        { wch: 15 }, // Event Type
        { wch: 10 }  // Attendees
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Food Waste Data');

      // Save file
      XLSX.writeFile(wb, 'food-waste-report.xlsx');

      setSnackbar({
        open: true,
        message: 'Excel file exported successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting Excel:', error);
      setSnackbar({
        open: true,
        message: 'Error exporting Excel file',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Tooltip title="Export Data">
        <Button
          variant="outlined"
          onClick={handleClick}
          startIcon={loading ? <CircularProgress size={20} /> : <FileDownloadIcon />}
          disabled={loading}
          sx={{
            borderRadius: 2,
            color: 'green',
            borderColor: 'green',
            '&:hover': {
              bgcolor: 'green',
              color: 'white',
              borderColor: 'green',
              '& .MuiSvgIcon-root': {
                color: 'white'
              }
            }
          }}
        >
          Export Data
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180
          }
        }}
      >
        <MenuItem onClick={exportToPDF} disabled={loading}>
          <PictureAsPdfIcon sx={{ mr: 1 }} />
          Export as PDF
        </MenuItem>
        <MenuItem onClick={exportToExcel} disabled={loading}>
          <TableViewIcon sx={{ mr: 1 }} />
          Export as Excel
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportOptions;