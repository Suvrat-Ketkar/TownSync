import React from 'react';

function ComplaintItem({ icon, title, date, status }) {
  const isInProgress = status === 'in-progress';
  const Icon = isInProgress ? WrenchIcon : CheckCircleIcon;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ">
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${isInProgress ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
        <Icon />
      </div>
      <div className="flex flex-col">
        <p className="text-base font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
}

function WrenchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
      <path d="M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96,72.34,72.34,0,0,0,94,124.94L33.79,177c-.15.12-.29.26-.43.39a32,32,0,0,0,45.26,45.26c.13-.13.27-.28.39-.42L131.06,162A72,72,0,0,0,232,96,71.56,71.56,0,0,0,226.76,69ZM160,152a56.14,56.14,0,0,1-27.07-7,8,8,0,0,0-9.92,1.77L67.11,211.51a16,16,0,0,1-22.62-22.62L109.18,133a8,8,0,0,0,1.77-9.93,56,56,0,0,1,58.36-82.31l-31.2,33.81a8,8,0,0,0-1.94,7.1L141.83,108a8,8,0,0,0,6.14,6.14l26.35,5.66a8,8,0,0,0,7.1-1.94l33.81-31.2A56.06,56.06,0,0,1,160,152Z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
    </svg>
  );
}

function Complaints() {
  const complaints = [
    { title: "New pothole at 123 Main St", date: "May 1, 2023", status: "in-progress" },
    { title: "Loud music at 456 Elm St", date: "Apr 30, 2023", status: "in-progress" },
    { title: "Graffiti at 789 Oak St", date: "Apr 29, 2023", status: "completed" },
    { title: "Broken streetlight at 101 Pine St", date: "Apr 28, 2023", status: "completed" },
  ];

  const inProgress = complaints.filter(c => c.status === 'in-progress');
  const completed = complaints.filter(c => c.status === 'completed');

  return (
    <main className="flex-1 px-4 md:px-40 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your complaints</h1>
        
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">In progress</h3>
          <div className="space-y-4">
            {inProgress.map((complaint, index) => (
              <ComplaintItem key={index} {...complaint} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Completed</h3>
          <div className="space-y-4">
            {completed.map((complaint, index) => (
              <ComplaintItem key={index} {...complaint} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Complaints;