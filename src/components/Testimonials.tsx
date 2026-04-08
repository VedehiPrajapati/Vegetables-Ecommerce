import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Chef David",
    role: "Executive Chef, Blue Ocean Diners",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: `"FreshBulk has completely transformed how we source for our 3 restaurant locations. The quality is consistently A-grade, and the next-day delivery is always on time."`,
  },
  {
    name: "Priya M.",
    role: "Procurement Manager, Urban Hotels",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: `"The transparent live market pricing saves us hours of negotiation with vendors. The platform is incredibly easy to use for placing our daily large bulk orders."`,
  },
  {
    name: "Ahmed K.",
    role: "Owner, FreshMart Chain",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    text: `"We run a chain of local grocery marts. FreshBulk ensures we never run out of daily staples. The MOQs are perfectly aligned with commercial needs."`,
  },
];

const Testimonials = () => {
  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Trusted by Top Kitchens & Retailers
          </h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base">
            See what our regular bulk buyers have to say about our quality and service.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {item.text}
              </p>

              <div className="border-t pt-4 flex items-center gap-3">
                {/* Avatar */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* Name */}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;