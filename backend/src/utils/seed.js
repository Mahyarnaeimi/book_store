const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../models/database.model');

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const [adminId] = await db('users').insert({
      ugid: uuidv4(),
      email: 'admin@bookstore.com',
      password_hash: adminPassword,
      first_name: 'مدیر',
      last_name: 'سیستم',
      phone: '09121234567',
      role: 'super_admin',
      is_active: true,
      email_verified: true,
    });

    // Create customer users
    console.log('Creating customer users...');
    const customerPassword = await bcrypt.hash('user123', 10);
    const users = [
      { first_name: 'علی', last_name: 'محمدی', email: 'ali@example.com', phone: '09121111111' },
      { first_name: 'سارا', last_name: 'احمدی', email: 'sara@example.com', phone: '09122222222' },
      { first_name: 'رضا', last_name: 'کریمی', email: 'reza@example.com', phone: '09123333333' },
    ];

    for (const user of users) {
      await db('users').insert({
        ugid: uuidv4(),
        email: user.email,
        password_hash: customerPassword,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: 'customer',
        is_active: true,
        email_verified: true,
      });
    }
    console.log('✅ Users created');

    // Add addresses for first customer
    const firstUser = await db('users').where({ email: 'ali@example.com' }).first();
    await db('user_addresses').insert([
      {
        user_id: firstUser.id,
        title: 'خانه',
        full_name: 'علی محمدی',
        phone: '09121111111',
        province: 'تهران',
        city: 'تهران',
        postal_code: '1234567890',
        address: 'خیابان ولیعصر، کوچه سوم، پلاک ۱۲',
        is_default: true,
      },
      {
        user_id: firstUser.id,
        title: 'محل کار',
        full_name: 'علی محمدی',
        phone: '09121111111',
        province: 'تهران',
        city: 'تهران',
        postal_code: '1234567891',
        address: 'میدان آزادی، برج آزادی، طبقه ۵',
        is_default: false,
      },
    ]);
    console.log('✅ Addresses created');

    // Create categories
    console.log('Creating categories...');
    const mainCategories = [
      { name: 'ادبیات', name_en: 'Literature', slug: 'literature', icon: '📚', sort_order: 1 },
      { name: 'روانشناسی', name_en: 'Psychology', slug: 'psychology', icon: '🧠', sort_order: 2 },
      { name: 'تاریخ', name_en: 'History', slug: 'history', icon: '📜', sort_order: 3 },
      { name: 'علمی', name_en: 'Science', slug: 'science', icon: '🔬', sort_order: 4 },
      { name: 'کودک و نوجوان', name_en: 'Children', slug: 'children', icon: '🧒', sort_order: 5 },
      { name: 'هنر', name_en: 'Art', slug: 'art', icon: '🎨', sort_order: 6 },
      { name: 'فلسفه', name_en: 'Philosophy', slug: 'philosophy', icon: '💭', sort_order: 7 },
      { name: 'مذهبی', name_en: 'Religious', slug: 'religious', icon: '🕌', sort_order: 8 },
    ];

    for (const cat of mainCategories) {
      await db('categories').insert({ ...cat, is_active: true });
    }

    // Get literature category id
    const literatureCategory = await db('categories').where({ slug: 'literature' }).first();
    const psychologyCategory = await db('categories').where({ slug: 'psychology' }).first();

    // Add subcategories
    const subCategories = [
      { parent_id: literatureCategory.id, name: 'ادبیات داستانی', name_en: 'Fiction', slug: 'fiction', sort_order: 1 },
      { parent_id: literatureCategory.id, name: 'شعر', name_en: 'Poetry', slug: 'poetry', sort_order: 2 },
      { parent_id: literatureCategory.id, name: 'ادبیات کلاسیک', name_en: 'Classic', slug: 'classic', sort_order: 3 },
      { parent_id: literatureCategory.id, name: 'رمان خارجی', name_en: 'Foreign Novel', slug: 'foreign-novel', sort_order: 4 },
      { parent_id: psychologyCategory.id, name: 'روانشناسی عمومی', name_en: 'General Psychology', slug: 'general-psychology', sort_order: 1 },
      { parent_id: psychologyCategory.id, name: 'موفقیت', name_en: 'Success', slug: 'success', sort_order: 2 },
      { parent_id: psychologyCategory.id, name: 'روابط', name_en: 'Relationships', slug: 'relationships', sort_order: 3 },
    ];

    for (const cat of subCategories) {
      await db('categories').insert({ ...cat, is_active: true });
    }
    console.log('✅ Categories created');

    // Create authors
    console.log('Creating authors...');
    const authors = [
      { name: 'گابریل گارسیا مارکز', name_en: 'Gabriel García Márquez', slug: 'gabriel-garcia-marquez', bio: 'نویسنده کلمبیایی و برنده جایزه نوبل ادبیات ۱۹۸۲' },
      { name: 'فئودور داستایفسکی', name_en: 'Fyodor Dostoevsky', slug: 'fyodor-dostoevsky', bio: 'نویسنده بزرگ روسی قرن نوزدهم' },
      { name: 'هاروکی موراکامی', name_en: 'Haruki Murakami', slug: 'haruki-murakami', bio: 'نویسنده ژاپنی معاصر' },
      { name: 'پائولو کوئیلو', name_en: 'Paulo Coelho', slug: 'paulo-coelho', bio: 'نویسنده برزیلی' },
      { name: 'صادق هدایت', name_en: 'Sadegh Hedayat', slug: 'sadegh-hedayat', bio: 'نویسنده ایرانی' },
      { name: 'سهراب سپهری', name_en: 'Sohrab Sepehri', slug: 'sohrab-sepehri', bio: 'شاعر و نقاش ایرانی' },
      { name: 'دیل کارنگی', name_en: 'Dale Carnegie', slug: 'dale-carnegie', bio: 'نویسنده آمریکایی' },
      { name: 'رابین شارما', name_en: 'Robin Sharma', slug: 'robin-sharma', bio: 'نویسنده کانادایی' },
      { name: 'جورج اورول', name_en: 'George Orwell', slug: 'george-orwell', bio: 'نویسنده انگلیسی' },
      { name: 'آلبر کامو', name_en: 'Albert Camus', slug: 'albert-camus', bio: 'نویسنده فرانسوی' },
    ];

    for (const author of authors) {
      await db('authors').insert(author);
    }
    console.log('✅ Authors created');

    // Create publishers
    console.log('Creating publishers...');
    const publishers = [
      { name: 'نشر چشمه', name_en: 'Cheshmeh', slug: 'cheshmeh' },
      { name: 'نشر نی', name_en: 'Ney', slug: 'ney' },
      { name: 'انتشارات امیرکبیر', name_en: 'Amirkabir', slug: 'amirkabir' },
      { name: 'نشر مرکز', name_en: 'Markaz', slug: 'markaz' },
      { name: 'انتشارات نگاه', name_en: 'Negah', slug: 'negah' },
      { name: 'نشر ققنوس', name_en: 'Ghoghnoos', slug: 'ghoghnoos' },
      { name: 'انتشارات روزنه', name_en: 'Rozaneh', slug: 'rozaneh' },
      { name: 'نشر ثالث', name_en: 'Sales', slug: 'sales' },
    ];

    for (const pub of publishers) {
      await db('publishers').insert(pub);
    }
    console.log('✅ Publishers created');

    // Get category IDs
    const fictionCategory = await db('categories').where({ slug: 'fiction' }).first();
    const successCategory = await db('categories').where({ slug: 'success' }).first();
    const classicCategory = await db('categories').where({ slug: 'classic' }).first();

    // Get author IDs
    const marquez = await db('authors').where({ slug: 'gabriel-garcia-marquez' }).first();
    const dostoevsky = await db('authors').where({ slug: 'fyodor-dostoevsky' }).first();
    const murakami = await db('authors').where({ slug: 'haruki-murakami' }).first();
    const coelho = await db('authors').where({ slug: 'paulo-coelho' }).first();
    const hedayat = await db('authors').where({ slug: 'sadegh-hedayat' }).first();
    const carnegie = await db('authors').where({ slug: 'dale-carnegie' }).first();
    const sharma = await db('authors').where({ slug: 'robin-sharma' }).first();
    const orwell = await db('authors').where({ slug: 'george-orwell' }).first();
    const camus = await db('authors').where({ slug: 'albert-camus' }).first();

    // Get publisher IDs
    const cheshmeh = await db('publishers').where({ slug: 'cheshmeh' }).first();
    const ney = await db('publishers').where({ slug: 'ney' }).first();
    const amirkabir = await db('publishers').where({ slug: 'amirkabir' }).first();
    const markaz = await db('publishers').where({ slug: 'markaz' }).first();
    const negah = await db('publishers').where({ slug: 'negah' }).first();

    // Create products
    console.log('Creating products...');
    const products = [
      {
        ugid: uuidv4(),
        category_id: fictionCategory.id,
        author_id: marquez.id,
        publisher_id: cheshmeh.id,
        title: 'صد سال تنهایی',
        title_en: 'One Hundred Years of Solitude',
        slug: 'sad-sal-tanhayi',
        description: 'صد سال تنهایی رمانی است نوشتهٔ گابریل گارسیا مارکز، نویسنده کلمبیایی. این کتاب داستان هفت نسل از خاندان بوئندیا را در شهر خیالی ماکوندو روایت می‌کند.',
        short_description: 'شاهکار ادبیات آمریکای لاتین',
        isbn: '978-964-6194-71-7',
        pages: 468,
        publish_year: 1401,
        language: 'فارسی',
        translator: 'بهمن فرزانه',
        format: 'paperback',
        price: 185000,
        compare_price: 220000,
        discount_percent: 16,
        stock: 45,
        sku: 'BOOK-001',
        is_active: true,
        is_featured: true,
        is_bestseller: true,
        rating_avg: 4.7,
        rating_count: 234,
        views_count: 5420,
        sales_count: 890,
      },
      {
        ugid: uuidv4(),
        category_id: classicCategory.id,
        author_id: dostoevsky.id,
        publisher_id: amirkabir.id,
        title: 'جنایت و مکافات',
        title_en: 'Crime and Punishment',
        slug: 'jenayat-va-mokafat',
        description: 'جنایت و مکافات یکی از شاهکارهای ادبیات جهان است که داستان دانشجویی فقیر به نام راسکولنیکف را روایت می‌کند.',
        short_description: 'شاهکار داستایفسکی',
        isbn: '978-964-300-123-4',
        pages: 624,
        publish_year: 1400,
        language: 'فارسی',
        translator: 'مهری آهی',
        format: 'paperback',
        price: 245000,
        compare_price: 280000,
        discount_percent: 12,
        stock: 32,
        sku: 'BOOK-002',
        is_active: true,
        is_featured: true,
        is_bestseller: true,
        rating_avg: 4.9,
        rating_count: 456,
        views_count: 8900,
        sales_count: 1250,
      },
      {
        ugid: uuidv4(),
        category_id: fictionCategory.id,
        author_id: murakami.id,
        publisher_id: cheshmeh.id,
        title: 'کافکا در کرانه',
        title_en: 'Kafka on the Shore',
        slug: 'kafka-dar-karaneh',
        description: 'کافکا در کرانه رمانی است از هاروکی موراکامی نویسنده ژاپنی که در سال ۲۰۰۲ منتشر شد.',
        short_description: 'رمان سورئال موراکامی',
        isbn: '978-964-6194-82-3',
        pages: 520,
        publish_year: 1399,
        language: 'فارسی',
        translator: 'مهدی غبرائی',
        format: 'paperback',
        price: 195000,
        compare_price: null,
        discount_percent: 0,
        stock: 28,
        sku: 'BOOK-003',
        is_active: true,
        is_featured: true,
        is_bestseller: false,
        rating_avg: 4.5,
        rating_count: 189,
        views_count: 3200,
        sales_count: 420,
      },
      {
        ugid: uuidv4(),
        category_id: successCategory.id,
        author_id: coelho.id,
        publisher_id: ney.id,
        title: 'کیمیاگر',
        title_en: 'The Alchemist',
        slug: 'kimiyagar',
        description: 'کیمیاگر رمانی نمادین از پائولو کوئیلو است که داستان سانتیاگو، چوپان آندلسی را در سفر به مصر روایت می‌کند.',
        short_description: 'به دنبال رویاها',
        isbn: '978-964-311-456-7',
        pages: 198,
        publish_year: 1402,
        language: 'فارسی',
        translator: 'آرش حجازی',
        format: 'paperback',
        price: 145000,
        compare_price: 175000,
        discount_percent: 17,
        stock: 120,
        sku: 'BOOK-004',
        is_active: true,
        is_featured: true,
        is_bestseller: true,
        rating_avg: 4.6,
        rating_count: 892,
        views_count: 15000,
        sales_count: 3200,
      },
      {
        ugid: uuidv4(),
        category_id: classicCategory.id,
        author_id: hedayat.id,
        publisher_id: negah.id,
        title: 'بوف کور',
        title_en: 'The Blind Owl',
        slug: 'buf-kur',
        description: 'بوف کور شاهکار صادق هدایت و یکی از مهم‌ترین آثار ادبیات فارسی معاصر است.',
        short_description: 'شاهکار ادبیات فارسی',
        isbn: '978-964-350-789-0',
        pages: 112,
        publish_year: 1398,
        language: 'فارسی',
        format: 'hardcover',
        price: 95000,
        compare_price: null,
        discount_percent: 0,
        stock: 55,
        sku: 'BOOK-005',
        is_active: true,
        is_featured: false,
        is_bestseller: true,
        rating_avg: 4.4,
        rating_count: 567,
        views_count: 7800,
        sales_count: 980,
      },
      {
        ugid: uuidv4(),
        category_id: successCategory.id,
        author_id: carnegie.id,
        publisher_id: ney.id,
        title: 'آیین دوست‌یابی',
        title_en: 'How to Win Friends and Influence People',
        slug: 'ayin-doost-yabi',
        description: 'آیین دوست‌یابی کتابی در زمینه خودیاری نوشته دیل کارنگی است که اولین بار در سال ۱۹۳۶ منتشر شد.',
        short_description: 'کتاب کلاسیک موفقیت',
        isbn: '978-964-311-234-1',
        pages: 288,
        publish_year: 1401,
        language: 'فارسی',
        translator: 'نادعلی همدانی',
        format: 'paperback',
        price: 165000,
        compare_price: 195000,
        discount_percent: 15,
        stock: 89,
        sku: 'BOOK-006',
        is_active: true,
        is_featured: true,
        is_bestseller: true,
        rating_avg: 4.3,
        rating_count: 345,
        views_count: 6500,
        sales_count: 780,
      },
      {
        ugid: uuidv4(),
        category_id: successCategory.id,
        author_id: sharma.id,
        publisher_id: markaz.id,
        title: 'راهبی که فراری‌اش را فروخت',
        title_en: 'The Monk Who Sold His Ferrari',
        slug: 'rahabi-ke-ferrari-ra-forukht',
        description: 'داستان جولیان منتل، وکیل موفقی که پس از حمله قلبی تصمیم به تغییر زندگی می‌گیرد.',
        short_description: 'داستان تحول شخصی',
        isbn: '978-964-305-567-8',
        pages: 224,
        publish_year: 1400,
        language: 'فارسی',
        translator: 'زهرا شامبیاتی',
        format: 'paperback',
        price: 155000,
        compare_price: null,
        discount_percent: 0,
        stock: 67,
        sku: 'BOOK-007',
        is_active: true,
        is_featured: false,
        is_bestseller: false,
        rating_avg: 4.2,
        rating_count: 234,
        views_count: 4500,
        sales_count: 520,
      },
      {
        ugid: uuidv4(),
        category_id: fictionCategory.id,
        author_id: orwell.id,
        publisher_id: amirkabir.id,
        title: '۱۹۸۴',
        title_en: '1984',
        slug: '1984',
        description: 'رمان دیستوپیایی جورج اورول درباره جامعه‌ای توتالیتر تحت حکومت برادر بزرگ.',
        short_description: 'رمان کلاسیک دیستوپیا',
        isbn: '978-964-300-891-2',
        pages: 352,
        publish_year: 1402,
        language: 'فارسی',
        translator: 'صالح حسینی',
        format: 'paperback',
        price: 175000,
        compare_price: 210000,
        discount_percent: 17,
        stock: 43,
        sku: 'BOOK-008',
        is_active: true,
        is_featured: true,
        is_bestseller: true,
        rating_avg: 4.8,
        rating_count: 678,
        views_count: 9800,
        sales_count: 1450,
      },
      {
        ugid: uuidv4(),
        category_id: fictionCategory.id,
        author_id: camus.id,
        publisher_id: cheshmeh.id,
        title: 'بیگانه',
        title_en: 'The Stranger',
        slug: 'biganeh',
        description: 'بیگانه رمانی از آلبر کامو است که داستان مرسو، مردی بی‌تفاوت نسبت به جهان پیرامون را روایت می‌کند.',
        short_description: 'شاهکار اگزیستانسیالیستی',
        isbn: '978-964-6194-45-8',
        pages: 144,
        publish_year: 1399,
        language: 'فارسی',
        translator: 'امیرجلال‌الدین اعلم',
        format: 'paperback',
        price: 125000,
        compare_price: null,
        discount_percent: 0,
        stock: 38,
        sku: 'BOOK-009',
        is_active: true,
        is_featured: false,
        is_bestseller: false,
        rating_avg: 4.6,
        rating_count: 345,
        views_count: 5600,
        sales_count: 670,
      },
      {
        ugid: uuidv4(),
        category_id: fictionCategory.id,
        author_id: murakami.id,
        publisher_id: cheshmeh.id,
        title: 'جنگل نروژی',
        title_en: 'Norwegian Wood',
        slug: 'jangal-norvezhi',
        description: 'جنگل نروژی رمانی عاشقانه از هاروکی موراکامی است.',
        short_description: 'رمان عاشقانه موراکامی',
        isbn: '978-964-6194-56-4',
        pages: 384,
        publish_year: 1400,
        language: 'فارسی',
        translator: 'مهدی غبرائی',
        format: 'paperback',
        price: 185000,
        compare_price: 215000,
        discount_percent: 14,
        stock: 52,
        sku: 'BOOK-010',
        is_active: true,
        is_featured: true,
        is_bestseller: false,
        rating_avg: 4.4,
        rating_count: 267,
        views_count: 4800,
        sales_count: 580,
      },
    ];

    for (const product of products) {
      await db('products').insert(product);
    }
    console.log('✅ Products created');

    // Add product images
    console.log('Creating product images...');
    const allProducts = await db('products').select('id', 'slug');
    for (const product of allProducts) {
      await db('product_images').insert({
        product_id: product.id,
        image_url: `/images/products/${product.slug}.jpg`,
        alt_text: product.slug,
        sort_order: 0,
        is_primary: true,
      });
    }
    console.log('✅ Product images created');

    // Add product tags
    console.log('Creating product tags...');
    const productTags = [
      { slug: 'sad-sal-tanhayi', tags: ['رئالیسم جادویی', 'آمریکای لاتین', 'کلاسیک'] },
      { slug: 'jenayat-va-mokafat', tags: ['روسی', 'کلاسیک', 'فلسفی'] },
      { slug: 'kimiyagar', tags: ['الهام‌بخش', 'سفر', 'خودشناسی'] },
      { slug: 'buf-kur', tags: ['ایرانی', 'سورئال', 'مدرن'] },
      { slug: '1984', tags: ['دیستوپیا', 'سیاسی', 'کلاسیک'] },
    ];

    for (const pt of productTags) {
      const product = await db('products').where({ slug: pt.slug }).first();
      if (product) {
        for (const tag of pt.tags) {
          await db('product_tags').insert({ product_id: product.id, tag });
        }
      }
    }
    console.log('✅ Product tags created');

    // Create coupons
    console.log('Creating coupons...');
    const coupons = [
      {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        min_purchase: 100000,
        max_discount: 50000,
        usage_limit: 1000,
        per_user_limit: 1,
        start_date: new Date(),
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        is_active: true,
      },
      {
        code: 'SUMMER20',
        type: 'percentage',
        value: 20,
        min_purchase: 200000,
        max_discount: 100000,
        usage_limit: 500,
        per_user_limit: 2,
        start_date: new Date(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        is_active: true,
      },
      {
        code: 'FLAT50',
        type: 'fixed',
        value: 50000,
        min_purchase: 300000,
        usage_limit: 200,
        per_user_limit: 1,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        is_active: true,
      },
    ];

    for (const coupon of coupons) {
      await db('coupons').insert(coupon);
    }
    console.log('✅ Coupons created');

    // Create sliders
    console.log('Creating sliders...');
    const sliders = [
      {
        title: 'جشنواره کتاب‌خوانی',
        subtitle: 'تا ۵۰٪ تخفیف روی همه کتاب‌ها',
        image_url: '/images/sliders/slider-1.jpg',
        link: '/products?discount=true',
        button_text: 'مشاهده',
        sort_order: 1,
        is_active: true,
      },
      {
        title: 'تازه‌های نشر',
        subtitle: 'جدیدترین کتاب‌های منتشر شده',
        image_url: '/images/sliders/slider-2.jpg',
        link: '/products?sort=newest',
        button_text: 'خرید کنید',
        sort_order: 2,
        is_active: true,
      },
      {
        title: 'پرفروش‌ترین‌ها',
        subtitle: 'محبوب‌ترین کتاب‌های ماه',
        image_url: '/images/sliders/slider-3.jpg',
        link: '/products?bestseller=true',
        button_text: 'ببینید',
        sort_order: 3,
        is_active: true,
      },
    ];

    for (const slider of sliders) {
      await db('sliders').insert(slider);
    }
    console.log('✅ Sliders created');

    // Create reviews
    console.log('Creating reviews...');
    const reviews = [
      {
        product_id: 1,
        user_id: 2,
        rating: 5,
        title: 'شاهکار!',
        comment: 'یکی از بهترین رمان‌هایی که خوندم. ترجمه هم عالی بود.',
        pros: 'داستان جذاب، ترجمه روان، چاپ با کیفیت',
        cons: '',
        is_verified_purchase: true,
        is_approved: true,
        helpful_count: 23,
      },
      {
        product_id: 1,
        user_id: 3,
        rating: 4,
        title: 'کتاب خوبی بود',
        comment: 'کتاب جالبی بود ولی کمی طولانی بود.',
        pros: 'داستان عمیق',
        cons: 'کمی طولانی',
        is_verified_purchase: true,
        is_approved: true,
        helpful_count: 8,
      },
      {
        product_id: 2,
        user_id: 2,
        rating: 5,
        title: 'عالی',
        comment: 'داستایفسکی همیشه بهترینه.',
        pros: 'عمق فلسفی، شخصیت‌پردازی عالی',
        cons: '',
        is_verified_purchase: true,
        is_approved: true,
        helpful_count: 45,
      },
      {
        product_id: 4,
        user_id: 3,
        rating: 5,
        title: 'الهام‌بخش',
        comment: 'این کتاب زندگی من رو تغییر داد.',
        pros: 'داستان زیبا، پیام عمیق',
        cons: '',
        is_verified_purchase: true,
        is_approved: true,
        helpful_count: 67,
      },
    ];

    for (const review of reviews) {
      await db('reviews').insert(review);
    }
    console.log('✅ Reviews created');

    // Create sample orders
    console.log('Creating sample orders...');
    const product1 = await db('products').where({ slug: 'sad-sal-tanhayi' }).first();
    const product2 = await db('products').where({ slug: 'kimiyagar' }).first();

    const [orderId] = await db('orders').insert({
      order_number: 'ORD-10001234',
      user_id: firstUser.id,
      shipping_name: 'علی محمدی',
      shipping_phone: '09121111111',
      shipping_province: 'تهران',
      shipping_city: 'تهران',
      shipping_postal_code: '1234567890',
      shipping_address: 'خیابان ولیعصر، کوچه سوم، پلاک ۱۲',
      subtotal: 330000,
      shipping_cost: 25000,
      discount_amount: 0,
      total_amount: 355000,
      status: 'delivered',
      payment_status: 'paid',
      shipping_method: 'standard',
      tracking_code: 'POST-123456789',
    });

    await db('order_items').insert([
      {
        order_id: orderId,
        product_id: product1.id,
        product_title: product1.title,
        product_image: `/images/products/${product1.slug}.jpg`,
        price: product1.price,
        quantity: 1,
        total: product1.price,
      },
      {
        order_id: orderId,
        product_id: product2.id,
        product_title: product2.title,
        product_image: `/images/products/${product2.slug}.jpg`,
        price: product2.price,
        quantity: 1,
        total: product2.price,
      },
    ]);
    console.log('✅ Orders created');

    // Create settings
    console.log('Creating settings...');
    const settings = [
      { key_name: 'site_name', value: 'فروشگاه کتاب آنلاین', type: 'string', group_name: 'general' },
      { key_name: 'site_description', value: 'بزرگترین فروشگاه آنلاین کتاب', type: 'string', group_name: 'general' },
      { key_name: 'contact_email', value: 'info@bookstore.com', type: 'string', group_name: 'contact' },
      { key_name: 'contact_phone', value: '021-12345678', type: 'string', group_name: 'contact' },
      { key_name: 'shipping_cost_standard', value: '25000', type: 'number', group_name: 'shipping' },
      { key_name: 'shipping_cost_express', value: '50000', type: 'number', group_name: 'shipping' },
      { key_name: 'free_shipping_threshold', value: '500000', type: 'number', group_name: 'shipping' },
    ];

    for (const setting of settings) {
      await db('settings').insert(setting);
    }
    console.log('✅ Settings created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Admin Login:');
    console.log('   Email: admin@bookstore.com');
    console.log('   Password: admin123');
    console.log('\n📧 Customer Login:');
    console.log('   Email: ali@example.com');
    console.log('   Password: user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
