import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const slides = [
  {
    id: 1,
    title: 'جشنواره کتاب‌خوانی',
    subtitle: 'تا ۵۰٪ تخفیف روی همه کتاب‌ها',
    image: '/images/sliders/slider-1.jpg',
    link: '/products?discount=true',
    buttonText: 'مشاهده',
    bgColor: 'from-blue-600 to-purple-600',
  },
  {
    id: 2,
    title: 'تازه‌های نشر',
    subtitle: 'جدیدترین کتاب‌های منتشر شده',
    image: '/images/sliders/slider-2.jpg',
    link: '/products?sort=newest',
    buttonText: 'خرید کنید',
    bgColor: 'from-green-600 to-teal-600',
  },
  {
    id: 3,
    title: 'پرفروش‌ترین‌ها',
    subtitle: 'محبوب‌ترین کتاب‌های ماه',
    image: '/images/sliders/slider-3.jpg',
    link: '/products?bestseller=true',
    buttonText: 'ببینید',
    bgColor: 'from-orange-500 to-red-600',
  },
]

const HeroSlider = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="rounded-xl overflow-hidden"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div
            className={`relative h-[300px] md:h-[400px] bg-gradient-to-l ${slide.bgColor} flex items-center`}
          >
            <div className="container mx-auto px-8">
              <div className="max-w-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{slide.title}</h2>
                <p className="text-lg text-white/90 mb-6">{slide.subtitle}</p>
                <Link to={slide.link} className="btn bg-white text-gray-900 hover:bg-gray-100">
                  {slide.buttonText}
                </Link>
              </div>
            </div>
            <div className="absolute left-0 bottom-0 w-1/2 h-full hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-transparent" />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default HeroSlider
