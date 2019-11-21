const PROXY_CONFIG = [
  {
    context: [
      '/api',
    ],
    target: {
      'host': 'host.docker.internal',
      'protocol': 'http:',
      'port': 8888,
    },
    secure: false,
    changeOrigin: true,
  },
];

module.exports = PROXY_CONFIG;
