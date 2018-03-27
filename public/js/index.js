const socket = io();
const locationBtn = $('#send-location');

socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  let li = $('<li></li>');

  li.text(`${message.from}: ${message.text}`);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  let li = $('<li></li>');
  let a = $('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
  e.preventDefault();
 
  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val()
  }, function() {
    $('[name=message]').val('');
  });
});

locationBtn.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supperted by your browser');
  }

  locationBtn.attr('disabled', 'disabled').text('Sending...');

  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
    locationBtn.removeAttr('disabled').text('Send Location');
  }, function() {
    alert('Unable to fetch current position');
    locationBtn.removeAttr('disabled').text('Send Location');
  });
});