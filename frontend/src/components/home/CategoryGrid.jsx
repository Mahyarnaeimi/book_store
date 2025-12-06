import { Link } from 'react-router-dom'

const categories = [
  { id: 1, name: 'ادبیات', icon: '📚', slug: 'literature' },
  { id: 2, name: 'روانشناسی', icon: '🧠', slug: 'psychology' },
  { id: 3, name: 'تاریخ', icon: '📜', slug: 'history' },
  { id: 4, name: 'علمی', icon: '🔬', slug: 'science' },
  { id: 5, name: 'کودک و نوجوان', icon: '🧒', slug: 'children' },
  { id: 6, name: 'هنر', icon: '🎨', slug: 'art' },
  { id: 7, name: 'فلسفه', icon: '💭', slug: 'philosophy' },
  { id: 8, name: 'مذهبی', icon: '🕌', slug: 'religious' },
]

const CategoryGrid = () => {
  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-6">دسته‌بندی‌ها</h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow text-center"
          >
            <span className="text-3xl mb-2">{cat.icon}</span>
            <span className="text-sm font-medium">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryGrid
