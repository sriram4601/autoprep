import Image from "next/image";

const statsData = [
  {
    id: "minutes-practice",
    number: "1.7M+",
    label: "Minutes Practices",
    sublabel: "By Digital SAT Aspirants"
  },
  {
    id: "tests-completed",
    number: "200K+",
    label: "Practice Tests Completed",
    sublabel: "Evaluate SAT Exam Score"
  },
  {
    id: "doubts-answered",
    number: "73K+",
    label: "DSAT Doubts Answered",
    sublabel: "By AI Tutor MIA"
  },
  {
    id: "countries",
    number: "139+",
    label: "Countries",
    sublabel: "Learners Chose Us For DSAT"
  },
  {
    id: "app-rating",
    number: "4.9",
    label: "App & Play Store Rating",
    sublabel: "First Choice for DSAT Training",
    icon: "https://ext.same-assets.com/2634247107/3783633550.svg"
  }
];

const StatsSection = () => {
  return (
    <section className="py-8 border-t border-gray-100">
      <div className="learnq-container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {statsData.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1">
                <span className="stat-number">{stat.number}</span>
                {stat.icon && (
                  <div className="h-5 w-20 relative">
                    <Image
                      src={stat.icon}
                      alt="Stars"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>
              <h3 className="font-medium text-gray-900 text-sm md:text-base">{stat.label}</h3>
              <p className="stat-label text-xs md:text-sm">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
