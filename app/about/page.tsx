export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-8">About MediChain</h1>
          <div className="relative w-full h-[400px] mb-8">
            <img
              src="/doctor-consulting.jpg"
              alt="Doctor consulting with patient"
              className="rounded-lg shadow-xl object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            MediChain is revolutionizing healthcare through secure, blockchain-based medical record management
            and seamless doctor-patient interactions.
          </p>
          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-primary/5 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="mb-6">
                To provide a secure, efficient, and user-friendly platform that connects healthcare providers
                with patients while ensuring the highest standards of data privacy and security through
                blockchain technology.
              </p>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p className="mb-6">
                To transform healthcare delivery by creating a seamless digital ecosystem where medical
                records are secure, accessible, and interoperable, empowering both healthcare providers
                and patients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
