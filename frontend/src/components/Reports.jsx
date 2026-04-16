import { useEffect, useState } from 'react';
import { fetchReport } from '../api';

function Reports({ setMessage }) {
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    const result = await fetchReport(startDate, endDate);
    if (result.dailySummary) {
      setReport(result.dailySummary);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const result = await fetchReport(startDate, endDate);
    if (result.dailySummary) {
      setReport(result.dailySummary);
      setMessage('Daily sales report loaded');
    }
  };

  return (
    <div>
      <section className="panel">
        <h2>Daily Sales & Revenue Report</h2>
        <form className="form-grid" onSubmit={handleSearch}>
          <label>
            Start Date
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            End Date
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <button type="submit">Generate Report</button>
        </form>
      </section>
      <section className="panel">
        <h3>Report Summary</h3>
        {report?.length ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transactions</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {report.map((row) => (
                <tr key={row.sale_date}>
                  <td>{row.sale_date}</td>
                  <td>{row.transactions}</td>
                  <td>{Number(row.revenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No report data found for the selected dates.</p>
        )}
      </section>
    </div>
  );
}

export default Reports;
