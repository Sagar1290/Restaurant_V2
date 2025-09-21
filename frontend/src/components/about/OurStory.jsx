import React from "react";

const OurStory = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6">
              Born in the heart of Rewa, Madhya Pradesh, "Table & Taste" was
              started by the Prajapati family with a simple dream – to bring
              authentic, homely Indian flavors to everyone who walked through
              our doors. What began as a modest family-run eatery soon became a
              favorite spot for locals, known for seasonal recipes, regional
              delicacies, and a promise of hygiene and warmth.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              As word spread, our love for food and hospitality carried us
              beyond Rewa. Over the years, "Table & Taste" has opened branches
              in Delhi, Allahabad, and Dehradun – each one holding onto the same
              values of authenticity, freshness, and heartfelt service that
              started it all.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              From family dinners to festive gatherings, we continue to serve
              dishes that celebrate the rich diversity of Indian cuisine. For
              us, it’s more than just food – it’s about creating memories,
              honoring traditions, and carrying forward a legacy of togetherness
              at every table.
            </p>
            <button className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-8 py-4 text-lg">
              View Our Menu
            </button>
          </div>
          <div className="relative">
            <img
              alt="Table & Taste Restaurant History"
              className="rounded-lg shadow-xl object-cover object-top w-full h-96"
              src="/images/restaurant-inside.jpg"
            />
            <div className="absolute -bottom-6 -right-6 bg-orange-600 text-white p-4 rounded-lg shadow-lg">
              <div className="text-3xl font-bold">39</div>
              <div className="text-sm">Years of Tradition</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
