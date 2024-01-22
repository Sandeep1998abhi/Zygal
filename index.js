document.addEventListener('DOMContentLoaded', function () {
    const calendarBody = document.querySelector('#calendar tbody');
    const monthYearText = document.querySelector('#monthYear');
    const prevButton = document.querySelector('#prevButton');
    const nextButton = document.querySelector('#nextButton');
    const selectedDateDisplay = document.querySelector('#selectedDateDisplay');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDates = [new Date(currentYear, currentMonth, new Date().getDate())];

    function generateCalendar() {
        calendarBody.innerHTML = '';
        monthYearText.textContent = `${getMonthName(currentMonth)} ${currentYear}`;

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        let date = 1;

        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');

                if ((i === 0 && j >= firstDayOfMonth) || i > 0) {
                    if (date <= getDaysInMonth(currentYear, currentMonth)) {
                        cell.textContent = date;
                        cell.addEventListener('click', handleCellClick);
                        date++;
                    } else {
                        cell.classList.add('out-month'); // Add class to cells representing days in the next month
                    }
                }

                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }
    }

    function handleCellClick() {
        const selectedDate = new Date(currentYear, currentMonth, this.textContent);

        // Check if the clicked cell represents a day in the next month
        const isNextMonth = this.classList.contains('out-month');

        if (!isNextMonth && !isSelectedDate(selectedDate)) {
            selectedDates.push(selectedDate);
            updateSelectedDateStyles();
            displaySelectedDates();
        }
    }

    function updateSelectedDateStyles() {
        const allCells = document.querySelectorAll('#calendar tbody tr td');
        allCells.forEach(cell => cell.classList.remove('selected'));

        selectedDates.forEach(date => {
            const day = date.getDate();
            const matchingCell = Array.from(allCells).find(cell =>
                !cell.classList.contains('disabled') &&
                !cell.classList.contains('out-month') && // Ignore cells in the next month
                parseInt(cell.textContent) === day
            );

            if (matchingCell) {
                matchingCell.classList.add('selected');
            }
        });
    }

    function isSelectedDate(date) {
        return selectedDates.some(selectedDate => isSameDate(selectedDate, date));
    }

    function isSameDate(date1, date2) {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    }

    function displaySelectedDates() {
        selectedDateDisplay.textContent = `User Selected Dates: ${selectedDates
            .map(date => `${getMonthName(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`)
            .join(', ')}`;
    }

    function updateCalendar() {
        const newMonth = new Date().getMonth();

        if (newMonth !== currentMonth) {
            // Clear selected dates from the previous month
            selectedDates = [];
        }

        currentMonth = newMonth;
        generateCalendar();
        updateSelectedDateStyles();
    }

    function getMonthName(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return months[monthIndex];
    }

    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    prevButton.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    nextButton.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    generateCalendar();
});
