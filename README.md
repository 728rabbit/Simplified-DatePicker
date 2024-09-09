
# iDatePicker
The iDatePicker class is a custom date picker component designed to provide a user-friendly interface for selecting dates directly within an input field.

How to use:

    <input class="mydate" type="text" name="text" value="2024-11-07">
    
    let iDatePickerObj = null;
    if(!iDatePickerObj) { iDatePickerObj = new iDatePicker('zh'); }
    iDatePickerObj.render('input.mydate');

iDatePicker Functionality Description
1. Initialization and Configuration:
The iDatePicker is initialized with a list of input elements, language settings (en for English or zh for Chinese), and a configurable date format (DD/MM/YYYY or YYYY-MM-DD).
The date picker attaches itself to input fields specified during initialization and automatically shows the calendar when an input field is focused.

2. Input Handling and Validation:
When an input field gains focus, the date picker checks if the current input value matches the specified date format using the isValidDateFormat method.
If the input date is valid, it sets the selected date; otherwise, it defaults to the current date to avoid errors.

3. Date Format Management:
Supports multiple date formats (DD/MM/YYYY and YYYY-MM-DD), ensuring compatibility with various regional date display preferences.
Provides methods to format and parse dates according to the selected format, allowing consistent and accurate date handling.


4. Calendar Display:
Dynamically generates a calendar UI positioned near the focused input field. The calendar includes navigation buttons for moving between months.
The header displays the current month and year, updating based on user navigation.

5. Date Selection:
Users can select a date from the calendar, which updates the input field value in the configured format.
The selected date is highlighted to provide visual feedback.

7. Month Navigation:
Provides next and previous buttons (🞀 and 🞂) to allow users to navigate through months easily.
Updates the calendar display accordingly, ensuring the correct dates are shown for each month.

8. Validation on Date Selection:
Checks if the clicked date is part of the current month, previous month, or next month. Dates from other months are styled differently to provide clear visual differentiation.

9. Interactive Elements:
The calendar is highly interactive, allowing users to navigate, select dates, and see real-time changes reflected in the input field.
Designed to be accessible with clear visuals, intuitive navigation, and clear feedback for selected dates.


10. Handling Clicks Outside:
The date picker listens for clicks outside its boundary to automatically close the calendar, ensuring it does not obstruct the user interface unnecessarily.

11. Styling and Appearance:
The calendar is styled to be visually appealing, with borders, shadows, and responsive positioning relative to the input fields.
Customizable button styles for month navigation and clear highlighting for selected and non-current month dates.
