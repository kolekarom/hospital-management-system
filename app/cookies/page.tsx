export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      <div className="prose max-w-none">
        <p className="mb-6">
          This Cookie Policy explains how MediChain uses cookies and similar technologies to provide,
          customize, evaluate, improve, promote and protect our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What are Cookies?</h2>
        <p className="mb-6">
          Cookies are small text files that are placed on your device when you visit our website.
          They help us provide you with a better experience and allow certain features to work.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Cookies</h2>
        <p className="mb-6">We use cookies for the following purposes:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Authentication and security</li>
          <li>Preferences and settings</li>
          <li>Performance and analytics</li>
          <li>Advertising and marketing</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Types of Cookies We Use</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
            <p>Required for the website to function properly.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Functional Cookies</h3>
            <p>Remember your preferences and settings.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Analytics Cookies</h3>
            <p>Help us understand how visitors interact with our website.</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Managing Cookies</h2>
        <p className="mb-6">
          Most web browsers allow you to control cookies through their settings preferences.
          However, limiting cookies may impact your experience using our website.
        </p>
      </div>
    </div>
  )
}
