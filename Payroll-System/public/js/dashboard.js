document.addEventListener('DOMContentLoaded', function () {
  const salaryChartEl = document.getElementById('salaryChart');
  if (!salaryChartEl) return;

  const labels = JSON.parse(salaryChartEl.dataset.labels || '[]');
  const data = JSON.parse(salaryChartEl.dataset.values || '[]');

  new Chart(salaryChartEl, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Monthly Payroll',
        data,
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v) => '$' + v.toLocaleString()
          }
        }
      }
    }
  });

  const leaveChartEl = document.getElementById('leaveChart');
  if (leaveChartEl) {
    const leaveLabels = JSON.parse(leaveChartEl.dataset.labels || '[]');
    const leaveData = JSON.parse(leaveChartEl.dataset.values || '[]');
    new Chart(leaveChartEl, {
      type: 'doughnut',
      data: {
        labels: leaveLabels,
        datasets: [{
          data: leaveData,
          backgroundColor: ['#4f46e5', '#059669', '#dc2626', '#d97706']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
});
