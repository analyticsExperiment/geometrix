$(function() {
  let entries = [];
  const list = $('#entries');
  const calendarEl = document.getElementById('calendar');
  const chartEl = document.getElementById('chart');
  let calendar, chart;

  function renderList() {
    list.empty();
    entries.forEach(e => {
      const item = $(`
        <li class="list-group-item" data-id="${e.id}">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-1">${e.title}</h5>
              <small>${new Date(e.date).toLocaleString()}</small>
              <p class="mb-1">${e.content}</p>
            </div>
            <button class="btn btn-sm btn-danger delete">Delete</button>
          </div>
        </li>`);
      list.append(item);
    });
  }

  function renderCalendar() {
    const events = entries.map(e => ({
      title: e.title,
      start: e.date,
      allDay: true
    }));
    if (!calendar) {
      calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 650,
        events
      });
      calendar.render();
    } else {
      calendar.removeAllEvents();
      events.forEach(ev => calendar.addEvent(ev));
    }
  }

  function renderChart() {
    const counts = {};
    entries.forEach(e => {
      const d = e.date.substr(0, 10);
      counts[d] = (counts[d] || 0) + 1;
    });
    const labels = Object.keys(counts).sort();
    const data = labels.map(l => counts[l]);
    if (chart) chart.destroy();
    chart = new Chart(chartEl, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Entries', data, backgroundColor: '#007bff' }] },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }

  function load() {
    $.get('/api/entries', function(data) {
      entries = data;
      renderList();
      renderCalendar();
      renderChart();
    });
  }

  $('#entry-form').submit(function(ev) {
    ev.preventDefault();
    $.post('/api/entries', {
      title: $('#title').val(),
      content: $('#content').val(),
      date: $('#date').val()
    }, load);
    this.reset();
    const today = new Date().toISOString().substr(0,10);
    $('#date').val(today);
  });

  list.on('click', '.delete', function() {
    const id = $(this).closest('li').data('id');
    $.ajax({ url: '/api/entries/' + id, type: 'DELETE', success: load });
  });

  const today = new Date().toISOString().substr(0,10);
  $('#date').val(today);
  load();
});
