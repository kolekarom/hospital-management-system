export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <p className="flex items-center space-x-2">
              <span className="font-medium">Address:</span>
              <span>123 Healthcare Street, Medical District, MD 12345</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="font-medium">Email:</span>
              <span>support@medichain.com</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="font-medium">Phone:</span>
              <span>(123) 456-7890</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="font-medium">Emergency:</span>
              <span>1-800-MED-HELP</span>
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border rounded-md"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border rounded-md"
                placeholder="Your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea
                id="message"
                rows={4}
                className="w-full p-2 border rounded-md"
                placeholder="Your message"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
