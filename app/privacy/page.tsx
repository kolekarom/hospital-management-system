export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p className="mb-6">
          At MediChain, we take your privacy seriously. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you use our platform.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p className="mb-6">
          We collect information that you provide directly to us, including but not limited to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Personal identification information</li>
          <li>Medical history and records</li>
          <li>Contact information</li>
          <li>Payment information</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p className="mb-6">
          Your information is used to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Provide and maintain our services</li>
          <li>Process appointments and payments</li>
          <li>Communicate with you about our services</li>
          <li>Improve our platform and user experience</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
        <p className="mb-6">
          We implement appropriate technical and organizational security measures to protect your
          personal information. Our blockchain technology ensures that your medical records are
          secure and immutable.
        </p>
      </div>
    </div>
  )
}
