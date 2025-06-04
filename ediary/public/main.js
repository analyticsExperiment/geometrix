$(function() {
  const list = $('#entries');

  function load() {
    $.get('/api/entries', function(data) {
      list.empty();
      data.forEach(e => {
        const item = $(`
          <li class="list-group-item" data-id="${e.id}">
            <h5>${e.title}</h5>
            <p>${e.content}</p>
            <small>${new Date(e.date).toLocaleString()}</small>
            <button class="btn btn-sm btn-danger float-right delete">Delete</button>
          </li>`);
        list.append(item);
      });
    });
  }

  $('#entry-form').submit(function(ev) {
    ev.preventDefault();
    $.post('/api/entries', {
      title: $('#title').val(),
      content: $('#content').val()
    }, load);
    this.reset();
  });

  list.on('click', '.delete', function() {
    const id = $(this).closest('li').data('id');
    $.ajax({url: '/api/entries/' + id, type: 'DELETE', success: load});
  });

  load();
});
