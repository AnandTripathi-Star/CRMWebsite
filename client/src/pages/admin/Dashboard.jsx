import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/admin/summary').then((res) => setSummary(res.data));
  }, []);

  if (!summary) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>Admin dashboard</h1>
      <div className="stat-grid">
        <div className="stat-card">
          <p>Customers</p>
          <h2>{summary.userCount}</h2>
        </div>
        <div className="stat-card">
          <p>Active products</p>
          <h2>{summary.productCount}</h2>
        </div>
        <div className="stat-card">
          <p>Orders</p>
          <h2>{summary.orderCount}</h2>
        </div>
        <div className="stat-card">
          <p>Revenue</p>
          <h2>&#8377;{summary.totalRevenue.toLocaleString('en-IN')}</h2>
        </div>
      </div>
    </div>
  );
}
