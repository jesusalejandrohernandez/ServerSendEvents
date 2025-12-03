(function () {
  let source;

  function buildSubscribeUrl(idUser, channel, token) {
    const parts = ['subscribe'];
    if (idUser) parts.push(encodeURIComponent(idUser));
    if (channel) parts.push(encodeURIComponent(channel));

    let url = '/' + parts.join('/');

    const params = new URLSearchParams();
    if (token) params.set('access_token', token);
    const qs = params.toString();
    if (qs) url += '?' + qs;

    return url;
  }

  function init() {
    const initBtn = document.getElementById('initButton');
    const stopBtn = document.getElementById('stopButton');
    const content = document.getElementById('content');
    const idInput = document.getElementById('idUser');
    const channelInput = document.getElementById('channel');
    const tokenInput = document.getElementById('token');

    initBtn.addEventListener('click', function () {
      const idUser = (idInput.value || '').trim();
      const channel = (channelInput.value || '').trim();
      const token = (tokenInput.value || '').trim();

      if (!idUser) {
        content.innerHTML += 'Id user is required<br/>';
        return;
      }

      if (source && source.readyState !== EventSource.CLOSED) {
        source.close();
      }

      const url = buildSubscribeUrl(idUser, channel, token);
      source = new EventSource(url);

      source.addEventListener('open', function () {
        content.innerHTML += 'Connection to server established..<br/>';
      });

      source.addEventListener('keep', function () {
        content.innerHTML += 'Keeping alive..<br/>';
      });

      source.onmessage = function (e) {
        content.innerHTML += e.data + '<br/>';
      };

      source.onerror = function () {
        content.innerHTML += 'SSE error/closed..<br/>';
      };
    });

    stopBtn.addEventListener('click', function () {
      content.innerHTML += 'Listening to server events stopped..<br/>';
      if (source) source.close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
