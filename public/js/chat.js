const socket = io();
const locationBtn = $('#send-location');

function scrollToBottom() {
  const messages = $('#messages');
  const newMessage = messages.children('li:last-child');

  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function() {
  const params = $.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href ='/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('updateUsersList', function(users) {
  const ol = $('<ol></ol>');

  users.forEach(function(user) {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});

socket.on('newMessage', function(message) {
  const template = $('#message-template').html();
  const timestamp = moment(message.createdAt).format('h:mm a');
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: timestamp
  });

  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  const template = $('#location-message-template').html();
  const timestamp = moment(message.createdAt).format('h:mm a');
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: timestamp
  });

  $('#messages').append(html);
  scrollToBottom();
});

$('#message-form').on('submit', function(e) {
  e.preventDefault();
 
  socket.emit('createMessage', {
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