export default () => {
  return `<!doctype html>
      <html lang=en>
          <head>
              <meta charset="utf-8>
              <script src="/socket.io/socket.io.js"></script>
                <script>
                    var socket = io();
                </script>
              <title>Event Manager</title>
          </head>
          <body>
              <div id="root">
                  Welcome to <b>Event Manager Server</b>
              </div>
          </body>`;
};
