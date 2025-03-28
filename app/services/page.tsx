export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-8">Our Services</h1>
          <div className="relative w-full h-[300px] mb-8">
            <img
              src="/images/service-placeholder.svg"
              alt="Medical services"
              className="rounded-lg shadow-xl object-contain w-full h-full bg-gray-50"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-50">
              <img
                src="/images/service-placeholder.svg"
                alt="Medical Records Management"
                className="w-full h-full object-contain p-4"
              />
            </div>
            <h2 className="text-xl font-semibold mb-4">Medical Records Management</h2>
            <p className="text-gray-600">
              Secure storage and management of medical records using blockchain technology.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-50">
              <img
                src="/images/service-placeholder.svg"
                alt="Online Consultations"
                className="w-full h-full object-contain p-4"
              />
            </div>
            <h2 className="text-xl font-semibold mb-4">Online Consultations</h2>
            <p className="text-gray-600">
              Connect with healthcare providers through secure video consultations.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-50">
              <img
                src="/images/service-placeholder.svg"
                alt="Appointment Scheduling"
                className="w-full h-full object-contain p-4"
              />
            </div>
            <h2 className="text-xl font-semibold mb-4">Appointment Scheduling</h2>
            <p className="text-gray-600">
              Easy and efficient appointment booking with your preferred doctors.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
