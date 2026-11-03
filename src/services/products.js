import { getSupabaseOrThrow, SUPABASE_CONFIG, getPublicImageUrl } from '../lib/supabase'

const MOCK_CATEGORIES = [
  { id: 'cat-whey', name: 'Whey', slug: 'whey', sort_order: 1 },
  { id: 'cat-creatine', name: 'Creatine', slug: 'creatine', sort_order: 2 },
  { id: 'cat-eaa', name: 'EAA', slug: 'eaa', sort_order: 3 },
  { id: 'cat-soy', name: 'Soy', slug: 'soy', sort_order: 4 },
]

const placeholder = (text) =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    text,
  )}&image_size=square_hd`

const MOCK_PRODUCTS = [
  {
    id: 'p-1',
    category_id: 'cat-whey',
    category_name: 'Whey',
    name: 'Whey Rule1 R1 5.5lbs (2.5kg) - Vị Vanilla',
    description: 'Whey protein nhập khẩu, hỗ trợ tăng cơ, 70 lần dùng.',
    price: 1590000,
    image_url: placeholder('whey protein supplement jar vanilla flavor gym product on white background'),
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'p-2',
    category_id: 'cat-whey',
    name: 'Whey Isolate 90% - Vị Socola 2kg',
    description: 'Whey isolate ít béo, hấp thụ nhanh.',
    price: 1850000,
    image_url: placeholder('whey isolate protein jar chocolate flavor gym supplement'),
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'p-3',
    category_id: 'cat-creatine',
    name: 'Creatine Monohydrate 500g',
    description: 'Tăng sức mạnh và khối cơ, 100 liều dùng.',
    price: 450000,
    image_url: placeholder('creatine monohydrate powder jar white background gym supplement'),
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'p-4',
    category_id: 'cat-creatine',
    name: 'Creatine HCL 300g',
    description: 'Dạng HCL tan tốt, không đầy bụng.',
    price: 620000,
    image_url: placeholder('creatine HCL supplement product gym product photography'),
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'p-5',
    category_id: 'cat-eaa',
    name: 'EAA Intra Workout 30 servings - Dâu',
    description: 'Bổ sung amino acid trong lúc tập.',
    price: 550000,
    image_url: placeholder('EAA intra workout drink strawberry flavor gym supplement'),
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'p-6',
    category_id: 'cat-eaa',
    name: 'EAA + Caffeine 25 servings - Chanh Tuyết',
    description: 'Năng lượng tập luyện, tăng tập trung.',
    price: 490000,
    image_url: placeholder('EAA energy powder lemon flavor fitness supplement product'),
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'p-7',
    category_id: 'cat-soy',
    name: 'Soy Protein Isolate 1.8kg',
    description: 'Protein thực vật dành cho người ăn chay, không sữa.',
    price: 1190000,
    image_url: placeholder('soy protein isolate vegan jar white background product shot'),
    is_active: true,
    sort_order: 1,
  },
]

function normalizeProduct(p, categoryMap) {
  const category =
    (categoryMap && (categoryMap.get(p.category_id) || categoryMap.get(p.categoryId))) || null
  return {
    id: p.id,
    category_id: p.category_id,
    category_name: p.category_name || category?.name || '',
    name: p.name,
    description: p.description || '',
    price: Number(p.price) || 0,
    image_url: getPublicImageUrl(p.image_url || p.imageUrl) || '',
    is_active: p.is_active !== false,
    sort_order: Number(p.sort_order) || 0,
  }
}

async function _fetchCategories() {
  if (!SUPABASE_CONFIG.enabled) return MOCK_CATEGORIES.slice()
  const supabase = getSupabaseOrThrow()
  const { data, error } = await supabase
    .from('categories')
    .select('id,name,slug,sort_order')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

async function _fetchProducts(activeOnly = true) {
  if (!SUPABASE_CONFIG.enabled) {
    return activeOnly ? MOCK_PRODUCTS.filter((p) => p.is_active) : MOCK_PRODUCTS.slice()
  }
  const supabase = getSupabaseOrThrow()
  let q = supabase
    .from('products')
    .select(
      'id,category_id,name,description,price,image_url,is_active,sort_order,category:categories(id,name)',
    )
  if (activeOnly) q = q.eq('is_active', true)
  q = q.order('sort_order', { ascending: true }).order('created_at', { ascending: false })
  const { data, error } = await q
  if (error) throw error
  return (data || []).map((raw) => {
    const c = raw.category ? (Array.isArray(raw.category) ? raw.category[0] : raw.category) : null
    return normalizeProduct({ ...raw, category_name: c?.name || '' })
  })
}

export async function getCategories() {
  return _fetchCategories()
}

export async function getProductsPublic() {
  const [categories, products] = await Promise.all([
    _fetchCategories(),
    _fetchProducts(true),
  ])
  const categoryMap = new Map(categories.map((c) => [c.id, c]))
  return {
    categories: categories.slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    products: products
      .map((p) => normalizeProduct(p, categoryMap))
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
  }
}

export async function getProductsAdmin() {
  const [categories, products] = await Promise.all([
    _fetchCategories(),
    _fetchProducts(false),
  ])
  const categoryMap = new Map(categories.map((c) => [c.id, c]))
  return {
    categories,
    products: products.map((p) => normalizeProduct(p, categoryMap)),
  }
}

export async function upsertCategory(payload) {
  const supabase = getSupabaseOrThrow()
  const { id, name, slug, sort_order } = payload
  const obj = {
    name,
    slug: slug || String(name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    sort_order: Number(sort_order) || 0,
  }
  if (id) {
    const { error } = await supabase.from('categories').update(obj).eq('id', id)
    if (error) throw error
    return { ...obj, id }
  }
  const { data, error } = await supabase.from('categories').insert(obj).select().single()
  if (error) throw error
  return data
}

export async function deleteCategory(id) {
  const supabase = getSupabaseOrThrow()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function upsertProduct(payload) {
  const supabase = getSupabaseOrThrow()
  const { id, category_id, name, description, price, image_url, is_active, sort_order } = payload
  const obj = {
    category_id,
    name,
    description: description || '',
    price: Number(price) || 0,
    image_url: image_url || null,
    is_active: !!is_active,
    sort_order: Number(sort_order) || 0,
  }
  if (id) {
    const { error } = await supabase.from('products').update(obj).eq('id', id)
    if (error) throw error
    return { ...obj, id }
  }
  const { data, error } = await supabase.from('products').insert(obj).select().single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const supabase = getSupabaseOrThrow()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function uploadProductImage(file) {
  if (!SUPABASE_CONFIG.enabled) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(file)
    })
  }
  const supabase = getSupabaseOrThrow()
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage
    .from(SUPABASE_CONFIG.bucket)
    .upload(path, file, { upsert: false, contentType: file.type })
  if (error) throw error
  return path
}
