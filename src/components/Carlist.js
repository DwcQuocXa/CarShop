import React, { useState, useEffect } from "react";

import { AgGridReact } from "ag-grid-react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

// import Button from "@material-ui/core/Button";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogTitle from "@material-ui/core/DialogTitle";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import Addcars from "./Addcars";
import Editcars from "./Editcars";

export default function Carlist() {
  const [cars, setCars] = useState([]);
  // const [open, setOpen] = useState(false);

  //Fetch Data
  useEffect(() => fetchData(), []);

  const fetchData = async () => {
    const response = await fetch("http://carstockrest.herokuapp.com/cars");
    const data = await response.json();
    setCars(data._embedded.cars);
  };

  //Delete car function
  // const deletedClickOpen = () => {
  //   setOpen(true);
  // };

  // const deletedClickClose = () => {
  //   setOpen(false);
  // };

  const deleteCar = (url) => {
    if (window.confirm("Are you sure?")) {
      fetch(url, { method: "DELETE" })
        .then((response) => {
          if (response.ok) fetchData();
          else alert("Something went wrong!");
        })
        .catch((err) => console.error(err));
    }
    // deletedClickClose();
  };

  //Save car function
  const saveCar = (car) => {
    fetch("http://carstockrest.herokuapp.com/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    })
      .then((res) => fetchData())
      .catch((err) => console.error(err));
  };

  const updateCar = (car, link) => {
    fetch(link, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    })
      .then((res) => fetchData())
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "brand", sortable: true, filter: true, width: 150 },
    { field: "model", sortable: true, filter: true, width: 150 },
    { field: "color", sortable: true, filter: true, width: 150 },
    { field: "fuel", sortable: true, filter: true, width: 150 },
    { field: "year", sortable: true, filter: true, width: 150 },
    { field: "price", sortable: true, filter: true, width: 150 },
    {
      headerName: "",
      width: 100,
      cellRendererFramework: (params) => (
        <Editcars updateCar={updateCar} car={params.data} />
      ),
    },
    {
      headerName: "",
      width: 100,
      field: "_links.self.href",
      cellRendererFramework: (params) => (
        <IconButton onClick={() => deleteCar(params.value)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),

      // cellRendererFramework: (params) => (
      //   <div>
      //     <IconButton>
      //       <DeleteIcon fontSize="small" onClick={deletedClickOpen()} />
      //     </IconButton>
      //     <Dialog
      //       open={open}
      //       onClose={deletedClickClose}
      //       aria-labelledby="alert-dialog-title"
      //       aria-describedby="alert-dialog-description"
      //     >
      //       <DialogTitle id="alert-dialog-title">
      //         {"Are you sure???"}
      //       </DialogTitle>
      //       <DialogActions>
      //         <Button onClick={deletedClickClose} color="primary">
      //           No
      //         </Button>
      //         <Button
      //           color="primary"
      //           autoFocus
      //           onClick={() => deleteCar(params.value)}
      //         >
      //           Yes
      //         </Button>
      //       </DialogActions>
      //     </Dialog>
      //   </div>
      // ),
    },
  ];

  return (
    <div
      className="ag-theme-material"
      style={{ height: 600, width: "90%", margin: "auto" }}
    >
      <Addcars saveCar={saveCar} />
      <AgGridReact
        rowData={cars}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={10}
        suppressCellSelection={true}
      />
    </div>
  );
}
