import * as React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const capitalizeFirstLetter = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const columns = [
  { id: 'name', label: 'Name', minWidth: 150, format: capitalizeFirstLetter },
  { id: 'loanType', label: 'Loan Type', minWidth: 150, format: capitalizeFirstLetter },
  { id: 'urgency', label: 'Urgency', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 100, align: 'center' },
];

function createData(name, loanType, urgency) {
  return { name, loanType, urgency };
}

// Example data
const rows = [
  createData('John Doe', 'Home Loan', 'High'),
  createData('Jane Smith', 'Personal Loan', 'Medium'),
  createData('Alice Johnson', 'Auto Loan', 'Low'),
  createData('Mark Lee', 'Business Loan', 'High'),
  createData('Emily Davis', 'Education Loan', 'Low'),
];

export default function CustomerListPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row)
      .join(' ')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          placeholder="Input Customer ID/Name/Phone No"
          value={searchText}
          onChange={handleSearch}
          sx={{ width: '100%' }}
        />
      </Box>
      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{
                      backgroundColor: '#1976d2', // Change this to your desired header color
                      color: '#ffffff', // Text color for the header
                      fontWeight: 'bold', // Optional: Make text bold for better visibility
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if (column.id === 'action') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Button variant="contained" color="primary" size="small">
                              Follow Up
                            </Button>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
