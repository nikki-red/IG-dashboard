// fetchMetricsWorker.js
let currentInstance = null;

self.onmessage = function (e) {
  if (e.data.instance) {
    currentInstance = e.data.instance;
  }

  const fetchMetrics = async () => {
    if (!currentInstance) return;

    try {
      const response = await fetch(
        `https://u7i3wume3h.execute-api.us-east-1.amazonaws.com/default/InsightGuard-CloudWatch-RealTime?instance=${currentInstance}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      self.postMessage({ data });
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  };

  setInterval(fetchMetrics, 1000);
};