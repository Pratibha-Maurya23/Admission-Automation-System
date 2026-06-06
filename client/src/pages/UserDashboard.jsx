import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Mail, Phone, MapPin, Calendar, BookOpen, Award } from 'lucide-react';
import { API_URL } from '../config';

export default function UserDashboard({ student }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admission');
  const [showModal, setShowModal] = useState(false);

  const stats = [
    { label: 'Admission No', value: student.admissionNo, icon: FileText },
    { label: 'Course', value: student.course, icon: BookOpen },
    { label: 'Year', value: student.year, icon: Award },
  ];

  const admissionDetails = {
    'Admission No': student.admissionNo,
    'Full Name': student.name,
    'Course': student.course,
    'Branch': student.branch,
    'Year': student.year,
  };

  const profileDetails = {
    'DOB': student.dob,
    'Email': student.email,
    'Phone': student.phone,
    'Address': student.address,
    '10th Marks': student.qualifications?.tenth?.marks,
    '12th Marks': student.qualifications?.twelfth?.marks,
  };

  if (student.payment?.status !== 'PAID') {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Admission Incomplete ❌
        </h2>
        <p className="mt-2">Please complete payment to access dashboard</p>
        <button
          onClick={() => navigate(`/payment/${student._id}`)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome, <span className="text-indigo-600">{student.name}</span>
          </h1>
          <p className="text-gray-500 mt-2">Here's your admission dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  <Icon className="text-indigo-600" size={24} />
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="font-semibold text-lg">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {['admission', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {activeTab === 'admission' && (
            <div className="space-y-4">
              {Object.entries(admissionDetails).map(([label, value]) => (
                value && <DetailItem key={label} label={label} value={value} />
              ))}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              {Object.entries(profileDetails).map(([label, value]) => (
                value && <DetailItem key={label} label={label} value={value} icon={Mail} />
              ))}
            </div>
          )}
        </div>

        {/* Payment Status */}
        <div className={`rounded-lg shadow-lg p-8 mb-6 ${
          student.payment?.status === 'PAID'
            ? 'bg-green-50 border-2 border-green-200'
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Payment Status</h3>
              <span className={'text-lg font-bold text-green-600'}>
              ✅ Payment Completed</span>
                 <div className="mt-3">
        <a
          href={`${API_URL}/receipt/${student._id}`}
          className="text-blue-600 underline font-medium"
          target="_blank"
          rel="noreferrer"
        >
          Download Receipt 🧾
        </a>
      </div>
            </div>
          </div>
        </div>

        {/* Next Year Application */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold mb-3">Ready for Next Year?</h3>
          <p className="mb-4">Apply for next year admission and continue your journey</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Apply for Next Year
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      {Icon && <Icon className="text-indigo-600" size={20} />}
      <div className="flex-1">
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="font-semibold text-lg">{value}</p>
      </div>
    </div>
  );
}
