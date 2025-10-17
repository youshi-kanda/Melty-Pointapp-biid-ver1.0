// API Health Check Endpoint
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    service: 'BIID Point App Frontend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
}
