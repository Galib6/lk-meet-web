import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const slides = [
  {
    title: 'Host longer group calls',
    description:
      'Meetings of three or more participants can last up to 24 hours, exceeding your current one-hour limit. Meetings can include up to 100 participants.',
    image: '/images/toolxox.com-iscout-nhLzOeSavC.png',
  },
  {
    title: 'Collaborate with your team',
    description:
      'Work together with your team in real-time, share your screen, and collaborate on documents during your meetings.',
    image: '/images/toolxox.com-iscout-LTY6oP8gNv.png',
  },
  {
    title: 'Secure and private',
    description:
      'Your meetings are secure and private with end-to-end encryption, ensuring that your conversations remain confidential.',
    image: '/images/toolxox.com-iscout-j4MP7ztLC2.png',
  },
  {
    title: 'Easy scheduling',
    description:
      'Schedule your meetings with ease using our integrated calendar and reminder system, so you never miss an important meeting.',
    image: '/images/toolxox.com-iscout-sOZaC1W97D.png',
  },
  {
    title: 'Join from any device',
    description:
      'Join meetings from any device, whether it’s your desktop, laptop, tablet, or smartphone, and stay connected on the go.',
    image: '/images/toolxox.com-iscout-wdE3PptRNH.png',
  },
];

const Slider = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const totalSlides = slides.length;

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative mt-8 md:mt-0">
      <button
        onClick={handlePrevSlide}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-1.5 shadow-md sm:p-2"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
      </button>

      <div className="h-96 overflow-hidden">
        {' '}
        {/* Set a fixed height for the container */}
        <AnimatePresence initial={false}>
          {slides.map(
            (item, i) =>
              activeSlide === i && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="flex h-full flex-col items-center" // Ensure the div takes full height
                >
                  <div className="relative h-48 w-full sm:h-64 md:h-80">
                    <Image
                      src={item.image}
                      alt="Video meeting illustration"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="p-4"
                    />
                  </div>

                  <div className="mt-4 px-4 text-center sm:mt-6">
                    <h2 className="mb-2 text-lg font-medium text-gray-800 sm:text-xl">{item.title}</h2>
                    <p className="mx-auto max-w-md text-xs text-gray-600 sm:text-sm">{item.description}</p>
                    <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 sm:px-6 sm:text-base">
                      Start trial
                    </button>
                  </div>
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleNextSlide}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-1.5 shadow-md sm:p-2"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
      </button>

      {/* Pagination Dots */}
      <div className="mt-4 flex justify-center space-x-2 sm:mt-6">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`h-2 w-2 rounded-full ${index === activeSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
