import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookStore = defineStore('book', () => {
  /**
   * 图书数据（Mock Data）
   * 说明：由于本项目为前端演示项目，未接入真实后端服务，
   * 图书数据为静态数据，存储在前端状态管理中。
   * 生产环境应替换为真实的后端 API 调用。
   */
  const books = ref([
    {
      id: 1,
      title: '红楼梦',
      author: '曹雪芹',
      price: 59.70,
      originalPrice: 79.00,
      cover: '/cover/red.jpg',
      category: '文学小说',
      description: '中国古典四大名著之首，以贾宝玉、林黛玉、薛宝钗的爱情婚姻故事为主线，描绘了封建社会末期的人情世态。',
      stock: 8,
      sales: 156
    },
    {
      id: 2,
      title: '西游记',
      author: '吴承恩',
      price: 47.20,
      originalPrice: 62.00,
      cover: '/cover/west.jpg',
      category: '文学小说',
      description: '中国古典四大名著之一，讲述唐僧师徒四人西天取经的神话故事。',
      stock: 6,
      sales: 203
    },
    {
      id: 3,
      title: '三国演义',
      author: '罗贯中',
      price: 51.00,
      originalPrice: 68.00,
      cover: '/cover/three.jpg',
      category: '文学小说',
      description: '中国古典四大名著之一，描写了东汉末年到西晋初年之间近百年的历史风云。',
      stock: 5,
      sales: 189
    },
    {
      id: 4,
      title: '水浒传',
      author: '施耐庵',
      price: 50.40,
      originalPrice: 66.00,
      cover: '/cover/water.jpg',
      category: '文学小说',
      description: '中国古典四大名著之一，讲述了北宋末年以宋江为首的108位好汉的故事。',
      stock: 4,
      sales: 145
    },
    {
      id: 5,
      title: '哈利波特与魔法石',
      author: 'J.K.罗琳',
      price: 29.00,
      originalPrice: 39.00,
      cover: '/cover/harry.jpg',
      category: '科幻',
      description: '哈利波特系列第一部，讲述了一个男孩发现自己是巫师并进入霍格沃茨魔法学校的故事。',
      stock: 10,
      sales: 567
    },
    {
      id: 6,
      title: '小王子',
      author: '圣埃克苏佩里',
      price: 22.00,
      originalPrice: 32.00,
      cover: '/cover/wangzi.jpg',
      category: '文学小说',
      description: '法国作家圣埃克苏佩里的经典童话，讲述了小王子从自己星球出发前往地球的旅程。',
      stock: 12,
      sales: 892
    },
    {
      id: 7,
      title: '1984',
      author: '乔治奥威尔',
      price: 38.00,
      originalPrice: 48.00,
      cover: '/cover/1984.jpg',
      category: '文学小说',
      description: '反乌托邦小说经典之作，描绘了一个极权主义统治下的恐怖社会。',
      stock: 6,
      sales: 234
    },
    {
      id: 8,
      title: '傲慢与偏见',
      author: '简奥斯汀',
      price: 45.00,
      originalPrice: 58.00,
      cover: '/cover/aoman.jpg',
      category: '文学小说',
      description: '英国文学史上最受欢迎的小说之一，讲述了伊丽莎白与达西的爱情故事。',
      stock: 8,
      sales: 178
    },
    {
      id: 9,
      title: '老人与海',
      author: '海明威',
      price: 28.00,
      originalPrice: 38.00,
      cover: '/cover/old.jpg',
      category: '文学小说',
      description: '海明威最著名的作品，讲述了一位老渔夫与大马林鱼搏斗的故事。',
      stock: 5,
      sales: 312
    },
    {
      id: 10,
      title: '百年孤独',
      author: '马尔克斯',
      price: 55.00,
      originalPrice: 72.00,
      cover: '/cover/gudu.jpg',
      category: '文学小说',
      description: '魔幻现实主义文学的代表作，描写了布恩迪亚家族七代人的传奇故事。',
      stock: 4,
      sales: 456
    }
  ])

  const categories = ref(['全部', '文学小说', '科幻'])

  function getBookById(id) {
    return books.value.find(book => book.id === Number(id))
  }

  function getBooksByCategory(category) {
    if (category === '全部') {
      return books.value
    }
    return books.value.filter(book => book.category === category)
  }

  function searchBooks(keyword) {
    if (!keyword) return books.value
    const lowerKeyword = keyword.toLowerCase()
    return books.value.filter(
      book =>
        book.title.toLowerCase().includes(lowerKeyword) ||
        book.author.toLowerCase().includes(lowerKeyword)
    )
  }

  return {
    books,
    categories,
    getBookById,
    getBooksByCategory,
    searchBooks
  }
})
