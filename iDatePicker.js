class iDatePicker {
    constructor(inputElements, lang = 'en', dateFormat = 'YYYY-MM-DD') {
        this.inputElements = inputElements; // Array of input elements associated with the date picker
        this.lang = lang; // Language setting, defaulting to English
        this.dateFormat = dateFormat; // Date format, defaulting to 'YYYY-MM-DD'
        this.calendarElement = null; // Reference to the calendar element
        this.currentDate = new Date(); // Current displayed date in the calendar
        this.selectedDate = null; // Currently selected date
        this.activeInputElement = null; // Currently focused input element
        this.init(); // Initialize the date picker
    }

    init() {
        // Add event listeners to each input element to show the calendar when focused
        this.inputElements.forEach(inputElement => {
            inputElement.classList.add('datepicker');
            inputElement.addEventListener('focus', () => this.onFocusInput(inputElement));
        });

        // Hide the calendar when clicking outside of it
        document.addEventListener('click', (e) => this.onClickOutside(e));
    }

    renew(inputElements) {
        // Add event listeners to new input elements if not already present
        inputElements.forEach(inputElement => {
            if (!inputElement.classList.contains('datepicker')) {
                inputElement.classList.add('datepicker');
                inputElement.addEventListener('focus', () => this.onFocusInput(inputElement));
            }
        });
    }

    onFocusInput(inputElement) {
        // Update the calendar date based on the input value if present
        const inputValue = inputElement.value;

        // Check if the input value matches the expected date format
        if (inputValue && this.isValidDateFormat(inputValue)) {
            this.currentDate = this.parseDate(inputValue); // Parse the input date
            this.selectedDate = new Date(this.currentDate);
        } else {
            // If the input format is incorrect, use the current date
            this.currentDate = new Date();
            this.selectedDate = null; // Clear the selected date
        }

        this.activeInputElement = inputElement; // Set the active input element
        this.showCalendar(inputElement); // Display the calendar
    }

    onClickOutside(event) {
        // Hide the calendar if clicking outside of the input or calendar element
        if (this.calendarElement && !event.target.closest('.datepicker') && !event.target.closest('.idatepicker-calendar')) {
            this.hideCalendar();
        }
    }

    showCalendar(inputElement) {
        // Remove existing calendar if present
        if (this.calendarElement) {
            this.calendarElement.remove();
        }

        // Create a new calendar element with basic styling
        this.calendarElement = this.createElement('div', {
            position: 'absolute',
            backgroundColor: '#fff',
            fontSize: '12px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            zIndex: '100'
        }, 'idatepicker-calendar');

        document.body.appendChild(this.calendarElement);

        // Position the calendar below the input element
        const rect = inputElement.getBoundingClientRect();
        this.calendarElement.style.top = `${rect.bottom + window.scrollY}px`;
        this.calendarElement.style.left = `${rect.left + window.scrollX}px`;

        this.buildCalendar(inputElement); // Build the calendar UI
    }

    hideCalendar() {
        // Remove the calendar from the DOM
        if (this.calendarElement) {
            this.calendarElement.remove();
            this.calendarElement = null;
        }
    }

    buildCalendar(inputElement) {
        const currentYear = this.currentDate.getFullYear();
        const currentMonth = this.currentDate.getMonth();
        this.calendarElement.innerHTML = ''; // Clear previous calendar content

        const headerDiv = this.createHeader(); // Create header with navigation
        const table = this.createCalendarTable(currentYear, currentMonth, inputElement); // Create calendar table

        this.calendarElement.appendChild(headerDiv);
        this.calendarElement.appendChild(table);
    }

    createHeader() {
        // Create the header with previous and next month buttons and current month/year display
        const headerDiv = this.createElement('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0px 10px 0px' });

        const prevButton = this.createButton('🞀', 'prev-month', () => this.changeMonth(-1)); // Button to go to the previous month
        const monthYearSpan = this.createElement('span', { fontSize: '14px', fontWeight: 'bold' });
        monthYearSpan.textContent = `${this.currentDate.toLocaleString(this.lang === 'en' ? 'en' : 'zh', { month: 'short' })} / ${this.currentDate.getFullYear()}`;

        const nextButton = this.createButton('🞂', 'next-month', () => this.changeMonth(1)); // Button to go to the next month

        headerDiv.appendChild(prevButton);
        headerDiv.appendChild(monthYearSpan);
        headerDiv.appendChild(nextButton);

        return headerDiv;
    }

    createButton(text, id, onClick) {
        // Create a button with specified text, ID, and click event handler
        const button = this.createElement('button', {
            position: 'relative',
            backgroundColor: '#2ca4e9',
            fontSize: '12px',
            color: '#fff',
            padding: '3px 6px',
            border: 'none',
            borderRadius: '3px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            boxSizing: 'border-box',
            cursor: 'pointer'
        });
        button.id = id;
        button.textContent = text;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            onClick();
        });
        return button;
    }

    changeMonth(delta) {
        // Adjust the displayed month by the delta value (e.g., -1 for previous month, 1 for next month)
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.buildCalendar(this.inputElements[0]); // Rebuild the calendar with the new month
    }

    createCalendarTable(year, month, inputElement) {
        // Create the main table structure for the calendar
        const table = this.createElement('table', { width: '100%', borderCollapse: 'collapse' });
        const thead = this.createTableHeader(); // Create table header with day names
        const tbody = this.createTableBody(year, month, inputElement); // Create table body with date cells

        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }

    createTableHeader() {
        // Create the header row with day names based on language setting
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const days = (this.lang === 'en') ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['日', '一', '二', '三', '四', '五', '六'];
        days.forEach(day => {
            const th = this.createElement('th', {
                width: '36px',
                height: '30px',
                fontSize: '12px',
                color: '#2ca4e9',
                padding: '4px',
                border: '1px solid #e6e6e6',
                boxSizing: 'border-box',
                textAlign: 'center'
            });
            th.textContent = day;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        return thead;
    }

    createTableBody(year, month, inputElement) {
        // Create the body of the calendar with day cells
        const tbody = document.createElement('tbody');
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // Get the day of the week for the first day of the month
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the current month

        const prevMonthDays = new Date(year, month, 0).getDate(); // Total days in the previous month
        let startDay = prevMonthDays - firstDayOfMonth + 1; // Start day for the leading dates from the previous month

        let day = 1;
        let nextMonthDay = 1;

        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            const row = document.createElement('tr');

            for (let colIndex = 0; colIndex < 7; colIndex++) {
                let td;

                if (rowIndex === 0 && colIndex < firstDayOfMonth) {
                    // Display days from the previous month
                    const dateObj = this.formatDate(new Date(year, month - 1, startDay++));
                    td = this.createDateCell(startDay - 1, dateObj, inputElement, true);
                } else if (day > daysInMonth) {
                    // Display days from the next month
                    const dateObj = this.formatDate(new Date(year, month + 1, nextMonthDay));
                    td = this.createDateCell(nextMonthDay++, dateObj, inputElement, true);
                } else {
                    // Display days from the current month
                    const dateObj = this.formatDate(new Date(year, month, day));
                    td = this.createDateCell(day++, dateObj, inputElement, false);
                }

                row.appendChild(td);
            }

            tbody.appendChild(row);
        }

        return tbody;
    }

    createDateCell(day, dateObj, inputElement, isOtherMonth) {
        // Create a table cell representing a day in the calendar
        const td = this.createElement('td', {
            backgroundColor: this.selectedDate && dateObj === this.formatDate(this.selectedDate) ? '#2ca4e9' : '',
            width: '36px',
            height: '30px',
            fontSize: '12px',
            color: isOtherMonth ? '#aaa' : this.selectedDate && dateObj === this.formatDate(this.selectedDate) ? '#fff' : '',
            padding: '4px',
            border: '1px solid #e6e6e6',
            boxSizing: 'border-box',
            textAlign: 'center',
            cursor: 'pointer'
        });
        td.dataset.date = dateObj; // Store the date value in the cell
        td.textContent = day;
        td.addEventListener('click', () => this.onDateSelect(dateObj, inputElement)); // Add event listener for date selection
        return td;
    }

    onDateSelect(dateObj, inputElement) {
        // Parse the date from the formatted string
        const selectedDate = this.parseDate(dateObj);
        if (!isNaN(selectedDate)) {
            this.activeInputElement.value = this.formatDate(selectedDate);
            this.selectedDate = selectedDate;
            this.buildCalendar(inputElement);
            this.hideCalendar();
        }
    }

    createElement(tag, styles = {}, className) {
        // Create an HTML element with optional class and styles
        const el = document.createElement(tag);
        if (className) el.className = className;
        Object.assign(el.style, styles);
        return el;
    }
    
    isValidDateFormat(dateString) {
        // Define the regex pattern based on the specified date format
        let regex;
        if ((this.dateFormat.toString().toUpperCase()) === 'DD/MM/YYYY') {
            // Match DD/MM/YYYY format, e.g., 25/12/2024
            regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        } else {
            // Default to YYYY-MM-DD format, e.g., 2024-12-25
            regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        }

        // Return whether the input matches the regex pattern
        return regex.test(dateString);
    }
    
    parseDate(dateString) {
        // Parse date based on the specified format
        const [year, month, day] = (this.dateFormat.toString().toUpperCase()) === 'DD/MM/YYYY'
            ? dateString.split('/').map(Number).reverse()
            : dateString.split('-').map(Number);

        // Return a new Date object based on parsed values
        return new Date(year, month - 1, day);
    }

    formatDate(date) {
        // Format a date object into a string based on the specified dateFormat
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // Return the date formatted according to the specified dateFormat
        if ((this.dateFormat.toString().toUpperCase())=== 'DD/MM/YYYY') {
            return `${day}/${month}/${year}`;
        }
        return `${year}-${month}-${day}`; // Default format: YYYY-MM-DD
    }
}