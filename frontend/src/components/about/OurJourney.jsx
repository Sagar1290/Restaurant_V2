const milestones = [
  {
    year: "1985",
    title: "Humble Beginnings",
    description:
      "The Prajapati family opened 'Table & Taste' in Rewa, Madhya Pradesh, serving homely seasonal and regional dishes with a focus on hygiene and tradition.",
  },
  {
    year: "1995",
    title: "Local Favorite",
    description:
      "Word of our authentic flavors spread, and the restaurant became a go-to spot for family gatherings, festivals, and community celebrations.",
  },
  {
    year: "2005",
    title: "First Expansion",
    description:
      "With growing popularity, we expanded beyond Rewa and opened our first branch in Allahabad, bringing our taste of home to more people.",
  },
  {
    year: "2012",
    title: "Stepping into the Capital",
    description:
      "Our Delhi branch opened, introducing our signature dishes to a wider audience while preserving the same family warmth and authenticity.",
  },
  {
    year: "2018",
    title: "Beyond Borders",
    description:
      "We set up in Dehradun, bringing mountain lovers and locals alike a comforting space to enjoy regional Indian cuisine with our signature style.",
  },
  {
    year: "2024",
    title: "Digital Flavor",
    description:
      "Launched our digital platform, making it easy for customers to explore our menu, order online, and stay connected with the 'Table & Taste' family.",
  },
];

const Milestone = ({ year, title, description, isReversed }) => (
  <div
    className={`flex items-center ${
      isReversed ? "flex-row-reverse" : "flex-row"
    }`}
  >
    <div className="w-1/2  text-right">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="text-3xl font-bold text-orange-600 mb-2">{year}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm md:text-base">{description}</p>
      </div>
    </div>
    <div className="relative z-10 w-4 h-4 bg-orange-600 rounded-full border-4 border-white shadow"></div>
    <div className="w-1/2"></div>
  </div>
);

const OurJourney = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Key milestones that shaped{" "}
            <span
              className="text-orange-500"
              style={{ fontFamily: "Cinzel,serif" }}
            >
              {" "}
              Table & Taste{" "}
            </span>{" "}
            into the beloved destination it is today
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-orange-200"></div>
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <Milestone
                key={milestone.year}
                year={milestone.year}
                title={milestone.title}
                description={milestone.description}
                isReversed={index % 2 !== 0} // Alternate timeline sides
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurJourney;
