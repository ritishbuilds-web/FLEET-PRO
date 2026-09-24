/* ============================================
   FLEETPRO - FLEET MANAGEMENT SYSTEM
   Main JavaScript File
============================================ */

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. SIDEBAR TOGGLE
    // ==========================================

    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", function () {
            sidebar.classList.toggle("active");
        });

        // Close sidebar after selecting a navigation link on mobile
        sidebar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove("active");
                }
            });
        });
    }


    // ==========================================
    // 2. LOCAL STORAGE HELPERS
    // ==========================================

    function getStoredData(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (error) {
            console.error("Unable to read saved data:", error);
            return [];
        }
    }

    function saveStoredData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error("Unable to save data:", error);
            alert("Unable to save data in this browser.");
        }
    }


    // ==========================================
    // 3. TABLE CONFIGURATION
    // ==========================================

    const tableConfigs = {
        vehicleForm: {
            tableId: "vehicleTable",
            storageKey: "fleetpro_vehicles",
            fields: [
                "vehicleId",
                "vehicleName",
                "vehicleType",
                "vehicleNumber",
                "vehicleModel",
                "vehicleStatus"
            ],
            statusIndex: 5
        },

        driverForm: {
            tableId: "driverTable",
            storageKey: "fleetpro_drivers",
            fields: [
                "driverId",
                "driverName",
                "driverPhone",
                "driverLicense",
                "driverStatus"
            ],
            statusIndex: 4
        },

        maintenanceForm: {
            tableId: "maintenanceTable",
            storageKey: "fleetpro_maintenance",
            fields: [
                "maintenanceId",
                "maintenanceVehicle",
                "maintenanceType",
                "maintenanceDate",
                "maintenanceCost",
                "maintenanceStatus"
            ],
            statusIndex: 5
        },

        fuelForm: {
            tableId: "fuelTable",
            storageKey: "fleetpro_fuel",
            fields: [
                "fuelId",
                "fuelVehicle",
                "fuelDate",
                "fuelType",
                "fuelQuantity",
                "fuelCost"
            ]
        },

        assignmentForm: {
            tableId: "assignmentTable",
            storageKey: "fleetpro_assignments",
            fields: [
                "assignmentId",
                "assignmentVehicle",
                "assignmentDriver",
                "assignmentDate",
                "assignmentRoute",
                "assignmentStatus"
            ],
            statusIndex: 5
        }
    };


    // ==========================================
    // 4. STATUS BADGE HELPER
    // ==========================================

    function getStatusClass(status) {
        const normalized = String(status).toLowerCase();

        if (
            normalized === "active" ||
            normalized === "assigned" ||
            normalized === "completed"
        ) {
            return "status-active";
        }

        if (
            normalized === "maintenance" ||
            normalized === "pending" ||
            normalized === "in progress" ||
            normalized === "on leave" ||
            normalized === "in transit"
        ) {
            return "status-maintenance";
        }

        return "status-inactive";
    }


    // ==========================================
    // 5. CREATE TABLE ROW
    // ==========================================

    function createTableRow(values, config) {
        const row = document.createElement("tr");

        values.forEach(function (value, index) {
            const cell = document.createElement("td");

            // Display currency and units
            if (config.tableId === "maintenanceTable" && index === 4) {
                cell.textContent = "₹" + Number(value).toLocaleString("en-IN");
            } else if (config.tableId === "fuelTable" && index === 4) {
                cell.textContent = value + " L";
            } else if (config.tableId === "fuelTable" && index === 5) {
                cell.textContent = "₹" + Number(value).toLocaleString("en-IN");
            } else {
                cell.textContent = value;
            }

            // Add status badge
            if (index === config.statusIndex) {
                const badge = document.createElement("span");

                badge.className =
                    "status-badge " + getStatusClass(value);

                badge.textContent = value;

                cell.textContent = "";
                cell.appendChild(badge);
            }

            row.appendChild(cell);
        });

        // Action button
        const actionCell = document.createElement("td");
        const deleteBtn = document.createElement("button");

        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function () {
            deleteRecord(row, config);
        });

        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        return row;
    }


    // ==========================================
    // 6. DELETE RECORD
    // ==========================================

    function deleteRecord(row, config) {
        const confirmed = confirm(
            "Are you sure you want to delete this record?"
        );

        if (!confirmed) {
            return;
        }

        const tbody = row.parentElement;

        if (!tbody) {
            return;
        }

        const rowIndex = Array.from(tbody.rows).indexOf(row);

        row.remove();

        // Update saved records
        const data = getStoredData(config.storageKey);

        if (rowIndex >= 0 && rowIndex < data.length) {
            data.splice(rowIndex, 1);
            saveStoredData(config.storageKey, data);
        }

        updateDashboard();
    }


    // ==========================================
    // 7. LOAD SAVED RECORDS
    // ==========================================

    function loadSavedRecords() {
        Object.values(tableConfigs).forEach(function (config) {
            const table = document.getElementById(config.tableId);

            if (!table) {
                return;
            }

            const tbody = table.querySelector("tbody");

            if (!tbody) {
                return;
            }

            const savedData = getStoredData(config.storageKey);

            if (savedData.length === 0) {
                // Use the sample HTML rows on first visit.
                // Save them so they remain after refreshing.
                const sampleRows = Array.from(tbody.rows).map(function (row) {
                    return Array.from(row.cells)
                        .slice(0, -1)
                        .map(function (cell) {
                            const badge = cell.querySelector(".status-badge");
                            return badge ? badge.textContent.trim() : cell.textContent.trim();
                        });
                });

                saveStoredData(config.storageKey, sampleRows);
            } else {
                tbody.innerHTML = "";

                savedData.forEach(function (values) {
                    tbody.appendChild(createTableRow(values, config));
                });
            }

            // Add delete functionality to existing sample rows
            Array.from(tbody.rows).forEach(function (row) {
                const deleteBtn = row.querySelector(".delete-btn");

                if (deleteBtn) {
                    deleteBtn.addEventListener("click", function () {
                        deleteRecord(row, config);
                    });
                }
            });
        });
    }


    // ==========================================
    // 8. ADD NEW RECORDS
    // ==========================================

    Object.entries(tableConfigs).forEach(function ([formId, config]) {
        const form = document.getElementById(formId);
        const table = document.getElementById(config.tableId);

        if (!form || !table) {
            return;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const values = config.fields.map(function (fieldId) {
                const input = document.getElementById(fieldId);
                return input ? input.value.trim() : "";
            });

            // Validate required fields
            if (values.some(function (value) {
                return value === "";
            })) {
                alert("Please fill in all required fields.");
                return;
            }

            // Prevent duplicate IDs
            const tbody = table.querySelector("tbody");
            const recordId = values[0];

            const duplicate = Array.from(tbody.rows).some(function (row) {
                return row.cells[0].textContent.trim().toLowerCase() ===
                    recordId.toLowerCase();
            });

            if (duplicate) {
                alert("This ID already exists. Please use a unique ID.");
                return;
            }

            // Create and add row
            const row = createTableRow(values, config);

            tbody.appendChild(row);

            // Save record
            const data = getStoredData(config.storageKey);
            data.push(values);

            saveStoredData(config.storageKey, data);

            // Reset form
            form.reset();

            updateDashboard();

            alert("Record added successfully!");
        });
    });


    // ==========================================
    // 9. DASHBOARD STATISTICS
    // ==========================================

    function updateDashboard() {
        const vehicles = getStoredData("fleetpro_vehicles");
        const drivers = getStoredData("fleetpro_drivers");
        const maintenance = getStoredData("fleetpro_maintenance");
        const fuel = getStoredData("fleetpro_fuel");

        const totalVehicles = vehicles.length;
        const activeDrivers = drivers.filter(function (driver) {
            return driver[4] === "Active";
        }).length;

        const maintenanceCount = vehicles.filter(function (vehicle) {
            return vehicle[5] === "Maintenance";
        }).length;

        const fuelExpenses = fuel.reduce(function (total, record) {
            return total + (Number(record[5]) || 0);
        }, 0);

        const maintenanceExpenses = maintenance.reduce(function (total, record) {
            return total + (Number(record[4]) || 0);
        }, 0);

        // Update dashboard cards
        setText("totalVehicles", totalVehicles);
        setText("activeDrivers", activeDrivers);
        setText("maintenanceCount", maintenanceCount);
        setText("fuelExpenses", "₹" + fuelExpenses.toLocaleString("en-IN"));

        // Update reports
        setText("reportTotalVehicles", totalVehicles);
        setText("reportFuelExpenses", "₹" + fuelExpenses.toLocaleString("en-IN"));
        setText(
            "reportMaintenanceExpenses",
            "₹" + maintenanceExpenses.toLocaleString("en-IN")
        );
    }

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }


    // ==========================================
    // 10. SEARCH TABLES
    // ==========================================

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = searchInput.value.toLowerCase().trim();

            document.querySelectorAll(".data-table tbody tr").forEach(function (row) {
                const rowText = row.textContent.toLowerCase();

                row.style.display = rowText.includes(query) ? "" : "none";
            });
        });
    }


    // ==========================================
    // 11. PRINT REPORT
    // ==========================================

    const printReportBtn = document.getElementById("printReportBtn");

    if (printReportBtn) {
        printReportBtn.addEventListener("click", function () {
            window.print();
        });
    }


    // ==========================================
    // 12. LOGIN FORM
    // ==========================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            if (!email || !password) {
                alert("Please enter your email and password.");
                return;
            }

            // Demo-only login
            alert(
                "Demo login submitted successfully!\n\n" +
                "This project does not have a real authentication server."
            );

            loginForm.reset();
        });
    }


    // ==========================================
    // 13. REGISTRATION FORM
    // ==========================================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("registerName").value.trim();
            const email = document.getElementById("registerEmail").value.trim();
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (!name || !email || !password || !confirmPassword) {
                alert("Please fill in all fields.");
                return;
            }

            if (password.length < 8) {
                alert("Password must contain at least 8 characters.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            // Demo-only registration
            alert(
                "Registration form submitted successfully!\n\n" +
                "This project does not have a real authentication server."
            );

            registerForm.reset();
        });
    }


    // ==========================================
    // 14. INITIALIZE APPLICATION
    // ==========================================

    loadSavedRecords();
    updateDashboard();

    console.log("FleetPro application initialized successfully.");

});