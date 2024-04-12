
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for each navigation item
    document.getElementById('dashboard-nav').addEventListener('click', function() {
        // Show the dashboard content
        showDashboard();
    });

    document.getElementById('employee-dropdown').addEventListener('click', function() {
        // Show the add employee screen
        showAddEmployeeScreen();
    });

    document.getElementById('product-dropdown').addEventListener('click', function() {
        // Show a blank screen or hide the add employee screen
        // You can add functionality here as needed
        showAddProductScreen();
    });

    document.getElementById('transactions-nav').addEventListener('click', function() {
        // Show the transactions content
        showTransactions();
    });

    document.getElementById('notifications-nav').addEventListener('click', function() {
        // Show the notifications content
        showNotifications();
    });

    document.getElementById('reports-nav').addEventListener('click', function() {
        // Show the reports content
        showReports();
    });

    document.getElementById('settings-nav').addEventListener('click', function() {
        // Show the settings content
        showSettings();
    });

    // Function to show the dashboard content
    function showDashboard() {
        document.querySelectorAll('.dashboard-content, .data-container, .product-container, .transactions-container, .notifications-container, .reports-container, .settings-container').forEach(function(content) {
            content.classList.add('d-none');
        });
        document.querySelector('.dashboard-content').classList.remove('d-none');
    }

    // Function to show the add employee screen
    function showAddEmployeeScreen() {
        document.querySelectorAll('.dashboard-content, .data-container, .product-container, .transactions-container, .notifications-container, .reports-container, .settings-container').forEach(function(content) {
            content.classList.add('d-none');
        });
        document.querySelector('.data-container').classList.remove('d-none');
    }

        // Function to show the add employee screen
    function showAddProductScreen() {
        document.querySelectorAll('.dashboard-content, .data-container, .product-container, .transactions-container, .notifications-container, .reports-container, .settings-container').forEach(function(content) {
            content.classList.add('d-none');
        });
        document.querySelector('.product-container').classList.remove('d-none');
    }

    // Function to show the transactions content
    function showTransactions() {
        document.querySelectorAll('.dashboard-content, .data-container, .product-container, .transactions-container, .notifications-container, .reports-container, .settings-container').forEach(function(content) {
            content.classList.add('d-none');
        });
        document.querySelector('.transactions-container').classList.remove('d-none');
    }

    // Function to show the notifications content
    function showNotifications() {
        document.querySelectorAll('.dashboard-content, .data-container, .product-container, .transactions-container, .notifications-container, .reports-container, .settings-container').forEach(function(content) {
            content.classList.add('d-none');
        });
        document.querySelector('.notifications-container').classList.remove('d-none');
    }

    // Function to show the reports content
    function showReports() {
        document.querySelectorAll('.dashboard-content, .data-container, .product-container, .transactions-container, .notifications-container, .reports-container, .settings-container').forEach(function(content) {
            content.classList.add('d-none');
        });
        document.querySelector('.reports-container').classList.remove('d-none');
    }

    // Function to show the settings content
    function showSettings() {
        document.querySelectorAll('.dashboard-content, .data-container, .product-container, .transactions-container, .notifications-container, .reports-container, .settings-container').forEach(function(content) {
            content.classList.add('d-none');
        });
        document.querySelector('.settings-container').classList.remove('d-none');
    }
});