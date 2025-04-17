import Link from "next/link";
import { Button } from "@/components/ui/button";

const WallOfLoveSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="learnq-container">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Loved by SAT Students across the Globe
          </h3>
          <Button variant="outline" className="border-primary text-primary" asChild>
            <Link href="https://love.learnq.ai/all">
              See the Wall of Love
            </Link>
          </Button>
        </div>

        {/* Testimonials grid would go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
              <div>
                <h4 className="font-medium text-gray-900">Sarah M.</h4>
                <p className="text-gray-500 text-sm">Student</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              "I improved my SAT score by 300+ points in just 2 months of using LearnQ.ai! The personalized study plan and AI tutor were game-changers for me."
            </p>
            <div className="flex items-center mt-auto">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 text-sm ml-2">5.0</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
              <div>
                <h4 className="font-medium text-gray-900">Jason T.</h4>
                <p className="text-gray-500 text-sm">High School Senior</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              "The Digital SAT play and practice games made studying actually fun! I didn't even feel like I was preparing for a test. Mia the AI tutor was always there when I got stuck on a question."
            </p>
            <div className="flex items-center mt-auto">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 text-sm ml-2">5.0</span>
            </div>
          </div>
        </div>

        {/* Ambassador section */}
        <div className="mt-20 bg-green-50 rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-1">Campus</h3>
              <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-4">Ambassador Program</h3>
              <h4 className="font-medium text-gray-800 mb-6">Become an Official Ambassador!</h4>

              <div className="mb-6">
                <p className="font-medium mb-2">Promote Us and Enjoy Exclusive Rewards:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2" />
                    <span className="text-gray-700">
                      <strong>Earn Unlimited commissions</strong>, build your personal brand, and boost your resume!
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2" />
                    <span className="text-gray-700">
                      Grow your network, gain experience, and <strong>get certified</strong>!
                    </span>
                  </li>
                </ul>
              </div>

              <Button className="bg-green-700 hover:bg-green-800 text-white" asChild>
                <Link href="https://cutt.ly/9ebRnLka">
                  Apply Now
                </Link>
              </Button>
            </div>
            <div className="relative h-[200px] md:h-[300px]">
              {/* This would be an image in the real implementation */}
              <div className="w-full h-full bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-800 font-medium">Ambassador Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WallOfLoveSection;
