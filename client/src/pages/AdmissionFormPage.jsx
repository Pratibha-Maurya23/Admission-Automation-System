import { useState } from "react";
import { FileText, Upload} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function AdmissionFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    course: "",
    branch:"",
    document: null,
  });
  
  const courses = [
    "BTech","MCA","MBA",
  ]

   const branchs = [
    "Computer Science and Engineering",
    "Computer Science and Engineering AI/ML",
    "Data Science",
    "ECE",
    "Mechenical",
  ];

const [errors, setErrors] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();
  if ((formData.step || 1) !== 5) {
    alert("Complete all steps first ❌");
    return;
  }
   const studentData = {
    name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    dob: formData.dateOfBirth,
    address: formData.address,

    aadharNo: formData.aadharNo,

    course: formData.course,
    branch: formData.branch,
    year: new Date().getFullYear(),

    qualifications: {
      tenth: {
        rollNo: formData.tenthRoll,
        marks: formData.tenthMarks,
        certificate: formData.tenthCertName || "",
      },
      twelfth: {
        rollNo: formData.twelfthRoll,
        marks: formData.twelfthMarks,
        certificate: formData.twelfthCertName || "",
      },
    },

    documents: {
      aadhar: formData.aadharFileName || "",
      domicile: formData.domicileCertName || "",
      income: formData.incomeCertName || "",
      additional: formData.additionalDocName || "",
    },

    gap: {
      years: formData.gapYears || 0,
      reason: formData.gapReason || "",
    },
  };


  try {
    const res = await fetch(`${API_URL}/admission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Admission failed");
      return;
    }

    // ✅ show admission no & password alert/prompt
    alert(`🎓 Admission Successful!\n\nAdmission No: ${data.admissionNo}\nPassword: ${data.password}\n\n⚠️ IMPORTANT: Please copy and remember these credentials to log in later!`);

    // ✅ redirect to payment passing state
    navigate(`/payment/${data.studentId}`, {
      state: {
        admissionNo: data.admissionNo,
        password: data.password,
      }
    });


  } catch (err) {
    console.error("Submit error:", err);
    alert("Server error❌");
  }
};

  const step = formData.step || 1;

  const fileIsValid = (file) => {
    if (!file) return { ok: false, reason: "No file" };
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) return { ok: false, reason: "Only PDF/PNG/JPEG allowed" };
    if (file.size > maxSize) return { ok: false, reason: "File too large (max 5MB)" };
    return { ok: true };
  };

  const handleNamedFile = (key, e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setFormData({ ...formData, [key]: null, [`${key}Preview`]: "" });
      return;
    }
    const valid = fileIsValid(file);
    if (!valid.ok) {
      setErrors({ ...errors, [key]: valid.reason });
      setFormData({ ...formData, [key]: null, [`${key}Preview`]: "" });
      return;
    }
    setErrors({ ...errors, [key]: undefined });
    const url = URL.createObjectURL(file);
    setFormData({ ...formData, [key]: file, [`${key}Preview`]: url, [`${key}Name`]: file.name });
  };

  const goNext = async () => {
    // minimal per-step validation
    const s = formData.step || 1;
    const stepErrors = {};
    if (s === 1) {
      if (!formData.fullName?.trim()) stepErrors.fullName = "Full name required";
      if (!formData.dateOfBirth?.trim()) stepErrors.dateOfBirth = "Date Of Birth required";
      if (!formData.email?.trim()) stepErrors.email = "Email required";
      if (!formData.phone?.trim()) stepErrors.phone = "Phone required";
      if (!formData.aadharNo?.trim()) stepErrors.aadharNo = "Aadhar required";
      if (!formData.aadharFile) stepErrors.aadharFile = "Upload Aadhar";
    } else if (s === 2) {
      // 10th
      if (!formData.tenthRoll?.trim()) stepErrors.tenthRoll = "10th roll no required";
      if (!formData.tenthMarks?.trim()) stepErrors.tenthMarks = "10th marks required";
      if (!formData.tenthCert) stepErrors.tenthCert = "Upload 10th certificate";
      // if not same-as-12 show 12 validations
      if (!formData.twelfthRoll?.trim()) stepErrors.twelfthRoll = "12th roll no required";
      if (!formData.twelfthMarks?.trim()) stepErrors.twelfthMarks = "12th marks required";
      if (!formData.twelfthCert) stepErrors.twelfthCert = "Upload 12th certificate";
    } else if (s === 3) {
      if (!formData.address?.trim()) stepErrors.address = "Address required";
      if (!formData.course) stepErrors.course = "Course required";
      if (!formData.branch) stepErrors.branch = "Branch required";
    } else if (s === 4) {
      // documents & additional
      if (!formData.domicileCert) stepErrors.domicileCert = "Upload domicile certificate";
      if (!formData.incomeCert) stepErrors.incomeCert = "Upload income certificate";
    }
    if (Object.keys(stepErrors).length) {
      setErrors({ ...errors, ...stepErrors });
      return;
    }
    setErrors({});
    setFormData({ ...formData, step: s + 1 });
  };

  const goPrev = () => {
    const s = formData.step || 1;
    setFormData({ ...formData, step: Math.max(1, s - 1) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admission Application</h2>
              <p className="text-sm text-gray-600">Multi-step form — complete each section to continue</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 text-sm mb-6">
            {["Personal", "Qualifications", "Address & Course", "Docs & Extra", "Review"].map((label, i) => {
              const idx = i + 1;
              const active = step === idx;
              const done = step > idx;
              return (
                <div key={label} className="flex-1">
                  <div className={`w-full h-2 rounded ${done ? "bg-blue-600" : active ? "bg-blue-300" : "bg-gray-200"}`} />
                  <div className="text-center mt-1">{label}</div>
                </div>
              );
            })}
          </div>

          {/* Step 1: Personal */}
          <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Full Name *</label>
                <input type="text" value={formData.fullName || ""} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className={`mt-1 block w-full px-4 py-2 border ${errors.fullName ? "border-red-500" : "border-gray-300"} rounded`} placeholder="John Doe" />
                {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                  <label className="block text-sm font-medium">DOB *</label>
                  <input type="date" value={formData.dateOfBirth || ""} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className={`mt-1 block w-full px-4 py-2 border ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"} rounded`} placeholder="you@example.com" />
                  {errors.dateOfBirth && <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Email *</label>
                  <input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`mt-1 block w-full px-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded`} placeholder="you@example.com" />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Phone *</label>
                  <input type="tel" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={`mt-1 block w-full px-4 py-2 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded`} placeholder="+91 98765 43210" />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Aadhar Number *</label>
                <input type="number" value={formData.aadharNo || ""} onChange={(e) => setFormData({ ...formData, aadharNo: e.target.value.replace(/\D/g, "").slice(0,12) })} className={`mt-1 block w-full px-4 py-2 border ${errors.aadharNo ? "border-red-500" : "border-gray-300"} rounded`} placeholder="123412341234" />
                <p className="text-xs text-gray-500 mt-1">Only digits, up to 12 characters</p>
                {errors.aadharNo && <p className="text-sm text-red-600 mt-1">{errors.aadharNo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Upload Aadhar (PDF/JPEG/PNG, &lt;5MB) *</label>
                <div className={`mt-1 border-2 border-dashed rounded p-4 text-center ${errors.aadharFile ? "border-red-500" : "border-gray-200"}`}>
                  <Upload className="mx-auto h-6 w-6 text-gray-400" />
                  <label className="cursor-pointer text-blue-600 font-medium">
                    Click to upload
                    <input type="file" accept=".pdf,image/*" onChange={(e) => handleNamedFile("aadharFile", e)} className="hidden" />
                  </label>
                  {formData.aadharFileName && <p className="mt-2 text-green-600">{formData.aadharFileName}</p>}
                  {formData.aadharFilePreview && (
                    <div className="mt-3">
                      {formData.aadharFile?.type?.includes("image") ? (
                        <img src={formData.aadharFilePreview} alt="aadhar" className="mx-auto max-h-48" />
                      ) : (
                        <a href={formData.aadharFilePreview} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open uploaded Aadhar</a>
                      )}
                    </div>
                  )}
                  {errors.aadharFile && <p className="text-sm text-red-600 mt-2">{errors.aadharFile}</p>}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => navigate("/")} className="bg-white border px-4 py-2 rounded">Cancel</button>
                <button type="button" onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
              </div>
            </div>
          )}

          {/* Step 2: Qualifications */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">10th / 12th Qualifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">10th Roll No *</label>
                  <input type="number" value={formData.tenthRoll || ""} onChange={(e) => setFormData({ ...formData, tenthRoll: e.target.value.replace(/\D/g, "").slice(0,12) })} className={`mt-1 w-full px-4 py-2 border ${errors.tenthRoll ? "border-red-500" : "border-gray-300"} rounded`} />
                  {errors.tenthRoll && <p className="text-sm text-red-600 mt-1">{errors.tenthRoll}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium">10th Marks/Percentage *</label>
                  <input type="number" value={formData.tenthMarks || ""} onChange={(e) => setFormData({ ...formData, tenthMarks: e.target.value.replace(/\D/g, "").slice(0,2) })} className={`mt-1 w-full px-4 py-2 border ${errors.tenthMarks ? "border-red-500" : "border-gray-300"} rounded`} />
                  {errors.tenthMarks && <p className="text-sm text-red-600 mt-1">{errors.tenthMarks}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Upload 10th Certificate *</label>
                <div className={`mt-1 border-2 border-dashed rounded p-4 text-center ${errors.tenthCert ? "border-red-500" : "border-gray-200"}`}>
                  <input type="file" accept=".pdf,image/*" onChange={(e) => handleNamedFile("tenthCert", e)} className="hidden" id="t10" />
                  <label htmlFor="t10" className="cursor-pointer text-blue-600">Click to upload 10th certificate</label>
                  {formData.tenthCertName && <p className="mt-2 text-green-600">{formData.tenthCertName}</p>}
                  {formData.tenthCertPreview && (formData.tenthCert.type?.includes("image") ? <img src={formData.tenthCertPreview} alt="10th" className="mx-auto max-h-44 mt-2" /> : <a href={formData.tenthCertPreview} target="_blank" rel="noreferrer" className="text-blue-600 underline block mt-2">Open 10th certificate</a>)}
                  {errors.tenthCert && <p className="text-sm text-red-600 mt-2">{errors.tenthCert}</p>}
                </div>
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">12th Roll No *</label>
                      <input type="text" value={formData.twelfthRoll || ""} onChange={(e) => setFormData({ ...formData, twelfthRoll: e.target.value.replace(/\D/g, "").slice(0,12) })} className={`mt-1 w-full px-4 py-2 border ${errors.twelfthRoll ? "border-red-500" : "border-gray-300"} rounded`} />
                      {errors.twelfthRoll && <p className="text-sm text-red-600 mt-1">{errors.twelfthRoll}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium">12th Marks/Percentage *</label>
                      <input type="text" value={formData.twelfthMarks || ""} onChange={(e) => setFormData({ ...formData, twelfthMarks: e.target.value.replace(/\D/g, "").slice(0,2) })} className={`mt-1 w-full px-4 py-2 border ${errors.twelfthMarks ? "border-red-500" : "border-gray-300"} rounded`} />
                      {errors.twelfthMarks && <p className="text-sm text-red-600 mt-1">{errors.twelfthMarks}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Upload 12th Certificate *</label>
                    <div className={`mt-1 border-2 border-dashed rounded p-4 text-center ${errors.twelfthCert ? "border-red-500" : "border-gray-200"}`}>
                      <input type="file" accept=".pdf,image/*" onChange={(e) => handleNamedFile("twelfthCert", e)} className="hidden" id="t12" />
                      <label htmlFor="t12" className="cursor-pointer text-blue-600">Click to upload 12th certificate</label>
                      {formData.twelfthCertName && <p className="mt-2 text-green-600">{formData.twelfthCertName}</p>}
                      {formData.twelfthCertPreview && (formData.twelfthCert.type?.includes("image") ? <img src={formData.twelfthCertPreview} alt="12th" className="mx-auto max-h-44 mt-2" /> : <a href={formData.twelfthCertPreview} target="_blank" rel="noreferrer" className="text-blue-600 underline block mt-2">Open 12th certificate</a>)}
                      {errors.twelfthCert && <p className="text-sm text-red-600 mt-2">{errors.twelfthCert}</p>}
                    </div>
                  </div>
               
              

              <div className="flex justify-between pt-4">
                <button type="button" onClick={goPrev} className="bg-white border px-4 py-2 rounded">Back</button>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setFormData({ ...formData, step: 1 }); navigate("/"); }} className="bg-white border px-4 py-2 rounded">Cancel</button>
                  <button type="button" onClick={goNext} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address & Course */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address & Course Details</h3>

              <div>
                <label className="block text-sm font-medium">Full Address *</label>
                <textarea rows={3} value={formData.address || ""} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={`mt-1 w-full px-4 py-2 border ${errors.address ? "border-red-500" : "border-gray-300"} rounded`} placeholder="House, Street, City, State, PIN" />
                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Course Selection *</label>
                  <select value={formData.course || ""} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className={`mt-1 w-full px-4 py-2 border ${errors.course ? "border-red-500" : "border-gray-300"} rounded`}>
                    <option value="">Select a course</option>
                    {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.course && <p className="text-sm text-red-600 mt-1">{errors.course}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Branch *</label>
                  <select value={formData.branch || ""} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} className={`mt-1 w-full px-4 py-2 border ${errors.branch ? "border-red-500" : "border-gray-300"} rounded`}>
                    <option value="">Select branch</option>
                    {branchs.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.branch && <p className="text-sm text-red-600 mt-1">{errors.branch}</p>}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={goPrev} className="bg-white border px-4 py-2 rounded">Back</button>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, step: 4 })} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents & Additional Info */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supporting Documents & Additional Information</h3>

              <div>
                <label className="block text-sm font-medium">Domicile Certificate (PDF/JPEG/PNG, &lt;5MB) *</label>
                <div className={`mt-1 border-2 border-dashed rounded p-4 text-center ${errors.domicileCert ? "border-red-500" : "border-gray-200"}`}>
                  <input type="file" accept=".pdf,image/*" onChange={(e) => handleNamedFile("domicileCert", e)} className="hidden" id="dom" />
                  <label htmlFor="dom" className="cursor-pointer text-blue-600">Click to upload domicile</label>
                  {formData.domicileCertName && <p className="mt-2 text-green-600">{formData.domicileCertName}</p>}
                  {formData.domicileCertPreview && (formData.domicileCert.type?.includes("image") ? <img src={formData.domicileCertPreview} alt="domicile" className="mx-auto max-h-44 mt-2" /> : <a href={formData.domicileCertPreview} target="_blank" rel="noreferrer" className="text-blue-600 underline block mt-2">Open domicile</a>)}
                  {errors.domicileCert && <p className="text-sm text-red-600 mt-2">{errors.domicileCert}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Income Certificate (PDF/JPEG/PNG, &lt;5MB) *</label>
                <div className={`mt-1 border-2 border-dashed rounded p-4 text-center ${errors.incomeCert ? "border-red-500" : "border-gray-200"}`}>
                  <input type="file" accept=".pdf,image/*" onChange={(e) => handleNamedFile("incomeCert", e)} className="hidden" id="inc" />
                  <label htmlFor="inc" className="cursor-pointer text-blue-600">Click to upload income certificate</label>
                  {formData.incomeCertName && <p className="mt-2 text-green-600">{formData.incomeCertName}</p>}
                  {formData.incomeCertPreview && (formData.incomeCert.type?.includes("image") ? <img src={formData.incomeCertPreview} alt="income" className="mx-auto max-h-44 mt-2" /> : <a href={formData.incomeCertPreview} target="_blank" rel="noreferrer" className="text-blue-600 underline block mt-2">Open income certificate</a>)}
                  {errors.incomeCert && <p className="text-sm text-red-600 mt-2">{errors.incomeCert}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Any academic gap? (years)</label>
                <input type="number" min="0" value={formData.gapYears || ""} onChange={(e) => setFormData({ ...formData, gapYears: e.target.value })} className="mt-1 w-48 px-4 py-2 border border-gray-300 rounded" />
                <textarea rows={3} placeholder="If yes, explain reason" value={formData.gapReason || ""} onChange={(e) => setFormData({ ...formData, gapReason: e.target.value })} className="mt-2 w-full px-4 py-2 border border-gray-300 rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium">Additional Document (optional)</label>
                <div className="mt-1 border-2 border-dashed rounded p-4 text-center border-gray-200">
                  <input type="file" accept=".pdf,image/*" onChange={(e) => handleNamedFile("additionalDoc", e)} className="hidden" id="adddoc" />
                  <label htmlFor="adddoc" className="cursor-pointer text-blue-600">Upload additional doc</label>
                  {formData.additionalDocName && <p className="mt-2 text-green-600">{formData.additionalDocName}</p>}
                  {formData.additionalDocPreview && (formData.additionalDoc.type?.includes("image") ? <img src={formData.additionalDocPreview} alt="additional" className="mx-auto max-h-44 mt-2" /> : <a href={formData.additionalDocPreview} target="_blank" rel="noreferrer" className="text-blue-600 underline block mt-2">Open document</a>)}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={goPrev} className="bg-white border px-4 py-2 rounded">Back</button>
                <button type="button" onClick={() => setFormData({ ...formData, step: 5 })} className="bg-blue-600 text-white px-6 py-2 rounded">Review & Submit</button>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review & Submit</h3>

              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Name:</strong> {formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Aadhar:</strong> {formData.aadharNo} {formData.aadharFileName && <span>— <a href={formData.aadharFilePreview} target="_blank" rel="noreferrer" className="text-blue-600 underline">view</a></span>}</p>
                <hr className="my-2" />
                <p><strong>10th:</strong> Roll {formData.tenthRoll} — {formData.tenthMarks} {formData.tenthCertName && <span>— <a href={formData.tenthCertPreview} target="_blank" rel="noreferrer" className="text-blue-600 underline">view</a></span>}</p>
                <p><strong>12th:</strong> Roll {formData.twelfthRoll} — {formData.twelfthMarks} {formData.twelfthCertName && <span>— <a href={formData.twelfthCertPreview} target="_blank" rel="noreferrer" className="text-blue-600 underline">view</a></span>}</p>
                <hr className="my-2" />
                <p><strong>Course:</strong> {formData.course} / {formData.branch}</p>
                <p><strong>Address:</strong> {formData.address}</p>
                <p><strong>Domicile:</strong> {formData.domicileCertName && <span><a href={formData.domicileCertPreview} target="_blank" rel="noreferrer" className="text-blue-600 underline">view</a></span>}</p>
                <p><strong>Income Cert:</strong> {formData.incomeCertName && <span><a href={formData.incomeCertPreview} target="_blank" rel="noreferrer" className="text-blue-600 underline">view</a></span>}</p>
                {formData.gapYears ? <p><strong>Gap Years:</strong> {formData.gapYears} — {formData.gapReason}</p> : null}
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={goPrev} className="bg-white border px-4 py-2 rounded">Back</button>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Submit Application</button>
              </div>
            </div>
          )}
          </form>
        </div>
      </div>
    </div>
  );
}
