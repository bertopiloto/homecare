document.addEventListener('DOMContentLoaded', () => {
    const calendarBody = document.getElementById('calendar-body');
    const monthYear = document.getElementById('month-year');
    const appointmentsList = document.getElementById('appointments');
    const addPatientForm = document.getElementById('addPatientForm');
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    function renderCalendar(month, year) {
        calendarBody.innerHTML = '';
        monthYear.textContent = `${months[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    const cell = document.createElement('td');
                    const cellText = document.createTextNode('');
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                } else if (date > daysInMonth) {
                    break;
                } else {
                    const cell = document.createElement('td');
                    const cellText = document.createTextNode(date);
                    cell.appendChild(cellText);
                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                        cell.classList.add('today');
                    }
                    row.appendChild(cell);
                    date++;
                }
            }

            calendarBody.appendChild(row);
        }
    }

    document.querySelector('.prev').addEventListener('click', () => {
        currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        renderCalendar(currentMonth, currentYear);
    });

    document.querySelector('.next').addEventListener('click', () => {
        currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
        currentMonth = (currentMonth + 1) % 12;
        renderCalendar(currentMonth, currentYear);
    });

    addPatientForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const patientName = document.getElementById('patientName').value;
        const patientPhone = document.getElementById('patientPhone').value;
        const patientCity = document.getElementById('patientCity').value;
        const appointmentDate = document.getElementById('appointmentDate').value;
        const appointmentTime = document.getElementById('appointmentTime').value;
        const appointmentType = document.getElementById('appointmentType').value;

        const patientData = {
            name: patientName,
            phone: patientPhone,
            city: patientCity,
            date: appointmentDate,
            time: appointmentTime,
            type: appointmentType
        };

        saveAppointment(patientData);
        addPatientForm.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addPatientModal'));
        modal.hide();

        // Highlight calendar date
        highlightCalendarDate(appointmentDate);
    });

    function saveAppointment(data) {
        let appointments = localStorage.getItem('appointments');
        if (!appointments) {
            appointments = [];
        } else {
            appointments = JSON.parse(appointments);
        }
        appointments.push(data);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        addAppointmentToDOM(data, appointments.length - 1); // Pass the index of the last added item
    }

    function loadAppointments() {
        let appointments = localStorage.getItem('appointments');
        if (appointments) {
            appointments = JSON.parse(appointments);
            appointments.forEach((appointment, index) => {
                addAppointmentToDOM(appointment, index);
            });
        }
    }

    function addAppointmentToDOM(data, index) {
        const appointmentItem = document.createElement('div');
        appointmentItem.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center');
        
        appointmentItem.innerHTML = `
            <div>
                <h5 class="mb-1">${data.name}</h5>
                <p class="mb-1">${data.type} - ${data.city}</p>
                <small>${data.date} ${data.time}</small>
            </div>
            <div>
                <small>${data.phone}</small>
                <button class="btn btn-outline-danger btn-sm ms-2" data-index="${index}">Excluir</button>
            </div>
        `;
        
        const deleteButton = appointmentItem.querySelector('.btn-outline-danger');
        deleteButton.addEventListener('click', () => {
            removeAppointment(index);
            appointmentItem.remove();
        });

        appointmentsList.appendChild(appointmentItem);
    }

    function removeAppointment(index) {
        let appointments = localStorage.getItem('appointments');
        if (appointments) {
            appointments = JSON.parse(appointments);
            appointments.splice(index, 1);
            localStorage.setItem('appointments', JSON.stringify(appointments));
        }
    }
    function highlightCalendarDate(date) {
        const calendarDates = calendarBody.getElementsByTagName('td');
        for (let cell of calendarDates) {
            if (cell.textContent === date.split('-')[2]) { // Assuming date format YYYY-MM-DD
                cell.addEventListener('mouseenter', () => {
                    cell.classList.add('highlighted-date');
                });
                cell.addEventListener('mouseleave', () => {
                    cell.classList.remove('highlighted-date');
                });
            }
        }
    }
    
    renderCalendar(currentMonth, currentYear);
    loadAppointments();
});

// Adicionando eventos de clique dinâmicos para as células do calendário
calendarBody.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'TD' && target.dataset.whatsapp) {
        const whatsappNumber = target.dataset.whatsapp;
        const whatsappURL = `https://web.whatsapp.com/send?phone=${whatsappNumber}`;
        window.open(whatsappURL, '_blank');
    }
});